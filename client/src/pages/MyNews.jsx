import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Article from "../components/Article";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function MyNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setError("NO_SYSTEM_AUTH: Subscribe via entry terminal first.");
      setLoading(false);
      return;
    }

    fetchNews();
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowUp") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, articles]);

  const fetchNews = async () => {
    try {
      setError("");
      const res = await axios.get(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}/newsletter`);
      setArticles(res.data.articles || []);
      setCurrentIndex(0);
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

  const handleNext = () => {
    if (currentIndex < articles.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-1 items-center justify-center bg-[#020202]">
        <Loader2 className="animate-spin h-10 w-10 text-[#ef4444]" />
      </div>
    );
  }

  return (
    <main
      className="relative flex-1 w-full bg-[#020202] z-0 overflow-hidden flex flex-col"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* Top Radiant Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 z-0 h-[300px] w-[140%] max-w-6xl bg-gradient-to-b from-[#ef444415] via-transparent to-transparent blur-[100px] pointer-events-none"></div>

      {error ? (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-md w-full rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-5 py-4 text-sm text-[#ef4444] font-mono shadow-[0_0_20px_rgba(239,68,68,0.1)] z-50">
          [ERROR]: {error}
        </div>
      ) : null}

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {articles.length > 0 ? (
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-full h-full relative">
                <Article article={articles[currentIndex]} />
              </div>
            </motion.div>
          </AnimatePresence>
        ) : !error ? (
          <div className="w-full h-full flex items-center justify-center px-4">
            <div className="rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-12 text-center flex flex-col gap-4 shadow-xl max-w-md w-full relative z-10">
              <p className="text-sm text-[#ef4444] font-mono uppercase tracking-widest">
                [SYS_MSG]: Inbox queue is empty.
              </p>
              <p className="text-xs text-[#a3a3a3] max-w-md mx-auto leading-relaxed uppercase font-sans">
                Agent is waiting for new automation cycles or try checking the{" "}
                <Link to="/today" className="text-white hover:text-[#ef4444] underline transition-colors">
                  global stream
                </Link>.
              </p>
            </div>
          </div>
        ) : null}

        {/* Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-[38%] md:top-1/2 md:-translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/50 border text-white flex items-center justify-center"
          >
            <ChevronLeft />
          </button>
        )}

        {currentIndex < articles.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-[38%] md:top-1/2 md:-translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/50 border text-white flex items-center justify-center"
          >
            <ChevronRight />
          </button>
        )}

        {/* Progress indicator */}
        {articles.length > 0 && (
          <div className="absolute top-4 right-4 z-40 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white/70 shadow-lg">
            {currentIndex + 1} / {articles.length}
          </div>
        )}
      </div>
    </main>
  );
}