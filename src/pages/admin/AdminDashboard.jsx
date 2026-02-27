import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const elections = JSON.parse(localStorage.getItem("elections")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  const liveElections   = elections.filter((e) => getStatus(e) === "Live");
  const endedElections  = elections.filter((e) => getStatus(e) === "Ended");
  const upcomingElections = elections.filter((e) => getStatus(e) === "Upcoming");
  const students        = users.filter((u) => u.role === "student");
  const totalVotes      = elections.reduce((s, e) => s + (e.votes || 0), 0);
  const publishedCount  = elections.filter((e) => e.resultsPublished).length;
  const totalCandidates = elections.reduce((s, e) => s + (e.candidates?.length || 0), 0);

  const stats = [
    { label: "Total Elections", value: elections.length, color: "blue",   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { label: "Live Now",        value: liveElections.length,   color: "green",  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a1 1 0 100-2 1 1 0 000 2z" /></svg> },
    { label: "Total Students",  value: students.length,        color: "purple", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg> },
    { label: "Votes Cast",      value: totalVotes,             color: "orange", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: "Total Candidates",value: totalCandidates,        color: "yellow", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4m-4 6v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2h9m4-10a4 4 0 100-8 4 4 0 000 8z" /></svg> },
    { label: "Results Published",value: publishedCount,        color: "teal",   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  ];

  const colorMap = {
    blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    teal:   "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  };

  const statusBadge = (status) => {
    if (status === "Live")     return <span className="flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live</span>;
    if (status === "Upcoming") return <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">Upcoming</span>;
    return <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Ended</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 dark:from-[#0b132b] dark:to-[#1c2541] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-blue-200 text-sm mt-1">Overview of your Smart E-Voting system</p>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold">{liveElections.length}</p>
            <p className="text-blue-200 text-xs">Live</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold">{upcomingElections.length}</p>
            <p className="text-blue-200 text-xs">Upcoming</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold">{endedElections.length}</p>
            <p className="text-blue-200 text-xs">Ended</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-sm ${colorMap[s.color].split(" ").slice(4).join(" ")}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${colorMap[s.color].split(" ").slice(0, 4).join(" ")}`}>
              {s.icon}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{s.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Create Election", desc: "Set up a new election with eligibility rules", path: "/admin/elections", color: "blue" },
          { label: "Add Candidates",  desc: "Add candidates to existing elections",         path: "/admin/candidates", color: "purple" },
          { label: "Publish Results", desc: "Publish results for ended elections",           path: "/admin/results",    color: "green" },
        ].map((a, i) => (
          <button key={i} onClick={() => navigate(a.path)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm text-left hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3
              ${a.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" : a.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
              <svg className={`w-5 h-5 ${a.color === "blue" ? "text-blue-700 dark:text-blue-400" : a.color === "purple" ? "text-purple-700 dark:text-purple-400" : "text-green-700 dark:text-green-400"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{a.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Recent Elections */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Elections</h2>
          <button onClick={() => navigate("/admin/elections")} className="text-sm text-blue-700 dark:text-blue-400 font-semibold hover:underline">View All</button>
        </div>
        {elections.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No elections created yet.</p>
        ) : (
          <div className="space-y-3">
            {elections.slice(-5).reverse().map((e) => {
              const status = getStatus(e);
              const totalV = (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);
              return (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{e.title}</p>
                      {statusBadge(status)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {e.candidates?.length || 0} candidates · {totalV} votes · {e.eligibility?.scope === "all" ? "All Students" : `Targeted`}
                    </p>
                  </div>
                  {e.resultsPublished && (
                    <span className="ml-3 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 rounded-full flex-shrink-0">Published</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
