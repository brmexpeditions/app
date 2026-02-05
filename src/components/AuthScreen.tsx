import React, { useEffect, useMemo, useState } from "react";
import {
  getSupabaseDiagnostics,
  isSupabaseConfigured,
  supabase,
  supabaseHealthCheck,
} from "@/lib/supabase";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  createdAt: string;
}

interface AuthScreenProps {
  onLogin: (user: User) => void;
  companySettings: {
    companyName?: string;
    logo?: string;
    primaryColor?: string;
  };
}

const USERS_KEY = "fleet_users";
const SESSION_KEY = "fleet_current_user";

const getUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, companySettings }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSupabaseDebug, setShowSupabaseDebug] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<{
    ok: boolean;
    status?: number;
    body?: string;
    error?: string;
  } | null>(null);
  const [lastSupabaseAuthError, setLastSupabaseAuthError] = useState<string | null>(null);

  const supabaseDiag = useMemo(() => getSupabaseDiagnostics(), []);

  useEffect(() => {
    let cancelled = false;
    if (!isSupabaseConfigured()) {
      setSupabaseHealth(null);
      return;
    }

    supabaseHealthCheck().then((res) => {
      if (cancelled) return;
      setSupabaseHealth(res);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Login form
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 150));

      const idRaw = loginId.trim();
      const id = idRaw.toLowerCase();
      const pass = loginPassword;

      // Supabase mode (preferred when configured)
      if (isSupabaseConfigured() && supabase) {
        setLastSupabaseAuthError(null);

        if (!idRaw.includes("@")) {
          throw new Error(
            "Please login using your email address (Supabase Auth uses email/password)."
          );
        }

        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: idRaw,
          password: pass,
        });

        if (authErr) {
          setLastSupabaseAuthError(authErr.message);
          throw new Error(authErr.message);
        }
        if (!data.user) throw new Error("Login failed: no user returned");

        const u: User = {
          id: data.user.id,
          username: (data.user.email || idRaw).split("@")[0],
          email: data.user.email || idRaw,
          password: "",
          companyName: (data.user.user_metadata as any)?.companyName || "",
          phone: (data.user.user_metadata as any)?.phone || "",
          createdAt: data.user.created_at || new Date().toISOString(),
        };

        // Keep a small local session for UI display; Supabase holds the real session.
        localStorage.setItem(SESSION_KEY, JSON.stringify(u));
        onLogin(u);
        return;
      }

      // Local mode (fallback)
      const users = getUsers();
      const user = users.find(
        (u) =>
          (u.email.toLowerCase() === id || u.username.toLowerCase() === id) &&
          u.password === pass
      );

      if (!user) throw new Error("Invalid email/username or password");

      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      onLogin(user);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 150));

      if (!signupName.trim()) throw new Error("Please enter your full name");
      if (!signupEmail.trim() || !signupEmail.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      if (signupPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      if (signupPassword !== signupConfirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Supabase mode
      if (isSupabaseConfigured() && supabase) {
        const { data, error: authErr } = await supabase.auth.signUp({
          email: signupEmail.trim(),
          password: signupPassword,
          options: {
            data: {
              fullName: signupName.trim(),
              companyName: signupCompany.trim(),
              phone: signupPhone.trim(),
            },
          },
        });

        if (authErr) throw new Error(authErr.message);

        // If email confirmations are ON, user may need to verify before login.
        setSuccess(
          data.session
            ? "Account created! You are logged in."
            : "Account created! Please verify your email (check inbox) and then login."
        );
        setIsLogin(true);
        setLoginId(signupEmail.trim());
        setLoginPassword("");

        setSignupName("");
        setSignupEmail("");
        setSignupPhone("");
        setSignupCompany("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        return;
      }

      // Local mode (fallback)
      const users = getUsers();
      const emailLower = signupEmail.trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === emailLower)) {
        throw new Error("Email already registered. Please login.");
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        companyName: signupCompany.trim() || signupName.trim(),
        phone: signupPhone.trim(),
        createdAt: new Date().toISOString(),
      };

      saveUsers([...users, newUser]);

      setSuccess("Account created! Please login.");
      setIsLogin(true);
      setLoginId(newUser.email);
      setLoginPassword("");

      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupCompany("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          {companySettings.logo ? (
            <img
              src={companySettings.logo}
              alt="Company Logo"
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-white p-2 shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shadow-xl">
              <span className="text-5xl">🏍️</span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-white mb-2">
            {companySettings.companyName || "Fleet Manager"}
          </h1>
          <p className="text-amber-200/80">Vehicle Fleet Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setIsLogin(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-4 font-semibold transition-colors ${
                isLogin
                  ? "bg-gray-900 text-amber-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-4 font-semibold transition-colors ${
                !isLogin
                  ? "bg-gray-900 text-amber-200"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6">
            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isSupabaseConfigured() ? "Email" : "Email or Username"}
                  </label>
                  <input
                    type={isSupabaseConfigured() ? "email" : "text"}
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder={isSupabaseConfigured() ? "you@example.com" : "Email or username"}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {isSupabaseConfigured() && (
                    <p className="text-xs text-gray-500 mt-2">
                      Use the same email you used during Sign Up.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="Your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 text-amber-200 font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

                {isSupabaseConfigured() && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setShowSupabaseDebug((v) => !v)}
                      className="w-full text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      {showSupabaseDebug ? "Hide" : "Show"} Supabase Diagnostics
                    </button>

                    {showSupabaseDebug && (
                      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Configured</span>
                          <span className={supabaseDiag.configured ? "text-green-700" : "text-red-700"}>
                            {supabaseDiag.configured ? "YES" : "NO"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Project host</span>
                          <span className="font-mono">{supabaseDiag.host || "(invalid url)"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Anon key</span>
                          <span className="font-mono">{supabaseDiag.maskedKey}</span>
                        </div>

                        <div className="rounded-lg bg-gray-50 border border-gray-200 p-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Auth health</span>
                            <span>
                              {supabaseHealth
                                ? supabaseHealth.ok
                                  ? `OK (${supabaseHealth.status})`
                                  : `FAIL (${supabaseHealth.status ?? ""})`
                                : "Checking..."}
                            </span>
                          </div>
                          {supabaseHealth?.error && (
                            <div className="mt-1 text-red-700">{supabaseHealth.error}</div>
                          )}
                          {!supabaseHealth?.ok && supabaseHealth?.body && (
                            <pre className="mt-2 whitespace-pre-wrap text-[11px] text-gray-600">
{supabaseHealth.body}
                            </pre>
                          )}
                        </div>

                        {lastSupabaseAuthError && (
                          <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-red-800">
                            <div className="font-semibold">Last auth error</div>
                            <div className="mt-1">{lastSupabaseAuthError}</div>
                          </div>
                        )}

                        <div className="text-[11px] text-gray-500">
                          If you just added env vars in Vercel, you must redeploy. Also ensure Supabase → Authentication → Providers → Email is enabled.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="+91..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password * (min 6)
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="Create password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 text-amber-200 font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-gray-500">
                  {isSupabaseConfigured()
                    ? "Accounts are managed by Supabase Auth."
                    : "Accounts are stored locally in this browser until you add a cloud database."}
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-white/50 mt-6 text-sm">
          © 2024 Fleet Manager
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
