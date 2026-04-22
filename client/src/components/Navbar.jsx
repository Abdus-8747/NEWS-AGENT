import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TerminalSquare, ArrowLeft, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Global Feed", path: "/today" },
    { name: "My News", path: "/mynews" },
    { name: "GitHub", path: "/github" },
  ];

  // Helper to determine if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-[#1f1f1f] bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Left Side: Logo & Back */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[#a3a3a3] hover:text-[#ef4444] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#ef4444]/10 p-2 ring-1 ring-[#ef4444]/20">
              <TerminalSquare className="h-6 w-6 text-[#ef4444]" />
            </div>
            <Link to="/" className="text-lg font-bold tracking-[2px] text-[#ef4444] hover:text-white transition-colors uppercase">
              DEV9
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(link.path)
                  ? "bg-[#ef4444]/10 text-white"
                  : "text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-[#a3a3a3] hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#1f1f1f] bg-[#0A0A0A] p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                  ? "bg-[#ef4444]/10 text-white"
                  : "text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}