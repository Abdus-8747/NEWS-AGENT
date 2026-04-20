import { useMemo, useState } from "react";
import axios from "axios";
import {
  Newspaper,
  TerminalSquare,
  Mail,
  ShieldCheck,
  Clock3,
  Cpu,
  CheckCircle2,
  Loader2,
  Code2,
  Database,
  Zap,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    if (!isValidEmail) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/v1/users/subscribe`, {
        email: email.trim(),
      });

      const data = res.data;
      const savedUserId = data?.user?.id ?? data?.user_id;
      if (savedUserId) {
        localStorage.setItem("user_id", String(savedUserId));
      }

      setMessage({
        type: "success",
        text: "Subscribed successfully. Your daily tech brief will arrive at 9:00 AM.",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.detail ||
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-0 overflow-hidden flex-1 flex flex-col justify-center">
      {/* Abstract Background Matrix / Grid pattern effect could go here */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-32 items-center">
        <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 uppercase tracking-widest">
              <Cpu className="h-3.5 w-3.5" />
              Automated Intelligence
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl tracking-tight">
              Get Latest Tech News<br/>
              <span className="text-blue-500">At 9 AM</span>
            </h1>

            <p className="max-w-xl text-base leading-Relaxed text-slate-400 sm:text-lg">
              We scrape the internet for the last 24 hours of software engineering news, use AI to filter out the marketing fluff, and deliver raw, practical updates to your inbox.
            </p>

            <div className="grid gap-3 sm:grid-cols-3 pt-4">
              <FeaturePill icon={<Cpu className="h-4 w-4" />} label="AI Curated" />
              <FeaturePill icon={<Clock3 className="h-4 w-4" />} label="Daily Deploy" />
              <FeaturePill icon={<ShieldCheck className="h-4 w-4" />} label="Open Source" />
            </div>
          </div>

          <div
            id="subscribe"
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0D14] p-6 shadow-2xl relative">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl" />
              
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-2">
                   Initialize Sub Routine
                </h2>
                <p className="text-sm text-slate-400">
                  Stay synced with the global codebase.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="dev@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <TerminalSquare className="h-4 w-4" />
                      Commit Subscription
                    </>
                  )}
                </button>

                {message.text && (
                  <div
                    className={`rounded border px-4 py-3 text-sm mt-4 ${
                      message.type === "success"
                        ? "border-green-500/20 bg-green-500/10 text-green-400"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </form>

              <div className="mt-8 border-t border-white/5 pt-6">
                 <div className="space-y-3">
                  <MiniBenefit text="Pull requests from top tech sources" />
                  <MiniBenefit text="AI-summarized pull descriptions" />
                  <MiniBenefit text="No tracking, no spam. Just code." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SYSTEM FEATURES SECTION --- */}
        <section className="border-t border-white/5 bg-[#0A0D14]/50 py-24 backdrop-blur-sm relative z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-16 flex flex-col items-center text-center">
              <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase font-mono">
                [SYS_MODULES]
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-white">
                Under the Hood
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Code2 className="h-6 w-6 text-blue-400" />}
                title="Automated Scraping"
                text="A multi-threaded queue queries popular tech domains continuously, importing raw string data straight to the server."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6 text-blue-400" />}
                title="AI Distillation"
                text="The Gemini NLP pipeline distills thousand-word marketing fluff into brief, action-oriented system summaries."
              />
              <FeatureCard
                icon={<Database className="h-6 w-6 text-blue-400" />}
                title="Deduplication Engine"
                text="Articles map tightly against your User ID inside PostgreSQL/SQLite. You only see payloads you haven't seen before."
              />
            </div>
          </div>
        </section>

        {/* --- CREATOR / DEV SECTION --- */}
        <section className="py-24 relative z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="rounded-2xl border border-white/10 bg-[#0A0D14] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 rounded border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-blue-400">
                   <TerminalSquare className="h-3 w-3" />
                   Developer Console
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Built by Abdus
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-mono">
                  &gt; I built this agent to solve a personal pain point: too many newsletters padding their word count. As an engineer, I needed straight-to-the-point tech news. I hooked up FastAPI, React, and an AI summarizer and decided to share it with the world.
                </p>
              </div>
              
              <div className="w-full max-w-[300px] shrink-0 border border-white/10 rounded-lg p-4 bg-black/40 font-mono text-xs text-slate-500 shadow-inner">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                     <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                     <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                     <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-600">sys_admin.sh</span>
                </div>
                <p><span className="text-green-400">~ $</span> whoami</p>
                <p className="text-blue-300 mt-1">Abdus (Creator)</p>
                <p className="mt-3"><span className="text-green-400">~ $</span> cat tools.json</p>
                <p className="text-yellow-200 mt-1">{"{"}</p>
                <p className="text-yellow-200 ml-4">"lang": "Python, JS",</p>
                <p className="text-yellow-200 ml-4">"db": "PostgreSQL"</p>
                <p className="text-yellow-200">{"}"}</p>
                <p className="mt-3 animate-pulse"><span className="text-green-400">~ $</span> █</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRIBUTE TO CODE BUILDERS --- */}
        <section className="bg-gradient-to-b from-transparent to-blue-900/10 py-20 relative z-10 border-t border-white/5">
          <div className="mx-auto max-w-4xl text-center px-6">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
               <Users className="h-8 w-8 text-blue-400" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-4">
               A product of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Code Builders</span>
             </h3>
             <p className="text-slate-400 text-sm md:text-base leading-relaxed">
               This intelligent agent was envisioned and built alongside the Code Builders community. We believe in elevating software engineering by automating the mundane and building the tools we want to use ourselves. Join us in building the future.
             </p>
          </div>
        </section>
      </main>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#05080F] p-6 hover:border-blue-500/30 transition-colors group">
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-500/10 p-3 group-hover:bg-blue-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed font-mono">{text}</p>
    </div>
  );
}

function FeaturePill({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
      <span className="text-blue-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function MiniBenefit({ text }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
      <p className="text-xs text-slate-400">{text}</p>
    </div>
  );
}