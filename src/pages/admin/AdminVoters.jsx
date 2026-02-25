import { useState } from "react";

export default function AdminVoters() {
  const elections = JSON.parse(localStorage.getItem("elections")) || [];
  const allUsers  = JSON.parse(localStorage.getItem("users")) || [];
  const students  = allUsers.filter((u) => u.role === "student");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | voted | not-voted

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const getVotedCount = (student) =>
    elections.filter((e) => localStorage.getItem("vote_" + student.studentId + "_" + e.id)).length;

  const getVotedFor = (student, electionId) =>
    localStorage.getItem("vote_" + student.studentId + "_" + electionId);

  const enriched = students.map((s) => ({
    ...s,
    votedCount: getVotedCount(s),
    participation: elections.length > 0
      ? Math.round((getVotedCount(s) / elections.length) * 100)
      : 0,
  }));

  const filtered = enriched.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true
      : filter === "voted" ? s.votedCount > 0
      : s.votedCount === 0;
    return matchSearch && matchFilter;
  });

  const totalVotes = elections.reduce((s, e) => s + (e.votes || 0), 0);
  const activeVoters = enriched.filter((s) => s.votedCount > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voters</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">View all registered students and their voting activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Registered Students", value: students.length,   color: "blue"   },
          { label: "Active Voters",        value: activeVoters,     color: "green"  },
          { label: "Total Votes Cast",     value: totalVotes,       color: "purple" },
          { label: "Total Elections",      value: elections.length, color: "orange" },
        ].map((s, i) => {
          const colorMap = {
            blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
            green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
            purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
            orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
          };
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{s.label}</p>
              <h3 className={`text-3xl font-bold mt-1 ${colorMap[s.color].split(" ").slice(-2).join(" ")}`}>{s.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or student ID..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
          {[{ key: "all", label: "All" }, { key: "voted", label: "Voted" }, { key: "not-voted", label: "Not Voted" }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${filter === f.key ? "bg-blue-800 text-white shadow" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No students found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Students who register will appear here.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {filtered.map((s, i) => {
                const initials = s.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                const profilePhoto = localStorage.getItem("photo_profile_" + s.studentId);
                return (
                  <div key={i} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {profilePhoto
                            ? <img src={profilePhoto} alt={s.name} className="w-full h-full object-cover" />
                            : <span>{initials}</span>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{s.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.email} · ID: {s.studentId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Participation bar */}
                        <div className="hidden sm:block w-28">
                          <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            <span>Participation</span>
                            <span>{s.participation}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.participation === 100 ? "bg-green-500" : s.participation > 0 ? "bg-blue-600" : "bg-gray-300 dark:bg-slate-600"}`}
                              style={{ width: `${s.participation}%` }}
                            />
                          </div>
                        </div>

                        {/* Votes badge */}
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                          ${s.votedCount > 0
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                          }`}>
                          {s.votedCount}/{elections.length} voted
                        </span>
                      </div>
                    </div>

                    {/* Voted elections detail */}
                    {s.votedCount > 0 && (
                      <div className="mt-3 ml-13 flex flex-wrap gap-2 pl-13">
                        {elections.filter((e) => getVotedFor(s, e.id)).map((e) => (
                          <span key={e.id} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded-full">
                            ✓ {e.title} → <span className="font-semibold">{getVotedFor(s, e.id)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
