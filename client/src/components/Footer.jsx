import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function Footer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(9, 0, 0, 0);
      if (now > target) target.setDate(target.getDate() + 1);

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

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ state: "loading", message: "" });
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      setStatus({ state: "error", message: "You don't have an account. Please login to unsubscribe." });
      return;
    }
    try {
      const result = await axios.post(`${API_BASE}/api/v1/users/unsubscribe`, { email, user_id });
      setStatus({ state: "success", message: result.data.message });
      setEmail("");
    } catch (err) {
      setStatus({ state: "error", message: err.response?.data?.detail || "Failed to unsubscribe." });
    }
  };

  return (
    <footer className="border-t border-[#1f1f1f] bg-[#0A0A0A] py-10 text-xs text-[#a3a3a3] font-mono mt-auto relative z-10 w-full shrink-0">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col md:flex-row justify-between items-center gap-8">

        {/* LEFT: Unsubscribe Form */}
        <div className="w-full md:w-auto">
          <form onSubmit={handleUnsubscribe} className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to unsubscribe"
              className="w-full sm:w-64 bg-[#1a1a1a] border border-[#333] text-white px-4 py-2 rounded-md outline-none focus:border-[#ef4444] transition-colors font-sans text-sm"
              required
              disabled={status.state === "loading"}
            />
            <button
              type="submit"
              disabled={status.state === "loading"}
              className="w-full sm:w-auto bg-[#111] border border-[#ef4444]/50 hover:bg-[#ef4444]/10 text-[#ef4444] px-5 py-2 rounded-md transition-colors uppercase tracking-wider disabled:opacity-50 font-bold"
            >
              {status.state === "loading" ? "Wait..." : "Unsubscribe"}
            </button>
          </form>
          {status.message && (
            <p className={`mt-2 text-sm tracking-wide ${status.state === "error" ? "text-[#ef4444]" : "text-green-500"}`}>
              {status.message}
            </p>
          )}
        </div>

        {/* RIGHT: Timer & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <div className="flex items-center gap-2 text-[#ef4444] font-bold bg-[#ef4444]/10 border border-[#ef4444]/20 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
            <span>NEXT DISPATCH IN // {timeLeft}</span>
          </div>
          <p className="text-[#555]">&copy; {new Date().getFullYear()} DEV9. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}