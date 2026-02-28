import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { electionsAPI, votesAPI } from "../../services/api";
import { getUser } from "../../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = getUser() || {};

  const profilePhoto = user?.profilePhoto || localStorage.getItem("photo_profile_" + user?.studentId) || null;

  const [elections, setElections] = useState([]);
  const [votedMap, setVotedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const getStatus = (e) => {
    if (now < new Date(e.startTime)) return "Upcoming";
    if (now < new Date(e.endTime)) return "Live";
    return "Ended";
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [electionsData, votesData] = await Promise.all([
          electionsAPI.getAll(),
          votesAPI.getMyVotes(),
        ]);
        setElections(Array.isArray(electionsData) ? electionsData : []);
        const map = {};
        for (const v of Array.isArray(votesData) ? votesData : []) {
          const eid = v.election?._id ?? v.election;
          if (eid) map[String(eid)] = v.candidateName || "";
        }
        setVotedMap(map);
      } catch (err) {
        setElections([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const votedElections = elections.filter((e) => votedMap[String(e._id)]);
  const liveElections = elections.filter((e) => getStatus(e) === "Live");
  const pendingVotes = liveElections.filter((e) => !votedMap[String(e._id)]);

  const stats = [
    { title: "Total Elections", value: elections.length, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
    { title: "Votes Cast", value: votedElections.length, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
    { title: "Live Elections", value: liveElections.length, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M12 12a1 1 0 100-2 1 1 0 000 2z" /></svg>, color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-800" },
    { title: "Pending Votes", value: pendingVotes.length, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  ];

  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "ST";
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 dark:from-[#0b132b] dark:to-[#1c2541] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 border-2 border-white/30">
            {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : <span>{initials}</span>}
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium">{greeting} 👋</p>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-blue-200 text-sm mt-0.5">ID: {user?.studentId} · {user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border ${s.border} shadow-sm`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{s.title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Elections</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live
            </span>
          </div>

          {liveElections.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No live elections right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveElections.map((e) => {
                const hasVoted = votedMap[String(e._id)];
                return (
                  <div key={e._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ends: {new Date(e.endTime).toLocaleString()}</p>
                    </div>
                    {hasVoted ? (
                      <span className="ml-3 flex-shrink-0 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">✓ Voted</span>
                    ) : (
                      <button onClick={() => navigate("/student/vote/" + e._id)} className="ml-3 flex-shrink-0 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg transition">Vote Now</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>

          {votedElections.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No voting activity yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {votedElections.slice(0, 5).map((e) => {
                const votedFor = votedMap[String(e._id)];
                return (
                  <div key={e._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{e.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Voted for: <span className="font-medium text-blue-600 dark:text-blue-400">{votedFor}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {elections.filter((e) => getStatus(e) === "Upcoming").length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Elections</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {elections.filter((e) => getStatus(e) === "Upcoming").map((e) => (
              <div key={e._id} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{e.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Starts: {new Date(e.startTime).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
