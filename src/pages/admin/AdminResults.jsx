import { useState, useEffect } from "react";

export default function AdminResults() {
  const [elections, setElections] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setElections(JSON.parse(localStorage.getItem("elections")) || []);
  }, []);

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const getResult = (election) => {
    if (!election.candidates || election.candidates.length === 0) return { status: "No candidates" };
    if (now < new Date(election.endTime)) return { status: "Ongoing" };
    const maxVotes = Math.max(...election.candidates.map((c) => c.votes || 0));
    if (maxVotes === 0) return { status: "No votes" };
    const winners = election.candidates.filter((c) => (c.votes || 0) === maxVotes);
    if (winners.length === 1) return { status: "Winner", name: winners[0].name, votes: maxVotes };
    return { status: "Tie", names: winners.map((w) => w.name), votes: maxVotes };
  };

  const getTotalVotes = (e) => (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);

  const filtered = filter === "all" ? elections
    : filter === "live" ? elections.filter((e) => getStatus(e) === "Live")
    : elections.filter((e) => getStatus(e) === "Ended");

  const statusStyle = {
    Live:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    Upcoming: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    Ended:    "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400",
  };

  // Global stats
  const totalVotesCast  = elections.reduce((s, e) => s + getTotalVotes(e), 0);
  const completedCount  = elections.filter((e) => getStatus(e) === "Ended").length;
  const liveCount       = elections.filter((e) => getStatus(e) === "Live").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Monitor live vote counts and final election results</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Elections", value: elections.length, color: "text-blue-700 dark:text-blue-400" },
          { label: "Live Now",        value: liveCount,        color: "text-green-700 dark:text-green-400" },
          { label: "Completed",       value: completedCount,   color: "text-purple-700 dark:text-purple-400" },
          { label: "Total Votes",     value: totalVotesCast,   color: "text-orange-700 dark:text-orange-400" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{s.label}</p>
            <h3 className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1 w-fit">
        {[{ key: "all", label: `All (${elections.length})` }, { key: "live", label: `Live (${liveCount})` }, { key: "ended", label: `Ended (${completedCount})` }].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${filter === f.key ? "bg-blue-800 text-white shadow" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Results Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500">No elections to show results for.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => {
            const status  = getStatus(e);
            const result  = getResult(e);
            const total   = getTotalVotes(e);
            const isOpen  = expanded === e.id;
            const sorted  = [...(e.candidates || [])].sort((a, b) => (b.votes || 0) - (a.votes || 0));

            return (
              <div key={e.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                  onClick={() => setExpanded(isOpen ? null : e.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">{e.title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusStyle[status]}`}>
                          {status === "Live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1" />}
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{total} votes cast</span>
                        <span>·</span>
                        <span>{e.candidates?.length || 0} candidates</span>
                        <span>·</span>
                        <span>Ends {new Date(e.endTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    {/* Result badge */}
                    {result.status === "Winner" && (
                      <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                        🏆 {result.name}
                      </span>
                    )}
                    {result.status === "Tie" && (
                      <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                        🤝 Tie
                      </span>
                    )}
                    {result.status === "Ongoing" && (
                      <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                        ⏳ Ongoing
                      </span>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-gray-100 dark:border-slate-700 pt-4">
                    {sorted.length === 0 ? (
                      <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No candidates in this election.</p>
                    ) : (
                      <div className="space-y-3 mb-5">
                        {sorted.map((c, i) => {
                          const pct = total === 0 ? 0 : Math.round(((c.votes || 0) / total) * 100);
                          const isWinner = result.status === "Winner" && result.name === c.name;
                          const isTied   = result.status === "Tie" && result.names?.includes(c.name);
                          return (
                            <div key={c.name || i}>
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                    ${isWinner ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                      : isTied ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                      : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}
                                  >{i + 1}</div>
                                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {c.name}
                                    {isWinner && " 🏆"}
                                    {isTied   && " 🤝"}
                                  </span>
                                </div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                  {c.votes || 0} <span className="text-xs font-normal text-gray-400">({pct}%)</span>
                                </div>
                              </div>
                              <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700
                                    ${isWinner ? "bg-yellow-500" : isTied ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-700"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Result Banner */}
                    {result.status === "Winner" && (
                      <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">Winner</p>
                          <p className="font-bold text-yellow-800 dark:text-yellow-300">{result.name} — {result.votes} votes</p>
                        </div>
                      </div>
                    )}
                    {result.status === "Tie" && (
                      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
                        <span className="text-2xl">🤝</span>
                        <div>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Tie</p>
                          <p className="font-bold text-blue-800 dark:text-blue-300">{result.names?.join(" & ")} — {result.votes} votes each</p>
                        </div>
                      </div>
                    )}
                    {result.status === "Ongoing" && (
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-sm font-semibold text-green-700 dark:text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Election is still ongoing — final results after it ends
                      </div>
                    )}
                    {result.status === "No votes" && (
                      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        No votes were cast in this election
                      </div>
                    )}
                    {result.status === "No candidates" && (
                      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        No candidates were added to this election
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
