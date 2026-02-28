import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { electionsAPI, votesAPI } from "../../services/api";
import { getUser } from "../../services/api";

export default function StudentElections() {
  const navigate = useNavigate();
  const user = getUser() || {};
  const userExtra = user.department !== undefined ? user : {};

  const [elections, setElections] = useState([]);
  const [votedMap, setVotedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const getStatus = (e) => {
    const start = new Date(e.startTime);
    const end = new Date(e.endTime);
    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Live";
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

  const sorted = [...elections].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const live = sorted.filter((e) => getStatus(e) === "Live");
  const upcoming = sorted.filter((e) => getStatus(e) === "Upcoming");
  const ended = sorted.filter((e) => getStatus(e) === "Ended");

  const statusBadge = (status) => {
    if (status === "Live")
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live
        </span>
      );
    if (status === "Upcoming")
      return <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full">Upcoming</span>;
    return <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">Ended</span>;
  };

  const scopeLabel = (e) => {
    if (!e.eligibility || e.eligibility.scope === "all") return "All Students";
    const parts = [];
    if (e.eligibility.departments?.length) parts.push(e.eligibility.departments.join(", "));
    if (e.eligibility.semesters?.length) parts.push(e.eligibility.semesters.map((s) => s + " Sem").join(", "));
    if (e.eligibility.batches?.length) parts.push("Batch " + e.eligibility.batches.join("/"));
    if (e.eligibility.programs?.length) parts.push(e.eligibility.programs.join(", "));
    return parts.join(" · ") || "All Students";
  };

  const ElectionCard = ({ e }) => {
    const status = getStatus(e);
    const voted = votedMap[String(e._id)] || null;
    const start = new Date(e.startTime);
    const end = new Date(e.endTime);
    const candidateCount = e.candidates?.length || 0;

    return (
      <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm transition-all
        ${status === "Live" ? "border-green-200 dark:border-green-800"
        : status === "Upcoming" ? "border-yellow-200 dark:border-yellow-800"
        : "border-gray-200 dark:border-slate-700"}`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-snug">{e.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{candidateCount} candidate{candidateCount !== 1 ? "s" : ""}</p>
          </div>
          {statusBadge(status)}
        </div>

        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-4
          ${e.eligibility?.scope === "all"
            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/></svg>
          {scopeLabel(e)}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Time</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{start.toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">End Time</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{end.toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        {voted && (
          <div className="flex items-center gap-2 mb-3 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            <span className="font-medium">You voted for: <span className="font-bold">{voted}</span></span>
          </div>
        )}

        <button
          onClick={() => navigate("/student/vote/" + e._id)}
          disabled={!!voted || status !== "Live"}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all
            ${voted
              ? "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : status === "Live"
              ? "bg-blue-800 hover:bg-blue-900 text-white shadow-md shadow-blue-900/20"
              : status === "Upcoming"
              ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 cursor-not-allowed border border-yellow-200 dark:border-yellow-800"
              : "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}>
          {voted ? "✓ Already Voted" : status === "Live" ? "Vote Now →" : status === "Upcoming" ? "Not Started Yet" : "Election Ended"}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Elections</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Showing elections you are eligible to vote in</p>
      </div>

      {(!user.department || !user.semester || !user.batch) && (
        <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <span className="font-bold">Your profile is incomplete.</span> Update your department, semester, and batch in your{" "}
            <button onClick={() => navigate("/student/profile")} className="underline font-semibold">Profile</button> to see all elections you're eligible for.
          </p>
        </div>
      )}

      {elections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-700">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Elections Available</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No elections are available for your profile right now.</p>
        </div>
      ) : (
        <>
          {live.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Live Now ({live.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {live.map((e) => <ElectionCard key={e._id} e={e} />)}
              </div>
            </section>
          )}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-3">Upcoming ({upcoming.length})</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {upcoming.map((e) => <ElectionCard key={e._id} e={e} />)}
              </div>
            </section>
          )}
          {ended.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Ended ({ended.length})</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {ended.map((e) => <ElectionCard key={e._id} e={e} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
