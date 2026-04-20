import { useState } from "react";
import { ExternalLink, Search, Cpu } from "lucide-react";

export default function Article({ article }) {
  const [showAI, setShowAI] = useState(false);

  return (
    <article className="flex flex-col rounded-xl border border-white/5 bg-[#0A0D14]/80 p-5 relative overflow-hidden group hover:border-blue-500/40 hover:bg-[#0c101add] transition-all duration-200">
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
        <Search className="h-24 w-24" />
      </div>
      
      {article.image_url && (
        <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-black/50 border border-white/5 relative">
           <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center flex-wrap gap-2 text-[10px] uppercase tracking-widest text-slate-500">
            <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
              {article.source}
            </span>
            {article.author && <span className="line-clamp-1">// {article.author}</span>}
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold leading-snug text-white mb-3 group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm leading-relaxed text-slate-400 font-mono">
            &gt; {article.description || "No description available."}
          </p>

          {showAI && article.ai_summary && (
             <div className="mt-4 rounded-md border border-blue-500/20 bg-blue-500/10 p-4 border-l-2 border-l-blue-500">
               <p className="text-sm leading-relaxed text-slate-300 font-sans">
                 <span className="font-bold text-blue-400 mr-2 uppercase tracking-wide text-xs">[AI_SUMM]</span>
                 {article.ai_summary}
               </p>
             </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 relative z-10 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          {article.ai_summary && (
            <button
              onClick={() => setShowAI(!showAI)}
              className="group/btn flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-blue-400 hover:text-blue-300 transition-colors font-mono"
            >
              <Cpu size={14} className="group-hover/btn:animate-pulse" />
              {showAI ? "HIDE_AI_SYS" : "RUN_AI_SYS"}
            </button>
          )}
          {article.published_at && (
             <span className="text-[10px] text-slate-500 font-mono">
               SYS.DATE {new Date(article.published_at).toLocaleDateString()}
             </span>
          )}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
        >
          Execute Read <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
