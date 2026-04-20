import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Article from "../components/Article";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function TodayNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodayNews();
  }, []);

  const fetchTodayNews = async () => {
    try {
      setError("");
      const res = await axios.get(`${API_BASE}/api/v1/news/latest?limit=50`);
      setArticles(res.data.articles || []);
    } catch (err) {
      setError(
         err.response?.data?.detail || 
         err.message || 
         "Unable to load today's news."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-blue-500">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 flex-1">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
          LIVE FEED [LATEST]
        </h1>
      </div>

        {error ? (
          <div className="mb-8 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-mono">
            [ERROR]: {error}
          </div>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {articles.map((article) => (
             <Article key={article.id} article={article} />
          ))}
        </div>

        {!error && articles.length === 0 ? (
          <div className="mt-8 rounded-md border border-white/10 bg-[#0A0D14] p-8 text-center text-sm text-slate-400 font-mono">
            [SYS_MSG]: No payloads detected in the current stream.
          </div>
        ) : null}
    </main>
  );
}