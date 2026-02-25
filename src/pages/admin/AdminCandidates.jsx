import { useState, useEffect } from "react";

export default function AdminCandidates() {
  const [elections, setElections] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setElections(JSON.parse(localStorage.getItem("elections")) || []);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const stored = JSON.parse(localStorage.getItem("candidates_" + selectedId)) || [];
    setCandidates(stored);
  }, [selectedId]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const syncWithElection = (updated, id = selectedId) => {
    const key = "candidates_" + id;
    localStorage.setItem(key, JSON.stringify(updated));
    const els = JSON.parse(localStorage.getItem("elections")) || [];
    const updatedEls = els.map((e) =>
      String(e.id) === String(id) ? { ...e, candidates: updated } : e
    );
    localStorage.setItem("elections", JSON.stringify(updatedEls));
    setElections(updatedEls);
  };

  const handleAdd = () => {
    if (!selectedId) return showToast("Please select an election first", "error");
    if (!name.trim()) return showToast("Enter a candidate name", "error");
    const duplicate = candidates.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
    if (duplicate) return showToast("Candidate already exists", "error");

    const newCandidate = { id: Date.now(), name: name.trim(), description: description.trim(), votes: 0 };
    const updated = [...candidates, newCandidate];
    syncWithElection(updated);
    setCandidates(updated);
    setName("");
    setDescription("");
    showToast(`${name.trim()} added successfully!`);
  };

  const handleDelete = (id) => {
    const updated = candidates.filter((c) => c.id !== id);
    syncWithElection(updated);
    setCandidates(updated);
    showToast("Candidate removed");
  };

  const selectedElection = elections.find((e) => String(e.id) === String(selectedId));
  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const allCandidates = elections.flatMap((e) =>
    (e.candidates || []).map((c) => ({ ...c, electionTitle: e.title, electionId: e.id }))
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.type === "error" ? "bg-red-600" : "bg-green-600"} text-white`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Add and manage candidates for each election</p>
      </div>

      {/* Add Candidate Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Add Candidate</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Select Election *</label>
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setSearch(""); }}
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">-- Choose an election --</option>
              {elections.map((e) => (
                <option key={e.id} value={e.id}>{e.title} ({getStatus(e)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Candidate Full Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Rahul Sharma"
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Short Description (Optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 3rd Year, Computer Science"
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Candidate
        </button>
      </div>

      {/* Candidates for selected election */}
      {selectedId && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {selectedElection?.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</p>
            </div>
            {candidates.length > 0 && (
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..." className="pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition w-48" />
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{search ? "No candidates match your search" : "No candidates yet. Add one above."}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-sm flex-shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{c.name}</p>
                    {c.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{c.description}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{c.votes || 0} votes</p>
                  </div>
                  <button onClick={() => handleDelete(c.id)} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Candidates Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">All Candidates Overview</h3>
        {allCandidates.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">No candidates across any elections yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide py-2 pr-4">Candidate</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide py-2 pr-4">Election</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide py-2">Votes</th>
                </tr>
              </thead>
              <tbody>
                {allCandidates.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-xs flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 text-xs">{c.electionTitle}</td>
                    <td className="py-3">
                      <span className="font-bold text-blue-700 dark:text-blue-400">{c.votes || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
