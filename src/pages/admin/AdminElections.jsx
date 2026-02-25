import { useState, useEffect } from "react";

export default function AdminElections() {
  const [elections, setElections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });

  useEffect(() => {
    setElections(JSON.parse(localStorage.getItem("elections")) || []);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const save = (updated) => {
    localStorage.setItem("elections", JSON.stringify(updated));
    setElections(updated);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.startTime || !form.endTime) return showToast("Please fill all fields", "error");
    if (new Date(form.startTime) >= new Date(form.endTime)) return showToast("End time must be after start time", "error");

    if (editingId) {
      const updated = elections.map((e) =>
        e.id === editingId ? { ...e, title: form.title, startTime: form.startTime, endTime: form.endTime } : e
      );
      save(updated);
      showToast("Election updated!");
      setEditingId(null);
    } else {
      const newEl = { id: Date.now(), title: form.title, startTime: form.startTime, endTime: form.endTime, votes: 0, candidates: [] };
      save([...elections, newEl]);
      showToast("Election created!");
    }
    setForm({ title: "", startTime: "", endTime: "" });
    setShowForm(false);
  };

  const handleEdit = (e) => {
    setForm({ title: e.title, startTime: e.startTime, endTime: e.endTime });
    setEditingId(e.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this election? This cannot be undone.")) return;
    save(elections.filter((e) => e.id !== id));
    localStorage.removeItem("candidates_" + id);
    showToast("Election deleted");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", startTime: "", endTime: "" });
  };

  const filtered = filter === "all" ? elections : elections.filter((e) => getStatus(e).toLowerCase() === filter);

  const statusStyle = {
    Live:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    Upcoming: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    Ended:    "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400",
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Elections</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Create and manage all elections</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: "", startTime: "", endTime: "" }); }}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-blue-900/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          {showForm ? "Cancel" : "New Election"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-5">
            {editingId ? "✏️ Edit Election" : "➕ Create New Election"}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Election Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Student Council 2026"
                className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Start Date & Time *</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">End Date & Time *</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
            <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold text-sm transition shadow-md">
              {editingId ? "Update Election" : "Create Election →"}
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1 w-fit">
        {["all", "live", "upcoming", "ended"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition ${filter === f ? "bg-blue-800 text-white shadow" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>
            {f} {f === "all" ? `(${elections.length})` : f === "live" ? `(${elections.filter(e => getStatus(e) === "Live").length})` : f === "upcoming" ? `(${elections.filter(e => getStatus(e) === "Upcoming").length})` : `(${elections.filter(e => getStatus(e) === "Ended").length})`}
          </button>
        ))}
      </div>

      {/* Elections List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No elections found</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">+ Create your first election</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => {
            const status = getStatus(e);
            const totalVotesEl = (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);
            return (
              <div key={e.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{e.title}</h3>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyle[status]}`}>
                        {status === "Live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1" />}
                        {status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Start", value: new Date(e.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) },
                        { label: "End",   value: new Date(e.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) },
                        { label: "Candidates", value: e.candidates?.length || 0 },
                        { label: "Votes Cast", value: totalVotesEl },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                          <p className="font-bold text-gray-900 dark:text-white text-sm mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(e)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
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
