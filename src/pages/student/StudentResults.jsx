import { useEffect, useState } from "react";

export default function StudentResults() {
  const [elections, setElections] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("elections")) || [];
    setElections(stored);
  }, []);

  const now = new Date();

  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const getResult = (election) => {
    if (!election.candidates || election.candidates.length === 0)
      return { status: "No candidates" };
    if (now < new Date(election.endTime)) return { status: "Ongoing" };
    const maxVotes = Math.max(...election.candidates.map((c) => c.votes || 0));
    if (maxVotes === 0) return { status: "No votes" };
    const winners = election.candidates.filter((c) => (c.votes || 0) === maxVotes);
    if (winners.length === 1)
      return { status: "Winner", names: [winners[0].name], votes: maxVotes };
    return { status: "Tie", names: winners.map((w) => w.name), votes: maxVotes };
  };

  const filtered =
    filter === "all"
      ? elections
      : filter === "ended"
      ? elections.filter((e) => getStatus(e) === "Ended")
      : elections.filter((e) => getStatus(e) === "Live");

  const getTotalVotes = (e) =>
    (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);

  const getBarWidth = (votes, total) =>
    total === 0 ? 0 : Math.round((votes / total) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Election Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Live vote counts and final results</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
          {[
            { key: "all", label: "All" },
            { key: "live", label: "Live" },
            { key: "ended", label: "Ended" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition
                ${filter === f.key
                  ? "bg-blue-800 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No elections to show</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((e) => {
            const result = getResult(e);
            const status = getStatus(e);
            const totalVotes = getTotalVotes(e);
            const sortedCandidates = [...(e.candidates || [])].sort(
              (a, b) => (b.votes || 0) - (a.votes || 0)
            );

            return (
              <div
                key={e.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3
                  ${status === "Live" ? "bg-green-50 dark:bg-green-900/10" : status === "Ended" ? "bg-gray-50 dark:bg-slate-800/50" : "bg-yellow-50 dark:bg-yellow-900/10"}`}
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{e.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {status === "Ended" ? `Ended: ${new Date(e.endTime).toLocaleString()}` : `Ends: ${new Date(e.endTime).toLocaleString()}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full
                      ${status === "Live" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : status === "Ended" ? "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}
                    >
                      {status === "Live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />}
                      {status}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 px-3 py-1 rounded-full">
                      {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Candidates */}
                <div className="p-6">
                  {sortedCandidates.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No candidates added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {sortedCandidates.map((c, i) => {
                        const pct = getBarWidth(c.votes || 0, totalVotes);
                        const isWinner =
                          result.status === "Winner" && result.names.includes(c.name);
                        const isTied =
                          result.status === "Tie" && result.names.includes(c.name);

                        return (
                          <div key={c.name || i}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                                  ${isWinner ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                    : isTied ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"}`}
                                >
                                  {i + 1}
                                </div>
                                <span className={`font-semibold text-sm ${isWinner || isTied ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                  {c.name}
                                  {isWinner && <span className="ml-2">🏆</span>}
                                  {isTied && <span className="ml-2">🤝</span>}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{c.votes || 0}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">votes</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({pct}%)</span>
                              </div>
                            </div>
                            <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700
                                  ${isWinner ? "bg-yellow-500"
                                    : isTied ? "bg-blue-600"
                                    : "bg-blue-300 dark:bg-blue-700"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Result Banner */}
                  <div className="mt-5">
                    {result.status === "Ongoing" && (
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Election is still ongoing — results will be final after it ends
                      </div>
                    )}
                    {result.status === "No votes" && (
                      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 rounded-xl px-4 py-3 text-sm font-semibold">
                        No votes were cast in this election
                      </div>
                    )}
                    {result.status === "No candidates" && (
                      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 rounded-xl px-4 py-3 text-sm font-semibold">
                        No candidates were added to this election
                      </div>
                    )}
                    {result.status === "Winner" && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3 flex items-center gap-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wide">Winner</p>
                          <p className="text-yellow-800 dark:text-yellow-300 font-bold">{result.names[0]} — {result.votes} vote{result.votes !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    )}
                    {result.status === "Tie" && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 flex items-center gap-3">
                        <span className="text-2xl">🤝</span>
                        <div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Tie</p>
                          <p className="text-blue-800 dark:text-blue-300 font-bold">{result.names.join(" & ")} — {result.votes} votes each</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
