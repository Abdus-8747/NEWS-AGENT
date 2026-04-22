import { Link } from "react-router-dom";
import { TerminalSquare, ArrowLeft } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-[#1f1f1f] bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[#a3a3a3] hover:text-[#ef4444] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="rounded-lg bg-[#ef4444]/10 p-2 ring-1 ring-[#ef4444]/20">
            <TerminalSquare className="h-6 w-6 text-[#ef4444]" />
          </div>
          <div>
            <Link to="/">
              <p className="text-lg font-bold tracking-[2px] text-[#ef4444] uppercase hover:text-white transition-colors">
                DEV9
              </p>
            </Link>
            <div className="flex gap-4 mt-1">
              <Link to="/today" className="text-[10px] sm:text-xs text-[#a3a3a3] hover:text-white transition-colors font-mono">
                [ GLOB_FEED ]
              </Link>
              <Link to="/mynews" className="text-[10px] sm:text-xs text-[#a3a3a3] hover:text-white transition-colors font-mono">
                [ MY_NEWS ]
              </Link>
              <Link to="/github" className="text-[10px] sm:text-xs text-[#a3a3a3] hover:text-[#ef4444] transition-colors font-mono">
                [ GITHUB ]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
