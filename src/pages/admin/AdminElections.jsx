import { useState, useEffect } from "react";
import { electionsAPI } from "../../services/api";

// Election types with their default scope
const ELECTION_TYPES = [
  { value: "cr",             label: "CR Election",              scope: "targeted", hint: "Class Representative — target by dept + semester + batch" },
  { value: "student_leader", label: "Student Leader",           scope: "all",      hint: "All students across the institution" },
  { value: "dept_head",      label: "Department Head / Tech Head", scope: "targeted", hint: "Target by department" },
  { value: "sports_captain", label: "Sports Captain",           scope: "all",      hint: "All students" },
  { value: "cultural_head",  label: "Cultural Head",            scope: "all",      hint: "All students" },
  { value: "batch_rep",      label: "Batch Representative",     scope: "targeted", hint: "Target by batch / year" },
  { value: "custom",         label: "Custom Election",          scope: "targeted", hint: "Define your own eligibility" },
];

const SEMESTERS  = ["1st","2nd","3rd","4th","5th","6th","7th","8th"];
const SECTIONS   = ["A","B","C","D","E"];
const PROGRAMS   = ["B.Tech","B.Sc","B.Com","BBA","BCA","M.Tech","M.Sc","MBA","MCA","PhD"];
const DEPARTMENTS = ["Computer Science","Electronics","Mechanical","Civil","Electrical","Information Technology","Chemical","Biotechnology","MBA","MCA"];
const currentYear = new Date().getFullYear();
const BATCHES    = Array.from({ length: 6 }, (_, i) => String(currentYear - 5 + i));

const emptyForm = {
  title: "", type: "", startTime: "", endTime: "",
  scope: "all",
  departments: [], semesters: [], batches: [], programs: [], sections: [],
};

