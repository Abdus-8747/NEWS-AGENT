import { useEffect, useState } from "react";
import { TerminalSquare, ArrowDownToLine, MapPin, Link as LinkIcon, Users, BookOpen, GitFork, Star, Eye, Code2, ShieldCheck, ChevronRight } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const REPO_NAME = "Abdus-8747/NEWS-AGENT";
const GITHUB_USERNAME = "Abdus-8747";

export default function GitHub() {
  const [repo, setRepo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        setLoading(true);
        const [repoRes, contributorsRes, profileRes] = await Promise.all([
          axios.get(`https://api.github.com/repos/${REPO_NAME}`),
          axios.get(`https://api.github.com/repos/${REPO_NAME}/contributors?per_page=6`),
          axios.get(`https://api.github.com/users/${GITHUB_USERNAME}`)
        ]);

        setRepo(repoRes.data);
        setContributors(contributorsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        setError("ERR_CONNECTION_REFUSED: Could not resolve GitHub API.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  return (
    <main className="relative flex-1 w-full bg-[#020202] z-0 overflow-hidden flex flex-col items-center justify-center p-6 py-20 lg:p-10 font-sans">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-[600px] w-[140%] max-w-5xl bg-gradient-to-r from-transparent via-[#ef444415] to-transparent blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-5xl rounded-3xl border border-[#1f1f1f] bg-gradient-to-b from-[#111] to-[#050505] shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden z-10 flex flex-col"
      >
        {/* Terminal Header */}
        <div className="bg-[#161b22]/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-[#222]">
          <div className="flex gap-2">
            <span className="inline-block w-3.5 h-3.5 bg-[#ff5f56] rounded-full shadow-[0_0_8px_#ff5f5680]"></span>
            <span className="inline-block w-3.5 h-3.5 bg-[#ffbd2e] rounded-full shadow-[0_0_8px_#ffbd2e80]"></span>
            <span className="inline-block w-3.5 h-3.5 bg-[#27c93f] rounded-full shadow-[0_0_8px_#27c93f80]"></span>
          </div>
          <div className="absolute w-full text-center left-0 text-[#8b92a0] text-xs font-bold font-mono tracking-widest uppercase pointer-events-none">
            news_agent_repo.sh
          </div>
        </div>

        <div className="p-5 sm:p-8 md:p-12 relative">
          <div className="mb-8 lg:mb-10 font-mono text-xs sm:text-sm md:text-base border-b border-[#1f1f1f] pb-5 lg:pb-6 break-words">
            <p className="text-[#ef4444] mb-3 flex items-start sm:items-center gap-2"><TerminalSquare className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" /> $ ./fetch_repo --target="{REPO_NAME}"</p>
            {loading && <p className="text-[#27c93f] animate-pulse pl-6 sm:pl-6">&gt; Cloning repository configuration...</p>}
            {error && <p className="text-[#ff5f56] pl-6 sm:pl-6">&gt; {error}</p>}
          </div>

          {!loading && !error && repo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="duration-700">

              {/* Creator / Profile Card Full Width Top */}
              {profile && (
                <div className="mb-8 lg:mb-10 rounded-2xl border border-[#1f1f1f] bg-[#050505] p-6 lg:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start group transition-colors hover:border-[#333] shadow-lg w-full">
                  <div className="relative shrink-0 mt-1 sm:mt-0">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-[#ef4444] to-[#f87171] rounded-full blur opacity-10 group-hover:opacity-30 transition duration-700"></div>
                    <img
                      src={profile.avatar_url}
                      alt={profile.login}
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-[#1f1f1f] relative z-10 filter grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xl object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-full border border-[#ef4444]/20 bg-[#ef4444]/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#ef4444] mb-3">
                      The Creator
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">{profile.name || profile.login}</h3>
                    <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-[#888] hover:text-[#ef4444] text-sm mb-3 lg:mb-4 block transition-colors truncate">@{profile.login}</a>
                    <p className="text-[#a3a3a3] text-sm sm:text-base leading-relaxed max-w-3xl mx-auto sm:mx-0 break-words">{profile.bio || "Full-stack developer and AI system architect."}</p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-5 text-xs sm:text-sm font-mono text-[#6b7280]">
                      {profile.location && (
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#ef4444]" />{profile.location}</span>
                      )}
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#ef4444]" />{profile.followers} Followers</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#ef4444]" />{profile.public_repos} Repos</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14">
                {/* Repo Info Left Column */}
                {/* Repo Info Left Column */}
                <div className="flex-1 w-full min-w-0 flex flex-col">
                  {/* Repo Cover Card */}
                  <div className="rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-6 lg:p-8 shadow-xl relative flex-1 flex flex-col group">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#ef4444]/5 to-transparent pointer-events-none rounded-2xl opacity-50"></div>
                    
                    <div className="relative z-10 w-full mb-6 lg:mb-8">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#ef4444]/30 bg-gradient-to-r from-[#ef4444]/20 to-[#ef4444]/5 px-3 sm:px-4 py-1.5 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#fca5a5] shadow-[0_0_15px_rgba(239,68,68,0.1)] mb-4 lg:mb-5">
                        <Code2 className="w-3.5 h-3.5 text-[#ef4444]" />
                        Open Source Core
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#a3a3a3] tracking-tight leading-tight mb-3 lg:mb-4 break-words">
                        {repo.name.replace('-', ' ')}
                      </h1>
                      <p className="text-[#a3a3a3] text-base sm:text-lg leading-relaxed font-medium max-w-xl break-words">
                        {repo.description || "An autonomous, AI-driven tech news aggregator and delivery agent. Open-sourced for the community."}
                      </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full content-start mb-6 lg:mb-8 flex-1">
                      <div className="flex flex-col sm:flex-row px-4 py-4 items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 bg-[#050505] border border-[#1f1f1f] rounded-xl shadow-inner font-mono group/stat transition-colors hover:border-[#ef4444]/40 h-full">
                        <Star className="w-5 h-5 text-[#ffbd2e] group-hover/stat:scale-110 transition-transform shrink-0" />
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                          <span className="text-[#6b7280] text-[10px] uppercase font-bold tracking-widest leading-none mb-1.5">Stars</span>
                          <span className="text-white font-bold text-sm sm:text-base leading-none">{repo.stargazers_count}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-4 items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 bg-[#050505] border border-[#1f1f1f] rounded-xl shadow-inner font-mono group/stat transition-colors hover:border-[#ef4444]/40 h-full">
                        <GitFork className="w-5 h-5 text-[#27c93f] group-hover/stat:scale-110 transition-transform shrink-0" />
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                          <span className="text-[#6b7280] text-[10px] uppercase font-bold tracking-widest leading-none mb-1.5">Forks</span>
                          <span className="text-white font-bold text-sm sm:text-base leading-none">{repo.forks_count}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row px-4 py-4 items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 bg-[#050505] border border-[#1f1f1f] rounded-xl shadow-inner font-mono group/stat transition-colors hover:border-[#ef4444]/40 col-span-2 lg:col-span-1 h-full">
                        <ShieldCheck className="w-5 h-5 text-[#3b82f6] group-hover/stat:scale-110 transition-transform shrink-0" />
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                          <span className="text-[#6b7280] text-[10px] uppercase font-bold tracking-widest leading-none mb-1.5">Issues</span>
                          <span className="text-white font-bold text-sm sm:text-base leading-none">{repo.open_issues_count}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-2 w-full mt-auto">
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="flex items-center justify-center sm:inline-flex gap-3 rounded-xl bg-[#ef4444] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#020202] transition-all hover:bg-[#dc2626] active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.2)] w-full sm:w-auto">
                        View on GitHub
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contribution & Contributors Right Column */}
                <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 space-y-6 flex flex-col">
                  {/* Contribute Card - Desktop/Tablet */}
                  <div className="hidden sm:block rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-6 lg:p-8 shadow-xl relative overflow-hidden group flex-1 lg:flex-none">
                    <div className="absolute inset-0 bg-gradient-to-bl from-[#ef4444]/5 to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-3 mb-5 relative z-10">
                      <div className="p-2 bg-[#ef4444]/10 rounded-lg text-[#ef4444] shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="text-white font-bold text-lg lg:text-xl tracking-tight">Become a Contributor</h3>
                    </div>
                    <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6 relative z-10">
                      We believe in the power of open source. Whether you're fixing a bug, improving the AI parsing engine, or building new UI features, your contributions are strictly welcome.
                    </p>
                    <div className="space-y-3 relative z-10 font-mono text-xs lg:text-sm">
                      <div className="flex items-center gap-3 text-[#d4d4d4]">
                        <span className="text-[#27c93f] font-bold">1.</span> Fork the project
                      </div>
                      <div className="flex items-center gap-3 text-[#d4d4d4]">
                        <span className="text-[#27c93f] font-bold">2.</span> Clone securely to local
                      </div>
                      <div className="flex items-center gap-3 text-[#d4d4d4]">
                        <span className="text-[#27c93f] font-bold">3.</span> Commit your upgrades
                      </div>
                      <div className="flex items-center gap-3 text-[#d4d4d4]">
                        <span className="text-[#27c93f] font-bold">4.</span> Open a Pull Request
                      </div>
                    </div>
                  </div>
                  
                  {/* Contribute Card - Mobile */}
                  <div className="sm:hidden rounded-2xl border border-[#1f1f1f] bg-[#0A0A0A] p-5 shadow-xl relative text-center">
                      <h3 className="text-white font-bold text-lg tracking-tight mb-2">Contributors Welcome</h3>
                      <p className="text-[#a3a3a3] text-xs leading-relaxed font-mono">Fork • Clone • Commit • PR</p>
                  </div>

                  {/* Contributors List */}
                  {contributors.length > 0 && (
                    <div className="rounded-2xl border border-[#1f1f1f] bg-[#020202] p-5 sm:p-6 shadow-inner w-full">
                      <h3 className="font-bold text-xs tracking-widest uppercase mb-4 sm:mb-5 font-mono text-[#8b92a0]">Core Maintainers</h3>
                      <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
                        {contributors.map((user) => (
                          <a
                            key={user.id}
                            href={user.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="relative group block"
                          >
                            <div className="absolute -inset-1 bg-[#ef4444] rounded-full blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                            <img
                              src={user.avatar_url}
                              alt={user.login}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#1f1f1f] group-hover:border-[#ef4444] transition-colors relative z-10 object-cover"
                              title={user.login}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 sm:mt-12 lg:mt-14 pt-5 sm:pt-6 border-t border-[#1f1f1f] text-[#27c93f] flex items-center font-bold font-mono text-xs sm:text-sm max-w-full overflow-hidden">
                ~ $<span className="inline-block w-2 h-4 bg-[#e5e5e5] translate-y-0.5 ml-2 animate-pulse shrink-0"></span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}