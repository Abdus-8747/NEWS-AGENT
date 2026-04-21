import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Article from "../components/Article";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function MyNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setError("NO_SYSTEM_AUTH: Subscribe via entry terminal first.");
      setLoading(false);
      return;
    }

    fetchNews();
  }, [userId]);

  const fetchNews = async () => {
    try {
      setError("");
      const res = await axios.get(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}/newsletter`);
      setArticles(res.data.articles || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Connection lost: Unable to fetch payload."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-[#020202]">
        <Loader2 className="animate-spin h-10 w-10 text-[#ef4444]" />
      </div>
    );
  }

  return (
    <main className="relative flex-1 w-full bg-[#020202] z-0 overflow-hidden">
      {/* Top Radiant Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 z-0 h-[300px] w-[140%] max-w-6xl bg-gradient-to-b from-[#ef444415] via-transparent to-transparent blur-[100px] pointer-events-none"></div>

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 relative z-10 m-auto mt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12 font-mono border-b border-[#1f1f1f] pb-6"
        >
          <div className="flex items-center justify-center p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <Database className="h-7 w-7 text-[#ef4444]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-white uppercase tracking-tight">
            TARGETED <span className="text-[#a3a3a3] font-light">[PAYLOAD]</span>
          </h1>
        </motion.div>

        {error ? (
          <div className="mb-8 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-5 py-4 text-sm text-[#ef4444] font-mono shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            [ERROR]: {error}
          </div>
        ) : null}

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 lg:gap-10 xl:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {articles.map((article) => (
            <Article key={article.id} article={article} />
          ))}
        </motion.div>

        {!error && articles.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-12 text-center flex flex-col gap-4 shadow-xl">
            <p className="text-sm text-[#ef4444] font-mono uppercase tracking-widest">
              [SYS_MSG]: Inbox queue is empty.
            </p>
            <p className="text-xs text-[#a3a3a3] max-w-md mx-auto leading-relaxed uppercase font-sans">
              Agent is waiting for new automation cycles or try checking the{" "}
              <Link to="/today" className="text-white hover:text-[#ef4444] underline transition-colors">
                global stream
              </Link>.
            </p>
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}