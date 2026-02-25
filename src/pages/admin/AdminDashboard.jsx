import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("elections")) || [];
    setElections(stored);
  }, []);

  useEffect(() => {
    if (!selectedElectionId) return;
    const stored = JSON.parse(localStorage.getItem("candidates_" + selectedElectionId)) || [];
    setCandidates(stored);
  }, [selectedElectionId]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatus = (election) => {
    const now = new Date();
    if (now < new Date(election.startTime)) return "Upcoming";
    if (now < new Date(election.endTime)) return "Live";
    return "Ended";
  };

  const createElection = () => {
    if (!title || !startTime || !endTime) return showToast("Please fill all fields", "error");
    if (new Date(startTime) >= new Date(endTime)) return showToast("End time must be after start time", "error");

    const newElection = {
      id: Date.now(),
      title,
      startTime,
      endTime,
      votes: 0,
      candidates: [],
    };
    const updated = [...elections, newElection];
    localStorage.setItem("elections", JSON.stringify(updated));
    setElections(updated);
    setTitle(""); setStartTime(""); setEndTime("");
    setShowCreateForm(false);
    showToast("Election created successfully!");
  };

  const addCandidate = () => {
    if (!selectedElectionId || !candidateName.trim()) return showToast("Enter a candidate name", "error");
    const key = "candidates_" + selectedElectionId;
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    const duplicate = stored.find((c) => c.name.toLowerCase() === candidateName.trim().toLowerCase());
    if (duplicate) return showToast("Candidate already exists", "error");

    const newCandidate = { id: Date.now(), name: candidateName.trim(), votes: 0 };
    const updated = [...stored, newCandidate];
    localStorage.setItem(key, JSON.stringify(updated));

    const els = JSON.parse(localStorage.getItem("elections")) || [];
    const updatedEls = els.map((e) =>
      String(e.id) === String(selectedElectionId) ? { ...e, candidates: updated } : e
    );
    localStorage.setItem("elections", JSON.stringify(updatedEls));
    setElections(updatedEls);
    setCandidates(updated);
    setCandidateName("");
    showToast(`${candidateName} added as candidate!`);
  };

  const deleteCandidate = (id) => {
    const key = "candidates_" + selectedElectionId;
    const updated = candidates.filter((c) => c.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));

    const els = JSON.parse(localStorage.getItem("elections")) || [];
    const updatedEls = els.map((e) =>
      String(e.id) === String(selectedElectionId) ? { ...e, candidates: updated } : e
    );
    localStorage.setItem("elections", JSON.stringify(updatedEls));
    setElections(updatedEls);
    setCandidates(updated);
    showToast("Candidate removed");
  };

  const deleteElection = (id) => {
    if (!window.confirm("Are you sure you want to delete this election? This cannot be undone.")) return;
    const updated = elections.filter((e) => e.id !== id);
    localStorage.setItem("elections", JSON.stringify(updated));
    localStorage.removeItem("candidates_" + id);
    setElections(updated);
    showToast("Election deleted");
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const totalElections = elections.length;
  const liveElections = elections.filter((e) => getStatus(e) === "Live").length;
  const totalVotes = elections.reduce((sum, e) => sum + (e.votes || 0), 0);
  const totalCandidates = elections.reduce((sum, e) => sum + (e.candidates?.length || 0), 0);

  const statusBadge = (status) => {
    if (status === "Live")
      return <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live</span>;
    if (status === "Upcoming")
      return <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full">Upcoming</span>;
    return <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">Ended</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all
          ${toast.type === "error"
            ? "bg-red-600 text-white"
            : "bg-green-600 text-white"}`}
        >
          {toast.type === "error"
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-blue-700 dark:border-blue-400">
              <svg className="w-5 h-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">Smart E-Voting</span>
              <span className="ml-2 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-xl transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage elections, candidates, and monitor voting activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Elections", value: totalElections, color: "blue", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
            { label: "Live Elections", value: liveElections, color: "green", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a1 1 0 100-2 1 1 0 000 2z" /></svg> },
            { label: "Total Votes", value: totalVotes, color: "purple", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            { label: "Total Candidates", value: totalCandidates, color: "orange", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4m-4 6v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2h9m4-10a4 4 0 100-8 4 4 0 000 8z" /></svg> },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3
                ${s.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : s.color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : s.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"}`}
              >
                {s.icon}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{s.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1 w-fit">
          {[
            { key: "overview", label: "All Elections" },
            { key: "candidates", label: "Manage Candidates" },
          ].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition
              ${activeTab === t.key ? "bg-blue-800 text-white shadow" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Elections Tab */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Elections</h2>
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-blue-900/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {showCreateForm ? "Cancel" : "Create Election"}
              </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-5 text-lg">New Election</h3>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Election Title</label>
                    <input
                      placeholder="e.g. Student Council 2026"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
                <button onClick={createElection} className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold transition">
                  Create Election →
                </button>
              </div>
            )}

            {/* Elections List */}
            {elections.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No Elections Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Click "Create Election" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {elections.map((e) => {
                  const status = getStatus(e);
                  const totalVotesForE = (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);
                  return (
                    <div key={e.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{e.title}</h3>
                            {statusBadge(status)}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                            {[
                              { label: "Start", value: new Date(e.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) },
                              { label: "End", value: new Date(e.endTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) },
                              { label: "Candidates", value: e.candidates?.length || 0 },
                              { label: "Votes Cast", value: totalVotesForE },
                            ].map((item, i) => (
                              <div key={i} className="bg-gray-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{item.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Candidate list preview */}
                          {e.candidates?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {e.candidates.map((c) => (
                                <span key={c.id || c.name} className="text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full">
                                  {c.name} ({c.votes || 0} votes)
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => deleteElection(e.id)}
                          className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === "candidates" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Candidates</h2>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add Candidate to Election</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Election</label>
                  <select
                    onChange={(e) => setSelectedElectionId(e.target.value)}
                    value={selectedElectionId}
                    className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">-- Select Election --</option>
                    {elections.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Candidate Name</label>
                  <input
                    placeholder="Full name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCandidate()}
                    className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="flex items-end">
                  <button onClick={addCandidate} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition">
                    Add Candidate
                  </button>
                </div>
              </div>
            </div>

            {selectedElectionId && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Candidates — <span className="text-blue-700 dark:text-blue-400">{elections.find((e) => String(e.id) === String(selectedElectionId))?.title}</span>
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</span>
                </div>

                {candidates.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No candidates yet. Add one above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {candidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-sm flex-shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{c.votes || 0} votes received</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCandidate(c.id)}
                          className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
