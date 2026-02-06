import { useMemo, useState } from "react";
import type { CompanySettings } from "@/types";
import {
  IconChart,
  IconDocument,
  IconFleet,
  IconSettings,
  IconWrench,
} from "./ui/Icons";

function StarRow({ rating = 5 }: { rating?: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);
  return (
    <div className="flex items-center gap-1">
      {stars.map((on, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          className={"w-4 h-4 " + (on ? "text-amber-400" : "text-gray-300")}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 17.3 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.3Z" />
        </svg>
      ))}
    </div>
  );
}

function CheckItem({ children }: { children: string }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full"
        style={{ backgroundColor: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.30)" }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  );
}

export default function HomePage(props: {
  companySettings: CompanySettings;
  onGetStarted: () => void;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const companyName = props.companySettings.companyName?.trim();
  const tagline =
    props.companySettings.tagline?.trim() ||
    "Vehicle fleet, service & document tracking";

  const brandLabel = useMemo(
    () => ({
      app: "Fleet Guard",
      company: companyName || "",
    }),
    [companyName]
  );

  const contactEmail = props.companySettings.email?.trim() || "support@fleetguard.app";
  const contactPhone = props.companySettings.phone?.trim() || "+91 00000 00000";

  const navLinkClass =
    "text-sm font-semibold text-gray-200 hover:text-amber-200 transition-colors";

  return (
    <div className="min-h-screen">
      {/* Sticky Nav */}
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,11,11,0.94) 0%, rgba(17,24,39,0.94) 55%, rgba(11,11,11,0.94) 100%)",
          borderBottom: "1px solid rgba(212,175,55,0.22)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {props.companySettings.logo ? (
                <img
                  src={props.companySettings.logo}
                  alt="Logo"
                  className="w-10 h-10 rounded-full bg-white p-1 flex-shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.35)",
                    color: "#FDE68A",
                  }}
                >
                  <IconFleet className="w-5 h-5" />
                </div>
              )}

              <div className="min-w-0">
                <div className="text-white font-extrabold tracking-wide leading-tight truncate">
                  {brandLabel.app}
                </div>
                <div className="text-xs truncate" style={{ color: "rgba(253,230,138,0.82)" }}>
                  {brandLabel.company ? `${brandLabel.company} • ${tagline}` : tagline}
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className={navLinkClass}>Features</a>
              <a href="#pricing" className={navLinkClass}>Pricing</a>
              <a href="#reviews" className={navLinkClass}>Reviews</a>
              <a href="#contact" className={navLinkClass}>Contact</a>
              <a href="#faq" className={navLinkClass}>FAQ</a>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={props.onGetStarted}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl font-bold"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,0.95) 0%, rgba(253,230,138,0.95) 100%)",
                  color: "#111827",
                }}
              >
                Login / Get Started
              </button>

              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl"
                onClick={() => setMobileMenu((v) => !v)}
                style={{
                  backgroundColor: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.28)",
                  color: "#FDE68A",
                }}
                aria-label="Open menu"
              >
                {mobileMenu ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 18 18 6" />
                    <path d="M6 6l12 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenu && (
            <div className="md:hidden mt-3 pb-3">
              <div
                className="rounded-2xl p-3"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(212,175,55,0.18)",
                }}
              >
                <div className="grid grid-cols-2 gap-2">
                  {[{ href: "#features", label: "Features" }, { href: "#pricing", label: "Pricing" }, { href: "#reviews", label: "Reviews" }, { href: "#contact", label: "Contact" }, { href: "#faq", label: "FAQ" }, { href: "#security", label: "Security" }].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileMenu(false)}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-100"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    props.onGetStarted();
                  }}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl font-bold"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(212,175,55,0.95) 0%, rgba(253,230,138,0.95) 100%)",
                    color: "#111827",
                  }}
                >
                  Login / Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "rgba(212,175,55,0.10)",
                border: "1px solid rgba(212,175,55,0.22)",
                color: "#7C5E00",
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.95)" }} />
              Built for bike & car fleets
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Fleet Guard
              <span className="block" style={{ color: "#7C5E00" }}>
                One dashboard for service + documents.
              </span>
            </h1>

            <p className="mt-4 text-lg text-gray-700 max-w-xl">
              Manage vehicles, odometer history, service intervals, and expiry reminders.
              Drill down into upcoming and overdue items and open the exact vehicle in one click.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={props.onGetStarted}
                className="px-5 py-3 rounded-2xl font-bold text-gray-900"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,0.95) 0%, rgba(253,230,138,0.95) 100%)",
                }}
              >
                Launch app
              </button>
              <a
                href="#pricing"
                className="px-5 py-3 rounded-2xl font-semibold bg-white border border-gray-200 text-gray-900 hover:border-amber-300"
              >
                View pricing
              </a>
            </div>

            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
              {[
                { t: "Service status", s: "Upcoming + overdue" },
                { t: "Documents", s: "Expiry reminders" },
                { t: "Analytics", s: "Clickable drill-down" },
                { t: "Excel import", s: "Bulk upload" },
                { t: "Bike + car", s: "India makes/models" },
                { t: "Backup", s: "JSON download" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl bg-white border border-gray-200 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-gray-900">{x.t}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{x.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview panel */}
          <div className="relative">
            <div
              className="rounded-3xl bg-gray-900 text-white p-6 shadow-2xl"
              style={{ border: "1px solid rgba(212,175,55,0.22)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-amber-200/90 font-semibold">
                    Live insights
                  </div>
                  <div className="text-2xl font-extrabold mt-1">
                    At-a-glance control
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(212,175,55,0.14)" }}
                >
                  <IconChart className="w-6 h-6 text-amber-200" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k: "Vehicles", v: "12" },
                  { k: "Upcoming", v: "3", c: "text-amber-200" },
                  { k: "Overdue", v: "1", c: "text-red-300" },
                  { k: "All clear", v: "8", c: "text-green-300" },
                ].map((b) => (
                  <div
                    key={b.k}
                    className="rounded-2xl bg-white/5 border border-white/10 p-4"
                  >
                    <div className="text-xs text-white/70">{b.k}</div>
                    <div className={"text-2xl font-bold mt-1 " + (b.c || "")}>{b.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-xs text-white/70">Next service due</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-semibold">MH01AB1234</div>
                  <div className="text-amber-200 font-extrabold">12 days</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[60%] bg-amber-300" />
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-6 -right-3 hidden sm:block rounded-3xl bg-white p-4 shadow-xl"
              style={{ border: "1px solid rgba(212,175,55,0.22)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(212,175,55,0.10)",
                    border: "1px solid rgba(212,175,55,0.22)",
                    color: "#7C5E00",
                  }}
                >
                  <IconDocument className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Insurance expiring
                  </div>
                  <div className="text-xs text-gray-600">
                    2 vehicles within 30 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Features</h2>
            <p className="text-gray-600 mt-1">
              Everything you need to keep a fleet compliant, serviced, and ready.
            </p>
          </div>
          <a
            href="#pricing"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl font-semibold bg-white border border-gray-200 hover:border-amber-300"
          >
            See plans
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              Icon: IconFleet,
              title: "Fleet dashboard",
              desc: "Search, filter and open any vehicle instantly.",
            },
            {
              Icon: IconWrench,
              title: "Service tracking",
              desc: "5 months / 5000 km defaults, configurable per vehicle.",
            },
            {
              Icon: IconDocument,
              title: "Document validity",
              desc: "Private vs commercial document sets with expiry reminders.",
            },
            {
              Icon: IconChart,
              title: "Analytics",
              desc: "Click upcoming/overdue and open the exact vehicle.",
            },
            {
              Icon: IconSettings,
              title: "Company branding",
              desc: "Add logo, contact details, brand colors, and more.",
            },
            {
              Icon: IconDocument,
              title: "Excel import",
              desc: "Download template and import vehicles/services in bulk.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.22)",
                  color: "#7C5E00",
                }}
              >
                <f.Icon className="w-6 h-6" />
              </div>
              <div className="mt-4 font-extrabold text-gray-900">{f.title}</div>
              <div className="mt-1 text-sm text-gray-600">{f.desc}</div>
              <div className="mt-4 space-y-2">
                <CheckItem>Odometer history with dates</CheckItem>
                <CheckItem>Service + document reminders</CheckItem>
              </div>
            </div>
          ))}
        </div>

        <div id="security" className="mt-10 rounded-3xl bg-white border border-gray-200 p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="font-extrabold text-gray-900">Security & data</div>
              <div className="text-sm text-gray-600 mt-1">
                Use local storage + backups now, or connect Supabase for per-user cloud storage.
              </div>
            </div>
            <div className="space-y-2">
              <CheckItem>Export / Restore backups anytime</CheckItem>
              <CheckItem>Per-user database support (Supabase)</CheckItem>
              <CheckItem>No vendor lock-in (JSON + Excel)</CheckItem>
            </div>
            <div className="space-y-2">
              <CheckItem>Works on mobile & desktop</CheckItem>
              <CheckItem>Installable (Add to Home Screen)</CheckItem>
              <CheckItem>Fast Vite + React app</CheckItem>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Pricing</h2>
            <p className="text-gray-600 mt-1">
              Simple plans. Upgrade only when your fleet grows.
            </p>
          </div>
          <div
            className="hidden sm:block text-xs px-3 py-2 rounded-2xl"
            style={{ backgroundColor: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.22)", color: "#7C5E00" }}
          >
            Prices in INR / year
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Free */}
          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-600">Free</div>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">₹0</div>
                <div className="text-sm text-gray-600 mt-1">Up to 5 vehicles</div>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.22)" }}
              >
                <IconFleet className="w-6 h-6 text-amber-700" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <CheckItem>Fleet dashboard + search</CheckItem>
              <CheckItem>Service reminders</CheckItem>
              <CheckItem>Document expiry reminders</CheckItem>
              <CheckItem>Analytics overview</CheckItem>
            </div>

            <button
              onClick={props.onGetStarted}
              className="mt-6 w-full px-4 py-3 rounded-2xl font-extrabold"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0.95) 0%, rgba(253,230,138,0.95) 100%)",
                color: "#111827",
              }}
            >
              Start free
            </button>
          </div>

          {/* 30 */}
          <div
            className="rounded-3xl p-6 shadow-md"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,11,11,0.96) 0%, rgba(17,24,39,0.96) 100%)",
              border: "1px solid rgba(212,175,55,0.30)",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-amber-200/90">Standard</div>
                <div className="text-3xl font-extrabold text-white mt-1">₹2,000</div>
                <div className="text-sm text-white/70 mt-1">Up to 30 vehicles / year</div>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.28)" }}
              >
                <IconWrench className="w-6 h-6 text-amber-200" />
              </div>
            </div>

            <div className="mt-5 space-y-2 text-white">
              <div className="text-sm text-white/80">Everything in Free, plus:</div>
              <CheckItem>Excel import/export workflow</CheckItem>
              <CheckItem>Service records with cost tracking</CheckItem>
              <CheckItem>Clickable drill-down analytics</CheckItem>
              <CheckItem>Branding & company settings</CheckItem>
            </div>

            <button
              onClick={props.onGetStarted}
              className="mt-6 w-full px-4 py-3 rounded-2xl font-extrabold"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0.95) 0%, rgba(253,230,138,0.95) 100%)",
                color: "#111827",
              }}
            >
              Choose Standard
            </button>
          </div>

          {/* Unlimited */}
          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-600">Pro</div>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">₹3,500</div>
                <div className="text-sm text-gray-600 mt-1">Unlimited vehicles / year</div>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.22)" }}
              >
                <IconChart className="w-6 h-6 text-amber-700" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <CheckItem>Unlimited vehicles</CheckItem>
              <CheckItem>Best for rental fleets</CheckItem>
              <CheckItem>Analytics + reporting</CheckItem>
              <CheckItem>Works great with Supabase</CheckItem>
            </div>

            <button
              onClick={props.onGetStarted}
              className="mt-6 w-full px-4 py-3 rounded-2xl font-extrabold bg-gray-900 hover:bg-black text-amber-200"
            >
              Choose Pro
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Need a custom plan or team setup? Contact us at <a className="font-semibold text-gray-900 hover:underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Client reviews</h2>
            <p className="text-gray-600 mt-1">Loved by fleet operators and rental teams.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <StarRow rating={5} />
            <span className="text-sm font-semibold text-gray-700">4.9/5</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              name: "Aman S.",
              role: "Bike Rental Owner",
              quote:
                "Service reminders and document expiry tracking saved us from missed renewals. The fleet filter is excellent.",
            },
            {
              name: "Priya K.",
              role: "Operations Manager",
              quote:
                "The analytics drill-down is a game changer. Clicking upcoming service shows exactly which vehicles need attention.",
            },
            {
              name: "Rohit M.",
              role: "Fleet Supervisor",
              quote:
                "Excel import helped us onboard 20+ vehicles in minutes. Clean UI and works great on mobile.",
            },
          ].map((r) => (
            <div key={r.name} className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
              <StarRow rating={5} />
              <p className="mt-4 text-gray-700">“{r.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold"
                  style={{ backgroundColor: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.22)", color: "#7C5E00" }}
                >
                  {r.name.slice(0, 1)}
                </div>
                <div>
                  <div className="font-extrabold text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-600">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-4 pb-14">
        <div className="rounded-3xl bg-white border border-gray-200 p-6">
          <h2 className="text-2xl font-extrabold text-gray-900">FAQ</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-5">
            {[
              {
                q: "Can I use it for both bikes and cars?",
                a: "Yes. When adding a vehicle, choose Bike or Car. Make/Model suggestions update accordingly.",
              },
              {
                q: "How are service reminders calculated?",
                a: "Default is 5 months OR 5,000 km (whichever comes first). You can override per vehicle.",
              },
              {
                q: "Can I import data from Excel?",
                a: "Yes. Download the template from Settings → Excel Import/Export, fill it, and upload to merge/replace.",
              },
              {
                q: "Where is my data stored?",
                a: "By default in your browser storage with backups. You can connect Supabase to store per-user data in the cloud.",
              },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl p-4 bg-gray-50 border border-gray-200">
                <div className="font-extrabold text-gray-900">{f.q}</div>
                <div className="text-sm text-gray-700 mt-1">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-4 pb-16">
        <div
          className="rounded-3xl p-8 md:p-10 text-white shadow-xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,11,11,0.96) 0%, rgba(17,24,39,0.96) 50%, rgba(11,11,11,0.96) 100%)",
            border: "1px solid rgba(212,175,55,0.22)",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-extrabold">Contact us</h2>
              <p className="text-white/70 mt-2">
                Want help setting up Fleet Guard for your business? We’ll guide you.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-200 font-bold">Email:</span>
                  <a className="text-white hover:text-amber-200" href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-200 font-bold">Phone:</span>
                  <a className="text-white hover:text-amber-200" href={`tel:${contactPhone.replace(/\s+/g, "")}`}>{contactPhone}</a>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={props.onGetStarted}
                  className="px-6 py-3 rounded-2xl font-extrabold text-gray-900"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(212,175,55,0.95) 0%, rgba(253,230,138,0.95) 100%)",
                  }}
                >
                  Login / Sign up
                </button>
                <a
                  href="#pricing"
                  className="px-6 py-3 rounded-2xl font-semibold bg-white/5 border border-white/10 text-white hover:border-amber-300/50"
                >
                  Compare plans
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <div className="font-extrabold text-amber-200">Useful links</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[{ href: "#features", label: "Features" }, { href: "#pricing", label: "Pricing" }, { href: "#reviews", label: "Reviews" }, { href: "#faq", label: "FAQ" }, { href: "#security", label: "Security" }, { href: "#contact", label: "Contact" }].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-300/40 hover:text-amber-200 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <div className="mt-6 text-xs text-white/60">
                Note: Pricing shown here is the plan guide. In-app billing is not automated yet.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div>
              © 2026 <span className="font-semibold text-gray-700">Fleet Guard</span>. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-700" href="#security">Security</a>
              <a className="hover:text-gray-700" href="#faq">FAQ</a>
              <a className="hover:text-gray-700" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
