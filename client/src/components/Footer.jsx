import { useState, useEffect } from "react";

export default function Footer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(9, 0, 0, 0); // 09:00 AM

      // If it's already past 9 AM today, set target to 9 AM tomorrow
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

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="border-t border-[#1f1f1f] bg-[#0A0A0A] py-8 text-center text-xs text-[#a3a3a3] font-mono mt-auto relative z-10 w-full shrink-0">
      <div className="flex flex-col items-center justify-center gap-2">
        <p>&copy; {new Date().getFullYear()} DEV9. All rights reserved.</p>
        <div className="flex items-center gap-2 text-[#ef4444] font-bold bg-[#ef4444]/10 border border-[#ef4444]/20 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
          <span>NEXT DISPATCH IN // {timeLeft}</span>
        </div>
      </div>
    </footer>
  );
}
