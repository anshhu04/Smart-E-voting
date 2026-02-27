import { useState } from "react";

export default function AdminResults() {
  const [elections, setElections] = useState(() => JSON.parse(localStorage.getItem("elections")) || []);
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);   // publish confirm
  const [unpublishId, setUnpublishId] = useState(null);

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime))   return "Live";
    return "Ended";
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const togglePublish = (id, publish) => {
    const updated = elections.map((e) =>
      e.id === id ? { ...e, resultsPublished: publish } : e
    );
    localStorage.setItem("elections", JSON.stringify(updated));
    setElections(updated);
    setConfirmId(null);
    setUnpublishId(null);
    showToast(publish ? "Results published! Students can now see results." : "Results unpublished.");
  };

  const endedElections   = elections.filter((e) => getStatus(e) === "Ended");
  const publishedCount   = endedElections.filter((e) => e.resultsPublished).length;
  const unpublishedCount = endedElections.filter((e) => !e.resultsPublished).length;

  const getWinner = (election) => {
    const candidates = election.candidates || [];
    if (candidates.length === 0) return null;
    const maxVotes = Math.max(...candidates.map((c) => c.votes || 0));
    if (maxVotes === 0) return { status: "no_votes" };
    const winners = candidates.filter((c) => (c.votes || 0) === maxVotes);
    return winners.length === 1
      ? { status: "winner", name: winners[0].name, votes: maxVotes }
      : { status: "tie",    names: winners.map((w) => w.name), votes: maxVotes };
  };

  const totalVotes = (e) => (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);

  const sortedCandidates = (e) =>
    [...(e.candidates || [])].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  const barWidth = (votes, total) => (total === 0 ? 0 : Math.round((votes / total) * 100));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
          {toast.msg}
        </div>
      )}

      {/* Publish confirm modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg text-center mb-2">Publish Results?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-5">
              Once published, all eligible students will be able to see the full results and vote counts for this election.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => togglePublish(confirmId, true)} className="flex-1 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold text-sm transition">Publish Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Unpublish confirm modal */}
      {unpublishId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-slate-700">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Unpublish Results?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Students will no longer be able to see results for this election until you publish again.</p>
            <div className="flex gap-3">
              <button onClick={() => setUnpublishId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => togglePublish(unpublishId, false)} className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition">Unpublish</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Results Management</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Publish results when you're ready — students won't see vote counts until you do</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ended Elections", value: endedElections.length, color: "blue" },
          { label: "Published",       value: publishedCount,        color: "green" },
          { label: "Awaiting Publish",value: unpublishedCount,      color: "orange" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 text-center border
            ${s.color === "blue"   ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            : s.color === "green"  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"}`}>
            <p className={`text-2xl font-bold ${s.color === "blue" ? "text-blue-700 dark:text-blue-400" : s.color === "green" ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-bold">Results are hidden by default.</span> Only elections that have <strong>ended</strong> can have their results published. Students will see "Results not published yet" until you publish.
        </p>
      </div>

      {/* Live / Upcoming elections — cannot publish */}
      {elections.filter((e) => getStatus(e) !== "Ended").length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-3">Active / Upcoming Elections</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Results can only be published after an election ends.</p>
          <div className="space-y-2">
            {elections.filter((e) => getStatus(e) !== "Ended").map((e) => {
              const status = getStatus(e);
              return (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{e.title}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status === "Live" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ended elections — can publish */}
      {endedElections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No elections have ended yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ended Elections</h2>
          {endedElections.map((e) => {
            const winner = getWinner(e);
            const total  = totalVotes(e);
            const sorted = sortedCandidates(e);

            return (
              <div key={e.id} className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden
                ${e.resultsPublished ? "border-green-200 dark:border-green-800" : "border-gray-200 dark:border-slate-700"}`}>

                {/* Card header */}
                <div className={`px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3
                  ${e.resultsPublished ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800" : "bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700"}`}>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white">{e.title}</h3>
                      {e.resultsPublished
                        ? <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">✓ Published</span>
                        : <span className="text-xs font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">Unpublished</span>
                      }
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Ended: {new Date(e.endTime).toLocaleString()} · {total} total votes
                    </p>
                  </div>

                  {/* Publish / Unpublish button */}
                  {e.resultsPublished ? (
                    <button onClick={() => setUnpublishId(e.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                      Unpublish
                    </button>
                  ) : (
                    <button onClick={() => setConfirmId(e.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-green-700 hover:bg-green-800 text-white transition shadow-md flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      Publish Results
                    </button>
                  )}
                </div>

                {/* Results body — always visible to admin */}
                <div className="p-6">
                  {sorted.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No candidates in this election.</p>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {sorted.map((c, i) => {
                        const pct = barWidth(c.votes || 0, total);
                        const isWinner = winner?.status === "winner" && winner.name === c.name;
                        const isTied   = winner?.status === "tie"    && winner.names.includes(c.name);
                        return (
                          <div key={c.name || i}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                  ${isWinner ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700" : isTied ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
                                  {i + 1}
                                </div>
                                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                  {c.name}{isWinner && " 🏆"}{isTied && " 🤝"}
                                </span>
                              </div>
                              <div className="text-right text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">{c.votes || 0}</span>
                                <span className="text-gray-400 ml-1 text-xs">({pct}%)</span>
                              </div>
                            </div>
                            <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${isWinner ? "bg-yellow-500" : isTied ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-700"}`}
                                style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Winner/Tie banner */}
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
                    <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 text-sm font-semibold text-center">
                      No votes were cast
                    </div>
                  )}

                  {!e.resultsPublished && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-3 text-center">
                      ⚠ Students cannot see these results until you publish them
                    </p>
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
