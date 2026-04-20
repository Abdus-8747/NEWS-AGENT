import { Link } from "react-router-dom";
import { TerminalSquare, ArrowLeft } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-white/5 bg-[#0A0D14]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-blue-400 mr-2 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="rounded-lg bg-blue-600/10 p-2 ring-1 ring-blue-500/20">
            <TerminalSquare className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <Link to="/">
              <p className="text-sm font-bold tracking-tight text-white uppercase hover:text-blue-400 transition-colors">
                Code Builders News Agent
              </p>
            </Link>
            <div className="flex gap-4 mt-1">
              <Link to="/today" className="text-[10px] sm:text-xs text-slate-400 hover:text-blue-400 transition-colors font-mono">
                [ GLOB_FEED ]
              </Link>
              <Link to="/my-news" className="text-[10px] sm:text-xs text-slate-400 hover:text-blue-400 transition-colors font-mono">
                [ MY_INBOX ]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
