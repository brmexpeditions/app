import React, { useMemo, useState } from "react";
import { IconDocument, IconSearch } from "@/components/ui/Icons";

type LinkItem = {
  title: string;
  description: string;
  url: string;
  badge?: string;
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

const HelpCenter: React.FC = () => {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const links: LinkItem[] = [
    {
      title: "Netlify Dashboard",
      description: "Manage sites, deploys, domains, and environment variables.",
      url: "https://app.netlify.com/",
      badge: "Hosting",
    },
    {
      title: "Netlify Drop (Drag & Drop deploy)",
      description: "Fastest way to deploy: drop your dist/ folder.",
      url: "https://app.netlify.com/drop",
      badge: "Deploy",
    },
    {
      title: "Vercel Dashboard",
      description: "Deploy & manage your projects on Vercel.",
      url: "https://vercel.com/dashboard",
      badge: "Hosting",
    },
    {
      title: "Create a new Vercel Project",
      description: "Start a new deployment from Git.",
      url: "https://vercel.com/new",
      badge: "Deploy",
    },
    {
      title: "Firebase Console",
      description: "Create projects, enable Hosting/Database/Auth.",
      url: "https://console.firebase.google.com/",
      badge: "Database",
    },
    {
      title: "Supabase Dashboard",
      description: "Create projects, Auth, Database (Postgres), API keys.",
      url: "https://supabase.com/dashboard",
      badge: "Database",
    },
    {
      title: "Create a new Supabase Project",
      description: "Direct link to create a project.",
      url: "https://supabase.com/dashboard/new",
      badge: "Setup",
    },
    {
      title: "GitHub - New Repository",
      description: "Create a repo to enable Git-based deployments.",
      url: "https://github.com/new",
      badge: "Git",
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
    );
  }, [links, query]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Help & Verified Links</h1>
            <p className="text-sm text-gray-600 mt-1">
              These are verified working URLs. If links don’t open on mobile, try long-press → “Open in browser”.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
               style={{ backgroundColor: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.25)", color: "#7c6516" }}>
            <IconDocument className="w-4 h-4" />
            <span>Quick access</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search links (netlify, vercel, firebase, supabase...)"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((l) => (
          <div key={l.url} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-900 truncate">{l.title}</h2>
                  {l.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(212,175,55,0.14)", color: "#7c6516", border: "1px solid rgba(212,175,55,0.25)" }}
                    >
                      {l.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{l.description}</p>
              </div>
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(l.url);
                  showToast(ok ? "Link copied" : "Copy failed");
                }}
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "rgba(17,24,39,0.04)", border: "1px solid rgba(17,24,39,0.10)" }}
              >
                Copy
              </button>
            </div>

            <div className="mt-4">
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 underline underline-offset-4 break-all"
              >
                {l.url}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900">Troubleshooting: If links won’t open</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>On mobile, long-press the link → choose <strong>Open in browser</strong>.</li>
          <li>If you installed the app as a home-screen shortcut, your phone may open links inside an in-app view.</li>
          <li>Try opening the site in Chrome/Safari directly (not inside Instagram/WhatsApp browser).</li>
        </ul>
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-xl text-sm text-white shadow-lg"
               style={{ backgroundColor: "rgba(17,24,39,0.92)", border: "1px solid rgba(212,175,55,0.25)" }}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