export default function AdminElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function fetchElections() {
      setLoading(true);
      try {
        const data = await electionsAPI.getAll();
        setElections(Array.isArray(data) ? data : []);
      } catch (err) {
        showToast(err.message || "Failed to load elections", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchElections();
  }, []);

  const handleTypeChange = (typeVal) => {
    const found = ELECTION_TYPES.find((t) => t.value === typeVal);
    setForm((f) => ({ ...f, type: typeVal, scope: found?.scope || "all", departments: [], semesters: [], batches: [], programs: [], sections: [] }));
  };

  const toggleArr = (key, val) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter((v) => v !== val) : [...f[key], val],
    }));
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return showToast("Enter election title", "error");
    if (!form.type) return showToast("Select election type", "error");
    if (!form.startTime || !form.endTime) return showToast("Set start and end time", "error");
    if (new Date(form.startTime) >= new Date(form.endTime)) return showToast("End time must be after start time", "error");

    const eligibility = {
      scope: form.scope,
      departments: form.departments,
      semesters: form.semesters,
      batches: form.batches,
      programs: form.programs,
      sections: form.sections,
    };

    try {
      const created = await electionsAPI.create({
        title: form.title.trim(),
        type: form.type,
        startTime: form.startTime,
        endTime: form.endTime,
        eligibility,
      });
      setElections((prev) => [created, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
      showToast("Election created successfully!");
    } catch (err) {
      showToast(err.message || "Failed to create election", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await electionsAPI.delete(id);
      setElections((prev) => prev.filter((e) => e._id !== id));
      setDeleteId(null);
      showToast("Election deleted");
    } catch (err) {
      showToast(err.message || "Failed to delete election", "error");
    }
  };

  const scopeLabel = (e) => {
    if (!e.eligibility || e.eligibility.scope === "all") return "All Students";
    const parts = [];
    if (e.eligibility.departments?.length) parts.push(e.eligibility.departments.join(", "));
    if (e.eligibility.semesters?.length)   parts.push(e.eligibility.semesters.map((s) => s + " Sem").join(", "));
    if (e.eligibility.batches?.length)     parts.push("Batch: " + e.eligibility.batches.join(", "));
    if (e.eligibility.programs?.length)    parts.push(e.eligibility.programs.join(", "));
    if (e.eligibility.sections?.length)     parts.push("Sec: " + e.eligibility.sections.join(", "));
    return parts.join(" · ") || "All Students";
  };

  // Custom items state per field
  const [customInputs, setCustomInputs] = useState({
    departments: "", semesters: "", batches: "", programs: "", sections: "",
  });
  const [showCustomInput, setShowCustomInput] = useState({
    departments: false, semesters: false, batches: false, programs: false, sections: false,
  });
  const [customItems, setCustomItems] = useState({
    departments: [], semesters: [], batches: [], programs: [], sections: [],
  });

  const addCustomItem = (field) => {
    const val = customInputs[field].trim();
    if (!val) return;
    const allItems = [...(field === "departments" ? DEPARTMENTS : field === "semesters" ? SEMESTERS : field === "batches" ? BATCHES : field === "programs" ? PROGRAMS : SECTIONS), ...customItems[field]];
    if (allItems.includes(val)) {
      // just select it
      if (!form[field].includes(val)) toggleArr(field, val);
    } else {
      setCustomItems((prev) => ({ ...prev, [field]: [...prev[field], val] }));
      if (!form[field].includes(val)) toggleArr(field, val);
    }
    setCustomInputs((prev) => ({ ...prev, [field]: "" }));
    setShowCustomInput((prev) => ({ ...prev, [field]: false }));
  };

  const FilterChips = ({ label, items, field }) => {
    const extra = customItems[field] || [];
    const allItems = [...items, ...extra];
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <button
            onClick={() => setShowCustomInput((prev) => ({ ...prev, [field]: !prev[field] }))}
            className="flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Custom
          </button>
        </div>
        {showCustomInput[field] && (
          <div className="flex gap-2 mb-2">
            <input
              value={customInputs[field]}
              onChange={(e) => setCustomInputs((prev) => ({ ...prev, [field]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addCustomItem(field)}
              placeholder={`Type custom ${label.toLowerCase().replace("(s)","")}...`}
              className="flex-1 text-xs p-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button onClick={() => addCustomItem(field)}
              className="px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition">
              Add
            </button>
            <button onClick={() => setShowCustomInput((prev) => ({ ...prev, [field]: false }))}
              className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition">
              Cancel
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {allItems.map((item) => (
            <button key={item} onClick={() => toggleArr(field, item)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition
                ${form[field].includes(item)
                  ? "bg-blue-700 text-white border-blue-700"
                  : extra.includes(item)
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700 hover:border-purple-500"
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600 hover:border-blue-400"}`}>
              {extra.includes(item) && !form[field].includes(item) && <span className="mr-1 text-purple-400">✦</span>}
              {item}
            </button>
          ))}
        </div>
        {form[field].length > 0 && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 font-medium">
            Selected: {form[field].join(", ")}
          </p>
        )}
      </div>
    );
  };

  const statusBadge = (status) => {
    if (status === "Live")     return <span className="flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>Live</span>;
    if (status === "Upcoming") return <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full">Upcoming</span>;
    return <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-gray-400 px-2.5 py-1 rounded-full">Ended</span>;
  };

  const selectedType = ELECTION_TYPES.find((t) => t.value === form.type);

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

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-slate-700">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Delete Election?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This will permanently delete the election and all its candidates. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Elections</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Create and manage elections with targeted eligibility</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-blue-900/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          {showForm ? "Cancel" : "New Election"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Create New Election</h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Election Title</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. CSE 3rd Sem CR Election 2026"
              className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
          </div>

          {/* Election Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Election Type</label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ELECTION_TYPES.map((t) => (
                <button key={t.value} onClick={() => handleTypeChange(t.value)}
                  className={`p-3 rounded-xl border text-left transition
                    ${form.type === t.value
                      ? "border-blue-700 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-blue-300"}`}>
                  <p className={`text-sm font-semibold ${form.type === t.value ? "text-blue-800 dark:text-blue-300" : "text-gray-800 dark:text-gray-200"}`}>{t.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date/Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Start Date & Time</label>
              <input type="datetime-local" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">End Date & Time</label>
              <input type="datetime-local" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
            </div>
          </div>

          {/* Eligibility — only show if targeted */}
          {selectedType && (
            <div className={`rounded-xl p-4 border space-y-4 ${form.scope === "all" ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"}`}>
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 ${form.scope === "all" ? "text-green-600" : "text-blue-600"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/>
                </svg>
                <p className={`text-sm font-semibold ${form.scope === "all" ? "text-green-800 dark:text-green-300" : "text-blue-800 dark:text-blue-300"}`}>
                  {form.scope === "all" ? "✓ Visible to ALL students" : "Targeted — select eligibility criteria below"}
                </p>
              </div>

              {/* Scope toggle */}
              <div className="flex gap-2">
                {["all","targeted"].map((s) => (
                  <button key={s} onClick={() => setForm((f) => ({ ...f, scope: s }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition
                      ${form.scope === s ? "bg-blue-700 text-white border-blue-700" : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600 hover:border-blue-400"}`}>
                    {s === "all" ? "All Students" : "Targeted"}
                  </button>
                ))}
              </div>

              {form.scope === "targeted" && (
                <div className="space-y-4 pt-1">
                  <FilterChips label="Department(s)" items={DEPARTMENTS} field="departments" />
                  <FilterChips label="Semester(s)"   items={SEMESTERS}   field="semesters" />
                  <FilterChips label="Batch / Year"  items={BATCHES}     field="batches" />
                  <FilterChips label="Program(s)"    items={PROGRAMS}    field="programs" />
                  <FilterChips label="Section(s)"    items={SECTIONS}    field="sections" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">Leave a category empty to match all values in that category. ✦ Purple chips are custom-added.</p>
                </div>
              )}
            </div>
          )}

          <button onClick={handleCreate}
            className="w-full bg-blue-800 hover:bg-blue-900 active:scale-95 text-white py-3 rounded-xl font-bold transition shadow-md shadow-blue-900/20">
            Create Election →
          </button>
        </div>
      )}

      {/* Elections List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : elections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No Elections Yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Click "New Election" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {elections.map((e) => {
            const status = getStatus(e);
            const totalV = e.votes ?? (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);
            const typeMeta = ELECTION_TYPES.find((t) => t.value === e.type);
            return (
              <div key={e._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{e.title}</h3>
                      {statusBadge(status)}
                      {e.resultsPublished && <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">Results Published</span>}
                    </div>
                    {typeMeta && <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">{typeMeta.label}</p>}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {[
                        { label: "Start", value: new Date(e.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) },
                        { label: "End",   value: new Date(e.endTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) },
                        { label: "Candidates", value: e.candidates?.length || 0 },
                        { label: "Votes Cast", value: totalV },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Eligibility badge */}
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                      ${e.eligibility?.scope === "all"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/>
                      </svg>
                      {scopeLabel(e)}
                    </div>
                  </div>

                  <button onClick={() => setDeleteId(e._id)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
