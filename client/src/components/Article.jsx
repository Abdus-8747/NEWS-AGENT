import { useState } from "react";
import { ExternalLink, Cpu, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fallback_img_url = "https://www.shutterstock.com/image-vector/tech-news-symbol-lettering-black-260nw-2583934945.jpg";

export default function Article({ article }) {
  const [showAI, setShowAI] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(article.url);
  };

  return (
    <article className="relative w-full h-[calc(100dvh-64px)] bg-black flex flex-col justify-end group overflow-hidden">
      {/* Background Image Full View with Blur */}
      <img
        src={article.image_url || fallback_img_url}
        alt=""
        onError={(e) => { e.currentTarget.src = fallback_img_url; }}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 blur-xl group-hover:scale-105 transition-transform duration-[3s] ease-out pointer-events-none"
      />

      {/* Main Image Fitted */}
      {/* Change object-cover to object-contain */}
      <img
        src={article.image_url || fallback_img_url}
        alt={article.title}
        onError={(e) => { e.currentTarget.src = fallback_img_url; }}
        className="absolute inset-0 w-full h-full object-contain object-[center_35%] md:object-center group-hover:scale-105 transition-transform duration-[3s] ease-out z-0 pb-[25dvh] md:pb-10"
      />

      {/* Subtle Bottom Gradient for Text Readability Only */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#000000]/95 via-[#000000]/60 to-transparent pointer-events-none" />

      {/* Action Sidebar (Instagram/Inshorts style on the right) */}
      <div className="absolute right-3 md:right-6 bottom-24 pb-[env(safe-area-inset-bottom)] flex flex-col gap-6 z-20 items-center">
        <a href={article.url} target="_blank" rel="noreferrer" className="group/action w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-white hover:text-[#ef4444] hover:border-[#ef4444] transition-all shadow-lg">
          <ExternalLink size={20} className="group-hover/action:-rotate-12 transition-transform" />
          <span className="text-[9px] mt-0.5 font-medium font-sans uppercase tracking-widest hidden md:block">Read</span>
        </a>

        {article.ai_summary && (
          <button
            onClick={() => setShowAI(!showAI)}
            className={`group/action w-12 h-12 rounded-full backdrop-blur-xl border flex flex-col items-center justify-center transition-all shadow-lg ${showAI ? 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444]' : 'bg-black/60 border-white/10 text-white hover:border-[#ef4444] hover:text-[#ef4444]'}`}
          >
            <Cpu size={20} className={showAI ? "animate-pulse" : ""} />
            <span className="text-[9px] mt-0.5 font-medium font-sans uppercase tracking-widest hidden md:block">AI</span>
          </button>
        )}

        <button onClick={copyLink} className="group/action w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-white hover:border-gray-400 transition-all shadow-lg">
          <Share2 size={20} className="" />
          <span className="text-[9px] mt-0.5 font-medium font-sans uppercase tracking-widest hidden md:block">Share</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-4 md:px-8 pb-[calc(40px+env(safe-area-inset-bottom))] flex flex-col gap-4 w-[calc(100%-4rem)] md:w-[calc(100%-5rem)] max-h-[85%]">

        {/* Source & Category Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-sm uppercase font-mono font-bold tracking-wider">
          <span className="text-white bg-red-800 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
            {article.source}
          </span>
          {article.category && (
            <span className="text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded border border-white/20">
              {article.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug lg:leading-tight font-sans break-words mb-1" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
          {article.title}
        </h2>

        {/* Content Toggle: Description vs AI Summary */}
        <div className="flex flex-col justify-start overflow-y-auto pr-4 max-h-[30vh] custom-scrollbar pointer-events-auto">
          <AnimatePresence mode="wait">
            {showAI && article.ai_summary ? (
              <motion.div
                key="ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col w-full"
              >
                <p className="text-sm md:text-lg text-gray-100 leading-relaxed font-sans mt-2 font-medium" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>
                  <span className="text-red-400 font-bold mr-2 text-xs uppercase tracking-wider font-mono bg-black/60 px-1 py-0.5 rounded-sm">[AI Summary]</span>
                  {article.ai_summary}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col w-full"
              >
                <p className="text-sm md:text-lg text-gray-200 leading-relaxed font-sans mt-2 font-medium" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>
                  {article.description || "No description provided."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/20 text-xs text-gray-400 font-mono">
          {article.author && <span className="line-clamp-1 truncate max-w-[150px]">{article.author}</span>}
          {article.author && <span>•</span>}
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
        </div>

      </div>
    </article>
  );
}