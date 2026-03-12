import { useState, useEffect } from "react";
import { usersAPI, votesAPI } from "../../services/api";

export default function AdminVoters() {
  const [students,  setStudents]  = useState([]);
  const [allVotes,  setAllVotes]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  const [search,      setSearch]      = useState("");
  const [filterDept,  setFilterDept]  = useState("");
  const [filterSem,   setFilterSem]   = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  // ── Fetch from backend ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [usersData] = await Promise.all([
          usersAPI.getAll(),
        ]);
        setStudents(usersData);
      } catch (err) {
        console.error("Failed to load voters:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Unique filter options from fetched students ───────────────────────────
  const allDepts   = [...new Set(students.map((s) => s.department).filter(Boolean))];
  const allSems    = [...new Set(students.map((s) => s.semester).filter(Boolean))];
  const allBatches = [...new Set(students.map((s) => s.batch).filter(Boolean))];

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = students.filter((s) => {
    const matchSearch = !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase());
    const matchDept  = !filterDept  || s.department === filterDept;
    const matchSem   = !filterSem   || s.semester   === filterSem;
    const matchBatch = !filterBatch || s.batch      === filterBatch;
    return matchSearch && matchDept && matchSem && matchBatch;
  });

  const initials = (name) =>
    (name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voters</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          {students.length} registered student{students.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: students.length,                                              color: "blue"   },
          { label: "Profile Complete", value: students.filter((s) => s.department && s.semester).length, color: "green"  },
          { label: "No Profile Yet",   value: students.filter((s) => !s.department).length,              color: "orange" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 text-center border
            ${s.color === "blue"   ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            : s.color === "green"  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"}`}>
            <p className={`text-2xl font-bold
              ${s.color === "blue"   ? "text-blue-700 dark:text-blue-400"
              : s.color === "green"  ? "text-green-700 dark:text-green-400"
              : "text-orange-700 dark:text-orange-400"}`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 flex flex-wrap gap-3">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, ID..."
          className="flex-1 min-w-48 p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
        />
        {[
          { label: "Department", value: filterDept,  setter: setFilterDept,  options: allDepts   },
          { label: "Semester",   value: filterSem,   setter: setFilterSem,   options: allSems    },
          { label: "Batch",      value: filterBatch, setter: setFilterBatch, options: allBatches },
        ].map((f) => (
          <select key={f.label} value={f.value} onChange={(e) => f.setter(e.target.value)}
            className="p-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition">
            <option value="">All {f.label}s</option>
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        {(search || filterDept || filterSem || filterBatch) && (
          <button
            onClick={() => { setSearch(""); setFilterDept(""); setFilterSem(""); setFilterBatch(""); }}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition">
            Clear
          </button>
        )}
      </div>

      {/* Student List */}
      {students.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/>
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No students registered yet.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No students match the current filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Showing {filtered.length} of {students.length} students
            </p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filtered.map((s) => (
              <div key={s._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition">

                {/* Avatar — now loaded from MongoDB via backend */}
                <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-sm">
                  {s.profilePhoto
                    ? <img src={s.profilePhoto} alt={s.name} className="w-full h-full object-cover" />
                    : <span>{initials(s.name)}</span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.email} · ID: {s.studentId}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {s.program    && <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{s.program}</span>}
                    {s.department && <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">{s.department}</span>}
                    {s.semester   && <span className="text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">{s.semester} Sem</span>}
                    {s.batch      && <span className="text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">Batch {s.batch}</span>}
                    {s.section    && <span className="text-xs font-medium bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full">Sec {s.section}</span>}
                  </div>
                </div>

                {/* Role badge */}
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                    Student
                  </span>
                  {!s.department && (
                    <p className="text-xs text-orange-500 mt-1">Profile incomplete</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}