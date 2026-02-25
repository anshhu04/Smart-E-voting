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
  const upcomingElections = elections.filter((e) => getStatus(e) === "Upcoming");
  const endedElections  = elections.filter((e) => getStatus(e) === "Ended");
  const students        = users.filter((u) => u.role === "student");
  const totalVotes      = elections.reduce((s, e) => s + (e.votes || 0), 0);
  const totalCandidates = elections.reduce((s, e) => s + (e.candidates?.length || 0), 0);

  const stats = [
    { label: "Total Elections", value: elections.length, color: "blue",   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, nav: "/admin/elections" },
    { label: "Live Now",        value: liveElections.length,   color: "green",  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a1 1 0 100-2 1 1 0 000 2z" /></svg>, nav: "/admin/elections" },
    { label: "Total Votes",     value: totalVotes,             color: "purple", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, nav: "/admin/results" },
    { label: "Registered Voters", value: students.length,     color: "orange", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, nav: "/admin/voters" },
    { label: "Total Candidates", value: totalCandidates,      color: "pink",   icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4m-4 6v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2h9m4-10a4 4 0 100-8 4 4 0 000 8z" /></svg>, nav: "/admin/candidates" },
    { label: "Ended Elections",  value: endedElections.length, color: "gray",  icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, nav: "/admin/results" },
  ];

  const colorMap = {
    blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    pink:   "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
    gray:   "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  };

  const iconBg = {
    blue:   "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    green:  "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    purple: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    orange: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
    pink:   "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300",
    gray:   "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 dark:from-[#0b132b] dark:to-[#1c2541] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">Welcome back 👋</p>
            <h1 className="text-2xl font-bold mt-1">{JSON.parse(localStorage.getItem("loggedInUser"))?.name}</h1>
            <p className="text-blue-200 text-sm mt-1">Here's what's happening with your elections today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold">{liveElections.length} Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(s.nav)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${iconBg[s.color]}`}>
              {s.icon}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{s.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Elections */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Elections</h2>
            <button onClick={() => navigate("/admin/elections")} className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline">View All →</button>
          </div>
          {liveElections.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">No live elections right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveElections.map((e) => {
                const totalVotes = (e.candidates || []).reduce((s, c) => s + (c.votes || 0), 0);
                return (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{totalVotes} votes · Ends {new Date(e.endTime).toLocaleDateString()}</p>
                    </div>
                    <span className="flex items-center gap-1.5 ml-3 flex-shrink-0 text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Elections */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Elections</h2>
            <button onClick={() => navigate("/admin/elections")} className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline">Manage →</button>
          </div>
          {upcomingElections.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">No upcoming elections</p>
              <button onClick={() => navigate("/admin/elections")} className="mt-3 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline">+ Create one</button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingElections.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{e.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Starts {new Date(e.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <span className="ml-3 flex-shrink-0 text-xs font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full">Soon</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Create Election", icon: "➕", nav: "/admin/elections", color: "blue" },
            { label: "Add Candidate",   icon: "👤", nav: "/admin/candidates", color: "green" },
            { label: "View Voters",     icon: "👥", nav: "/admin/voters",    color: "purple" },
            { label: "View Results",    icon: "📊", nav: "/admin/results",   color: "orange" },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.nav)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
