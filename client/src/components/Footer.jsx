export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0A0D14] py-8 text-center text-xs text-slate-500 font-mono mt-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <p>&copy; {new Date().getFullYear()} Code Builders News Agent. All rights reserved.</p>
        <p>SYSTEM.DATETIME // {new Date().toISOString()}</p>
      </div>
    </footer>
  );
}
