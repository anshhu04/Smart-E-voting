import { useState } from "react";

// Check if a student is eligible for an election based on its eligibility rules
function isEligible(election, userExtra) {
  const el = election.eligibility;
  if (!el || el.scope === "all") return true;

  const { departments, semesters, batches, programs } = el;

  const matchDept    = !departments?.length || departments.includes(userExtra.department);
  const matchSem     = !semesters?.length   || semesters.includes(userExtra.semester);
  const matchBatch   = !batches?.length     || batches.includes(userExtra.batch);
  const matchProgram = !programs?.length    || programs.includes(userExtra.program);
  const matchSection = !el.sections?.length || el.sections.includes(userExtra.section);

  return matchDept && matchSem && matchBatch && matchProgram && matchSection;
}

export default function StudentResults() {
  const elections  = JSON.parse(localStorage.getItem("elections")) || [];
  const user       = JSON.parse(localStorage.getItem("loggedInUser"));
  const userExtra  = JSON.parse(localStorage.getItem("profile_extra_" + user?.studentId)) || {};

  // Only show elections this student is eligible for
  const eligibleElections = elections.filter((e) => isEligible(e, userExtra));

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime))   return "Live";
    return "Ended";
  };

  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"    ? eligibleElections
    : filter === "ended"               ? eligibleElections.filter((e) => getStatus(e) === "Ended")
    : eligibleElections.filter((e) => getStatus(e) === "Live");

  const totalVotes = (e) => (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);
  const barWidth   = (votes, total) => (total === 0 ? 0 : Math.round((votes / total) * 100));

  const getWinner = (election) => {
    const candidates = election.candidates || [];
    if (!candidates.length) return null;
    const maxVotes = Math.max(...candidates.map((c) => c.votes || 0));
    if (maxVotes === 0) return { status: "no_votes" };
    const winners = candidates.filter((c) => (c.votes || 0) === maxVotes);
    return winners.length === 1
      ? { status: "winner", name: winners[0].name, votes: maxVotes }
      : { status: "tie",    names: winners.map((w) => w.name), votes: maxVotes };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Election Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Results are published by admin after elections end</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
          {[{ key: "all", label: "All" }, { key: "live", label: "Live" }, { key: "ended", label: "Ended" }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition
                ${filter === f.key ? "bg-blue-800 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {eligibleElections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No elections found for your profile.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Make sure your department, semester and batch are set in your profile.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No elections to show for this filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((e) => {
            const status   = getStatus(e);
            const ended    = status === "Ended";
            const published = e.resultsPublished;
            const total    = totalVotes(e);
            const sorted   = [...(e.candidates || [])].sort((a, b) => (b.votes || 0) - (a.votes || 0));
            const winner   = ended ? getWinner(e) : null;

            return (
              <div key={e.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3
                  ${status === "Live" ? "bg-green-50 dark:bg-green-900/10" : status === "Ended" ? "bg-gray-50 dark:bg-slate-800/50" : "bg-yellow-50 dark:bg-yellow-900/10"}`}>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{e.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {status === "Ended" ? `Ended: ${new Date(e.endTime).toLocaleString()}` : `Ends: ${new Date(e.endTime).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full
                      ${status === "Live"     ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : status === "Ended"    ? "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                      : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}>
                      {status === "Live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"/>}
                      {status}
                    </span>
                    {ended && published && (
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                        ✓ Results Published
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Election is live — hide counts */}
                  {status === "Live" && (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"/>
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-300 text-sm">Election is currently live</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Vote counts are hidden while voting is ongoing. Results will be published by admin after the election ends.</p>
                      </div>
                    </div>
                  )}

                  {/* Election ended but not published yet */}
                  {ended && !published && (
                    <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-4">
                      <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <div>
                        <p className="font-semibold text-orange-800 dark:text-orange-300 text-sm">Results not published yet</p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">The admin has not published the results for this election yet. Please check back later.</p>
                      </div>
                    </div>
                  )}

                  {/* Upcoming */}
                  {status === "Upcoming" && (
                    <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-4">
                      <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                        Election starts on {new Date(e.startTime).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Results published — show full results */}
                  {ended && published && (
                    <>
                      {sorted.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No candidates were added.</p>
                      ) : (
                        <>
                          <div className="space-y-4 mb-5">
                            {sorted.map((c, i) => {
                              const pct = barWidth(c.votes || 0, total);
                              const isWinner = winner?.status === "winner" && winner.name === c.name;
                              const isTied   = winner?.status === "tie"    && winner.names.includes(c.name);
                              return (
                                <div key={c.name || i}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                                        ${isWinner ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700" : isTied ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
                                        {i + 1}
                                      </div>
                                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                        {c.name}{isWinner && " 🏆"}{isTied && " 🤝"}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm font-bold text-gray-900 dark:text-white">{c.votes || 0}</span>
                                      <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
                                    </div>
                                  </div>
                                  <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-700
                                      ${isWinner ? "bg-yellow-500" : isTied ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-700"}`}
                                      style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Total votes */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-right mb-4">{total} total vote{total !== 1 ? "s" : ""} cast</p>

                          {/* Winner/Tie/No votes banner */}
                          {winner?.status === "winner" && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3 flex items-center gap-3">
                              <span className="text-2xl">🏆</span>
                              <div>
                                <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">Winner</p>
                                <p className="font-bold text-yellow-800 dark:text-yellow-300">{winner.name} — {winner.votes} votes</p>
                              </div>
                            </div>
                          )}
                          {winner?.status === "tie" && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 flex items-center gap-3">
                              <span className="text-2xl">🤝</span>
                              <div>
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Tie</p>
                                <p className="font-bold text-blue-800 dark:text-blue-300">{winner.names.join(" & ")} — {winner.votes} votes each</p>
                              </div>
                            </div>
                          )}
                          {winner?.status === "no_votes" && (
                            <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-center text-gray-500 text-sm font-semibold">
                              No votes were cast
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
