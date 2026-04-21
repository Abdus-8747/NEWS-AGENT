import { useState } from "react";
import { ExternalLink, Search, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const fallback_img_url = "https://www.shutterstock.com/image-vector/tech-news-symbol-lettering-black-260nw-2583934945.jpg"; // Sleek dark matrix/tech abstract

export default function Article({ article }) {
  const [showAI, setShowAI] = useState(false);

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="flex flex-col rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-6 relative overflow-hidden group hover:border-[#ef4444]/40 hover:shadow-[0_15px_40px_rgba(239,68,68,0.1)] transition-all duration-300"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Search className="h-32 w-32" />
      </div>

      <div className="mb-5 aspect-video w-full overflow-hidden rounded-xl bg-black border border-[#1f1f1f] relative">
        <img
          src={article.image_url || fallback_img_url}
          alt={article.title}
          onError={(e) => { e.currentTarget.src = fallback_img_url; }}
          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center flex-wrap gap-2 text-[10px] uppercase tracking-widest text-[#a3a3a3]">
            <span className="text-[#ef4444] font-bold bg-[#ef4444]/15 border border-[#ef4444]/30 px-2.5 py-1 rounded-md font-mono shadow-[0_0_10px_rgba(239,68,68,0.1)]">
              {article.source}
            </span>
            {article.author && <span className="line-clamp-1">// {article.author}</span>}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold leading-snug text-[#e5e5e5] mb-4 group-hover:text-white transition-colors font-mono tracking-tight">
          {article.title}
        </h3>

        <div className="flex flex-col gap-2 flex-1 pt-1">
          <p className="text-base leading-relaxed text-[#a3a3a3] font-mono border-l-2 border-[#1f1f1f] pl-4 group-hover:border-[#ef4444]/50 transition-colors">
            &gt; {article.description || "No description available."}
          </p>

          {showAI && article.ai_summary && (
            <motion.div
              initial={{ opacity: 0, height: 0, mt: 0 }}
              animate={{ opacity: 1, height: "auto", mt: 16 }}
              className="rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/5 p-5 border-l-2 border-l-[#ef4444] shadow-inner overflow-hidden"
            >
              <p className="text-sm leading-relaxed text-[#d4d4d4] font-mono">
                <span className="font-bold text-[#ef4444] mr-2 uppercase tracking-widest text-xs inline-flex items-center gap-1.5"><Cpu size={14} />[AI_SUMM]</span>
                {article.ai_summary}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-[#1f1f1f] relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          {article.ai_summary && (
            <button
              onClick={() => setShowAI(!showAI)}
              className="group/btn flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#ef4444] hover:text-[#f87171] transition-colors font-mono"
            >
              <Cpu size={16} className="group-hover/btn:animate-pulse" />
              {showAI ? "- HIDE_AI_SYS" : "+ RUN_AI_SYS"}
            </button>
          )}
          {article.published_at && (
            <span className="text-[10px] text-[#6b7280] font-mono tracking-wider">
              SYS.DATE: {new Date(article.published_at).toLocaleDateString()}
            </span>
          )}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#111] border border-[#222] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#e5e5e5] transition-all hover:bg-[#ef4444] hover:border-[#ef4444] hover:text-[#020202] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] font-mono"
        >
          Execute Read <ExternalLink size={14} />
        </a>
      </div>
    </motion.article>
  );
}
