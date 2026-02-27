import { useState } from "react";

export default function AdminCandidates() {
  const [elections, setElections] = useState(() => JSON.parse(localStorage.getItem("elections")) || []);
  const [selectedId, setSelectedId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateDesc, setCandidateDesc] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const selectedElection = elections.find((e) => String(e.id) === String(selectedId));
  const candidates = selectedElection?.candidates || [];

  const addCandidate = () => {
    if (!selectedId)              return showToast("Select an election first", "error");
    if (!candidateName.trim())    return showToast("Enter a candidate name", "error");
    const dup = candidates.find((c) => c.name.toLowerCase() === candidateName.trim().toLowerCase());
    if (dup)                      return showToast("Candidate already exists", "error");

    const newCandidate = { id: Date.now(), name: candidateName.trim(), description: candidateDesc.trim(), votes: 0 };
    const updated = elections.map((e) =>
      String(e.id) === String(selectedId)
        ? { ...e, candidates: [...(e.candidates || []), newCandidate] }
        : e
    );
    localStorage.setItem("elections", JSON.stringify(updated));
    // Also update legacy candidates_ key
    const updatedEl = updated.find((e) => String(e.id) === String(selectedId));
    localStorage.setItem("candidates_" + selectedId, JSON.stringify(updatedEl.candidates));

    setElections(updated);
    setCandidateName("");
    setCandidateDesc("");
    showToast(`${newCandidate.name} added!`);
  };

  const deleteCandidate = (candidateId) => {
    const updated = elections.map((e) =>
      String(e.id) === String(selectedId)
        ? { ...e, candidates: e.candidates.filter((c) => c.id !== candidateId) }
        : e
    );
    localStorage.setItem("elections", JSON.stringify(updated));
    const updatedEl = updated.find((e) => String(e.id) === String(selectedId));
    localStorage.setItem("candidates_" + selectedId, JSON.stringify(updatedEl.candidates));
    setElections(updated);
    showToast("Candidate removed");
  };

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime))   return "Live";
    return "Ended";
  };

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

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Add and manage candidates for each election</p>
      </div>

      {/* Select election + Add form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-white">Add Candidate</h2>

        {/* Election selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Select Election</label>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition">
            <option value="">-- Choose an election --</option>
            {elections.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} [{getStatus(e)}]
              </option>
            ))}
          </select>
        </div>

        {selectedElection && (
          <>
            {/* Eligibility reminder */}
            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
              <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                <span className="font-bold">Eligibility: </span>
                {selectedElection.eligibility?.scope === "all" ? "All students can vote in this election." : `Targeted — only matching students will see this election.`}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Candidate Name *</label>
                <input value={candidateName} onChange={(e) => setCandidateName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCandidate()}
                  placeholder="Full name"
                  className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Short Description (optional)</label>
                <input value={candidateDesc} onChange={(e) => setCandidateDesc(e.target.value)}
                  placeholder="e.g. 3rd Year, CSE"
                  className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
              </div>
            </div>

            <button onClick={addCandidate}
              className="bg-green-700 hover:bg-green-800 active:scale-95 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition">
              + Add Candidate
            </button>
          </>
        )}
      </div>

      {/* Candidates list */}
      {selectedElection && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Candidates — <span className="text-blue-700 dark:text-blue-400">{selectedElection.title}</span>
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</span>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No candidates added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-sm flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                      {c.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.description}</p>}
                      <p className="text-xs text-gray-400 dark:text-gray-500">{c.votes || 0} votes received</p>
                    </div>
                  </div>
                  <button onClick={() => deleteCandidate(c.id)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All elections summary */}
      {!selectedElection && elections.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">All Elections — Candidate Summary</h2>
          <div className="space-y-3">
            {elections.map((e) => (
              <button key={e.id} onClick={() => setSelectedId(String(e.id))}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-100 dark:border-slate-700 transition text-left">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{e.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{e.candidates?.length || 0} candidates</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
