import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Database } from "lucide-react";
import { Link } from "react-router-dom";
import Article from "../components/Article";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function MyNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setError("NO_SYSTEM_AUTH: Subscribe via entry terminal first.");
      setLoading(false);
      return;
    }

    fetchNews();
  }, [userId]);

  const fetchNews = async () => {
    try {
      setError("");
      const res = await axios.get(`${API_BASE}/api/v1/users/${encodeURIComponent(userId)}/newsletter`);
      setArticles(res.data.articles || []);
    } catch (err) {
      setError(
          err.response?.data?.detail || 
          err.message || 
          "Connection lost: Unable to fetch payload."
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
        <Database className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
          TARGETED PAYLOAD
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
          <div className="mt-8 rounded-md border border-blue-500/20 bg-blue-900/10 p-8 text-center flex flex-col gap-2">
            <p className="text-sm text-blue-300 font-mono uppercase tracking-widest">
              [SYS_MSG]: Inbox queue is empty.
            </p>
            <p className="text-[10px] text-slate-500 max-w-md mx-auto leading-relaxed uppercase">
              Agent is waiting for new automation cycles or try checking the{" "}
              <Link to="/today" className="text-blue-400 hover:underline">
                global stream
              </Link>.
            </p>
          </div>
        ) : null}
    </main>
  );
}