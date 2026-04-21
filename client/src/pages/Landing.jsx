import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  TerminalSquare,
  ShieldCheck,
  Clock3,
  Cpu,
  CheckCircle2,
  Loader2,
  Code2,
  Database,
  Zap,
  Users,
  ChevronRight,
  TrendingUp,
  MailOpen,
  MessageSquareQuote,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import codeBuildersLogo from "../assets/codebuilders.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [focused, setFocused] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [hasUserId, setHasUserId] = useState(false);

  useEffect(() => {
    setHasUserId(!!localStorage.getItem("user_id"));
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(9, 0, 0, 0);

      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target - now;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const format = (num) => num.toString().padStart(2, "0");
      return `${format(hours)}h ${format(minutes)}m ${format(seconds)}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isValidEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email.trim() || !isValidEmail) {
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
        setHasUserId(true);
      }

      setMessage({
        type: "success",
        text: "Subscribed successfully. Your daily tech news will arrive at 9:00 AM.",
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
    <main className="relative z-0 overflow-hidden flex-1 flex flex-col font-sans w-full bg-[#020202]">

      {/* ---------------------------------------------------- */}
      {/* --- HERO SECTION WITH CONSTRAINED GRID & GLOW --- */}
      {/* ---------------------------------------------------- */}
      <section className="relative w-full border-b border-[#1f1f1f] bg-[#020202]">

        {/* HERO SPECIFIC GRID BACKGROUND */}
        <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Top Radiant Glow from Grid */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 h-full w-[140%] max-w-7xl bg-gradient-to-b from-[#ef444420] via-[#ef444405] to-transparent blur-[120px] pointer-events-none"></div>

        <div className="relative mx-auto pt-10 grid min-h-[85vh] w-full max-w-7xl gap-16 px-6 py-16 lg:grid-cols-2 lg:px-10 items-center z-10">
          <motion.div
            className="flex flex-col justify-center space-y-8 relative z-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="inline-flex w-fit items-center gap-2 rounded border border-[#1f1f1f] bg-[#020202] px-3 py-1.5 text-xs font-semibold text-[#ef4444] uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Cpu className="h-3.5 w-3.5" />
              Automated Intelligence
            </motion.div>

            <motion.h1 variants={fadeUp} className="max-w-2xl text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl tracking-tighter">
              Stop reading noise.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#fca5a5]">
                Read what matters.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-[#a3a3a3] font-medium">
              We securely ingest feeds from top developer APIs. Then, our AI agent filters out marketing fluff and perfectly distills tech news into a focused brief—delivered straight to your inbox daily at 9:00 AM.
            </motion.p>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 sm:grid-cols-3 pt-2">
              <FeaturePill icon={<Zap />} label="NewsAPI Hook" delay={0.1} />
              <FeaturePill icon={<Cpu />} label="AI Curation" delay={0.2} />
              <FeaturePill icon={<Clock3 />} label="Daily Deploy" delay={0.3} />
            </motion.div>
          </motion.div>

          {/* Subscribe Terminal Card */}
          <motion.div
            id="subscribe"
            className="flex items-center justify-center lg:justify-end relative z-10"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            {/* Terminal Subtle Glow */}
            <div className="absolute inset-0 bg-[#ef4444]/10 blur-[60px] scale-110 pointer-events-none"></div>

            <div className="w-full max-w-md rounded-xl border border-[#1f1f1f] bg-[#0A0A0A] shadow-2xl relative font-mono overflow-hidden flex flex-col">
              {/* Terminal Header */}
              <div className="bg-[#161b22] px-4 py-3 flex items-center border-b border-[#1f1f1f]">
                <div className="flex gap-2">
                  <span className="inline-block w-3 h-3 bg-[#ff5f56] rounded-full"></span>
                  <span className="inline-block w-3 h-3 bg-[#ffbd2e] rounded-full"></span>
                  <span className="inline-block w-3 h-3 bg-[#27c93f] rounded-full"></span>
                </div>
                <div className="absolute w-full text-center left-0 text-[#6b7280] text-xs font-mono tracking-wider pointer-events-none">
                  daily_sync.sh
                </div>
              </div>

              <div className="p-6">
                <div className="mb-5 font-mono">
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="text-[#ef4444] mb-2 flex items-center gap-2"
                  >
                    <ChevronRight className="h-4 w-4" /> ./init_subscription --sync
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    className={`text-sm text-[#d4d4d4] pl-3 border-l-2 border-[#ef4444]/50 mt-2 w-fit transition-all duration-300 ${hasUserId ? 'bg-[#ef4444]/5 py-2 px-3 rounded-r-md' : 'py-1'}`}
                  >
                    <p>
                      {hasUserId ? "Scheduled" : "Scheduling"} <span className="text-[#ef4444] font-bold">news_agent</span> for 09:00 AM delivery...
                    </p>
                    {hasUserId && timeLeft && (
                      <div className="border-t border-[#ef4444]/10 pt-2 mt-2">
                        <p className="flex items-center gap-2 text-[#a3a3a3] text-xs font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                          T-Minus: <span className="text-white font-bold tracking-wider">{timeLeft}</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-5 text-sans">
                  <div className="relative">
                    <div className={`absolute -inset-[1px] rounded-lg -z-10 transition-opacity duration-300 ${focused ? 'bg-[#ef4444] opacity-20 blur-sm' : 'opacity-0'}`}></div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="dev@local.host"
                      value={email}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded border border-[#1f1f1f] bg-[#020202] px-5 py-4 text-sm text-white outline-none transition placeholder-[#525252] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center gap-2 rounded bg-[#ef4444] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[#020202] transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                  >
                    {loading ? (
                      <><Loader2 className="h-5 w-5 animate-spin text-[#020202]" /> Compiling...</>
                    ) : (
                      <><TerminalSquare className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" /> Commit Subscribe</>
                    )}
                  </motion.button>

                  <AnimatePresence mode="wait">
                    {message.text && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`rounded border px-4 py-3 text-sm mt-4 font-mono flex items-center gap-3 ${message.type === "success"
                          ? "border-[#27c93f]/20 bg-[#27c93f]/10 text-[#27c93f]"
                          : "border-[#ff5f56]/20 bg-[#ff5f56]/10 text-[#ff5f56]"
                          }`}
                      >
                        {message.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                        {message.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <div className="mt-8 border-t border-[#1f1f1f] pt-6">
                  <div className="space-y-3">
                    <MiniBenefit text="Data from real tech sources" />
                    <MiniBenefit text="AI filtering & scoring" />
                    <MiniBenefit text="No tracking, no spam. Just code." />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PIPELINE/WORKFLOW SECTION --- */}
      <section className="relative z-10 py-32 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-20 flex flex-col items-center text-center">
            <div className="inline-flex w-fit items-center gap-2 rounded border border-[#ef4444]/20 bg-[#ef4444]/10 px-3 py-1.5 text-xs font-medium text-[#ef4444] uppercase tracking-widest font-mono mb-6">
              <TrendingUp className="h-3.5 w-3.5" />
              [SYS_MODULES]
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              The Anatomy of Our Curation
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-[#a3a3a3]">
              A look into our backend ingestion and curation workflow. Completely automated, flawlessly executed daily via FastAPI & PostgreSQL.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <WorkflowStep
              number="01"
              icon={<Database className="h-8 w-8 text-[#ef4444]" />}
              title="Data Ingestion"
              desc="Cron jobs awake at 08:50 AM, calling trusted tech APIs to aggregate global software engineering headlines."
            />
            <WorkflowStep
              number="02"
              icon={<Cpu className="h-8 w-8 text-[#ef4444]" />}
              title="AI Content Curation"
              desc="The raw tech news data is fed into an advanced AI model, scoring articles for technical relevance and generating summaries."
            />
            <WorkflowStep
              number="03"
              icon={<MailOpen className="h-8 w-8 text-[#ef4444]" />}
              title="Targeted Delivery"
              desc="At 09:00 AM, our SMTP pipeline maps curated objects to your exact tech preferences and dispatches a clean newsletter."
            />
          </div>
        </div>
      </section>

      {/* --- USER REVIEWS SECTION --- */}
      <section className="relative z-10 py-24 bg-[#020202] border-t border-[#1f1f1f]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center p-4 bg-[#ef4444]/10 rounded-2xl mb-6 border border-[#ef4444]/20">
              <MessageSquareQuote className="h-8 w-8 text-[#ef4444]" />
            </div>
            <p className="text-4xl font-extrabold text-white">
              Trusted by Engineers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ReviewCard
              author="Sarah K."
              role="Senior Frontend Dev"
              text="It actually filters out the medium article fluff and gives me real changelogs and framework updates. Best 9 AM email I get."
            />
            <ReviewCard
              author="James M."
              role="DevOps Engineer"
              text="I used to spend 30 minutes scrolling Reddit for tech news. Now I just read the AI summaries in 2 minutes. Huge time-save."
            />
            <ReviewCard
              author="Rahul T."
              role="Tech Lead"
              text="Clean architecture, no ads, just straight signal. Finding out what happened yesterday in AI and Web takes less than a minute."
            />
          </div>
        </div>
      </section>

      {/* --- CREATOR SECTION --- */}
      <section className="py-24 relative z-10 bg-[#0A0A0A] border-t border-[#1f1f1f] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#ef4444] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="rounded-[2.5rem] border border-[#222] bg-gradient-to-br from-[#111] to-[#050505] p-8 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden"
          >
            {/* Background design elements inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#ef4444]/10 to-transparent blur-3xl pointer-events-none"></div>

            <div className="flex-1 space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ef4444]/30 bg-gradient-to-r from-[#ef4444]/20 to-[#ef4444]/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[#fca5a5] shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <TerminalSquare className="h-4 w-4 text-[#ef4444]" />
                Developer Console
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#a3a3a3] tracking-tight leading-tight pb-2">
                Engineered for <br /> Perfect Clarity.
              </h2>
              <p className="text-[#a3a3a3] text-lg leading-relaxed max-w-xl font-medium">
                Built to eliminate information overload. Operating on a resilient <strong>FastAPI, PostgreSQL, and React</strong> architecture—and driven by an <strong>advanced AI engine</strong>—it autonomously aggregates, curates, and delivers essential tech news directly to your inbox.
              </p>
            </div>

            {/* Enhanced Dev Console */}
            <motion.div
              whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
              style={{ perspective: 1000 }}
              className="w-full max-w-[420px] shrink-0 relative group z-10"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ef4444] to-[#f87171] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative border border-[#2a2a2a] rounded-2xl bg-[#0d0d0d] font-mono text-sm shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Visual Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#2a2a2a]">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_#ff5f5680]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_#ffbd2e80]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_#27c93f80]"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5 text-[#888]" />
                    <span className="text-[11px] font-bold text-[#888] tracking-widest uppercase">agent_config.json</span>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="p-6 text-[13px] leading-[1.6]">
                  <div className="text-[#d4d4d4] mb-3">
                    <span className="text-[#c678dd] italic">const</span> <span className="text-[#61afef]">SystemConfig</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#e5c07b]">{"{"}</span>
                  </div>

                  <div className="pl-5 space-y-2.5">
                    <div>
                      <span className="text-[#98c379]">"architect"</span><span className="text-[#abb2bf]">:</span> <span className="text-[#e5c07b]">"Abdus Samad Shamsi"</span><span className="text-[#abb2bf]">,</span>
                    </div>
                    <div>
                      <span className="text-[#98c379]">"core_stack"</span><span className="text-[#abb2bf]">:</span> <span className="text-[#c678dd]">[</span>
                    </div>
                    <div className="pl-5 text-[#e5c07b]">
                      "FastAPI"<span className="text-[#abb2bf]">,</span> "React"<span className="text-[#abb2bf]">,</span> "PostgreSQL"
                    </div>
                    <div>
                      <span className="text-[#c678dd]">]</span><span className="text-[#abb2bf]">,</span>
                    </div>
                    <div>
                      <span className="text-[#98c379]">"engine"</span><span className="text-[#abb2bf]">:</span> <span className="text-[#e5c07b]">"AI Inference Engine"</span><span className="text-[#abb2bf]">,</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#98c379]">"status"</span><span className="text-[#abb2bf] mr-2">:</span> <span className="text-[#98c379]">"Online"</span>
                      <span className="ml-2 h-2 w-2 rounded-full bg-[#98c379] animate-pulse shadow-[0_0_8px_#98c379]"></span>
                    </div>
                  </div>

                  <div className="text-[#e5c07b] mt-3">{"}"}<span className="text-[#abb2bf]">;</span></div>

                  <div className="mt-6 pt-4 border-t border-[#222] flex justify-between items-center text-[10px] text-[#555] uppercase tracking-widest font-bold">
                    <span>UTF-8</span>
                    <span>TCL: 42ms</span>
                    <span>JSON</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- COMMUNITY TRIBUTE & CTA --- */}
      <section className="py-32 relative z-10 border-t border-[#1f1f1f] bg-black overflow-hidden">
        {/* Abstract animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-b from-[#ef4444]/10 to-transparent rounded-full blur-[100px] opacity-70"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-gradient-to-t from-[#ef4444]/5 to-transparent rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-24">

          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-[#111] border border-[#333] px-4 py-2 mb-8 shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
              </span>
              <span className="text-xs font-semibold text-[#d4d4d4] uppercase tracking-widest">Global Collective</span>
            </div>

            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.05]">
              Empowered By <br />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-gradient-to-r from-[#ef4444]/20 to-transparent blur-xl"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] via-[#f87171] to-[#fca5a5]">
                  Code Builders
                </span>
              </span>
            </h3>

            <p className="text-[#a3a3a3] text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 font-medium">
              Code Builders is a student led community of <span className="text-[#ef4444]">SLICA</span> where we organize hackathons, workshops, and other tech-related events.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-gray-200 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto justify-center overflow-hidden"
              >
                Initialize Agent
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://discord.gg/Q3W88f6h"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-[#111] border border-[#333] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#d4d4d4] transition-all hover:bg-[#1a1a1a] hover:text-white hover:border-[#ef4444]/50 shadow-xl w-full sm:w-auto justify-center group"
              >
                <Users className="h-5 w-5 text-[#ef4444] group-hover:scale-110 transition-transform" />
                Join Community
              </a>
            </div>
          </motion.div>

          {/* Right Image/Logo Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex justify-center lg:justify-end w-full relative"
          >
            {/* Elegant backdrop glow instead of spinning rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ef4444]/5 blur-[80px] rounded-full pointer-events-none z-0"></div>

            <div className="relative group">
              {/* Subtle outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#ef4444]/30 to-[#1f1f1f] opacity-30 blur-xl rounded-[2.5rem] transition-opacity duration-500"></div>

              <div className="relative flex h-72 w-72 md:h-96 md:w-96 items-center justify-center rounded-[2.5rem] bg-[#050505] border border-[#1f1f1f] shadow-2xl overflow-hidden z-10 transition-colors duration-500 hover:border-[#333]">

                {/* Subtle top inner highlight */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ef4444]/20 to-transparent"></div>

                {/* Elegant enterprise corner accents */}
                <div className="absolute top-8 left-8 w-8 h-px bg-[#222]"></div>
                <div className="absolute top-8 left-8 w-px h-8 bg-[#222]"></div>

                <div className="absolute bottom-8 right-8 w-8 h-px bg-[#222]"></div>
                <div className="absolute bottom-8 right-8 w-px h-8 bg-[#222]"></div>

                <img
                  src={codeBuildersLogo}
                  alt="Code Builders Community Logo"
                  className="w-full h-full object-contain p-14 md:p-20 relative z-10 opacity-90 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function WorkflowStep({ number, icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative rounded-2xl border border-[#1f1f1f] bg-[#020202] p-8 transition-all hover:border-[#ef4444]/40 hover:shadow-[0_15px_40px_rgba(239,68,68,0.15)] group font-mono overflow-hidden"
    >
      <div className="absolute top-6 right-6 text-7xl font-extrabold text-[#111] group-hover:text-[#ef4444]/5 transition-colors pointer-events-none select-none z-0">
        {number}
      </div>
      <div className="relative z-10">
        <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-[#ef4444]/10 h-14 w-14 transition border border-[#1f1f1f] group-hover:border-[#ef4444]/30 group-hover:bg-[#ef4444]/20">
          {icon}
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-base text-[#a3a3a3] leading-relaxed line-clamp-3">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeaturePill({ icon, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + delay }}
      className="flex items-center justify-center gap-2 rounded border border-[#1f1f1f] bg-[#0A0A0A] px-3 py-2.5 text-xs font-semibold text-[#e5e5e5] font-mono hover:border-[#ef4444]/50 hover:bg-[#111] transition-colors"
    >
      <span className="text-[#ef4444] [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      <span>{label}</span>
    </motion.div>
  );
}

function MiniBenefit({ text }) {
  return (
    <div className="flex items-start gap-2 font-mono">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#ef4444] flex-shrink-0" />
      <p className="text-xs text-[#a3a3a3]">{text}</p>
    </div>
  );
}

function ReviewCard({ author, role, text }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-8 transition-all hover:border-[#ef4444]/30 shadow-lg flex flex-col justify-between"
    >
      <div>
        <div className="flex gap-1 mb-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-5 w-5 fill-[#ef4444] text-[#ef4444]" />
          ))}
        </div>
        <p className="text-base text-[#d4d4d4] leading-relaxed italic mb-8">"{text}"</p>
      </div>
      <div className="flex items-center gap-4 border-t border-[#1f1f1f] pt-5">
        <div className="h-12 w-12 rounded-full bg-[#111] border border-[#222] flex items-center justify-center font-bold text-[#a3a3a3] text-lg">
          {author.charAt(0)}
        </div>
        <div>
          <p className="text-base font-bold text-white">{author}</p>
          <p className="text-sm text-[#888] font-mono">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}