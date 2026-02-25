import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function StudentVote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) return <div>Please login</div>;

  const voteKey = "vote_" + user.studentId + "_" + id;

  const [election, setElection] = useState(null);
  const [voted, setVoted] = useState(localStorage.getItem(voteKey));
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const elections = JSON.parse(localStorage.getItem("elections")) || [];
    const found = elections.find((e) => String(e.id) === String(id));
    if (found) {
      const fixedCandidates = (found.candidates || []).map((c) =>
        typeof c === "string" ? { name: c, votes: 0 } : c
      );
      found.candidates = fixedCandidates;
      setElection(found);
    }
  }, [id]);

  const submitVote = () => {
    if (!selected || voted) return;

    const elections = JSON.parse(localStorage.getItem("elections")) || [];
    const updated = elections.map((e) => {
      if (String(e.id) === String(id)) {
        return {
          ...e,
          votes: (e.votes || 0) + 1,
          candidates: e.candidates.map((c) =>
            c.name === selected ? { ...c, votes: (c.votes || 0) + 1 } : c
          ),
        };
      }
      return e;
    });

    localStorage.setItem("elections", JSON.stringify(updated));
    localStorage.setItem(voteKey, selected);
    setVoted(selected);
    setConfirming(false);
    setSuccess(true);
  };

  if (!election) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Election not found</p>
          <button onClick={() => navigate("/student/elections")} className="mt-3 text-blue-700 dark:text-blue-400 text-sm font-medium hover:underline">
            ← Back to Elections
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vote Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Your vote has been recorded securely.</p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-3 mb-6 inline-block">
            <p className="text-sm text-gray-600 dark:text-gray-400">You voted for</p>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-300">{voted}</p>
          </div>
          <br />
          <button
            onClick={() => navigate("/student/elections")}
            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold transition"
          >
            ← Back to Elections
          </button>
        </div>
      </div>
    );
  }

  // Already voted screen
  if (voted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-green-200 dark:border-green-800 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Already Voted</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-1">You have already cast your vote in this election.</p>
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-6">Voted for: {voted}</p>
          <button onClick={() => navigate("/student/elections")} className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold transition">
            ← Back to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate("/student/elections")} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 font-medium mb-4 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Elections
        </button>

        <div className="bg-gradient-to-br from-blue-900 to-blue-700 dark:from-[#0b132b] dark:to-[#1c2541] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-sm font-semibold">Live Election</span>
          </div>
          <h1 className="text-2xl font-bold">{election.title}</h1>
          <p className="text-blue-200 text-sm mt-1">Select one candidate to cast your vote</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-semibold">Important:</span> Your vote is anonymous and final. You can only vote once per election. Choose carefully before confirming.
        </p>
      </div>

      {/* Candidates */}
      {election.candidates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-gray-200 dark:border-slate-700">
          <p className="text-gray-500 dark:text-gray-400">No candidates have been added to this election yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {election.candidates.map((c, i) => {
            const isSelected = selected === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelected(c.name)}
                className={`text-left p-5 rounded-2xl border-2 transition-all shadow-sm w-full
                  ${isSelected
                    ? "border-blue-700 bg-blue-50 dark:bg-blue-900/20 shadow-blue-200 dark:shadow-none"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-800 dark:text-blue-300 font-bold text-lg">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? "border-blue-700 bg-blue-700"
                      : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{c.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Candidate #{i + 1}</p>
                {isSelected && (
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mt-2">✓ Selected</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Vote Button */}
      {election.candidates.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/student/elections")}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() => setConfirming(true)}
            className={`flex-2 px-8 py-3 rounded-xl font-semibold transition-all
              ${selected
                ? "bg-blue-800 hover:bg-blue-900 text-white shadow-md shadow-blue-900/20"
                : "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
          >
            {selected ? `Confirm Vote for ${selected} →` : "Select a Candidate"}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Confirm Your Vote</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">This action cannot be undone.</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">You are voting for</p>
              <p className="text-xl font-bold text-blue-800 dark:text-blue-300">{selected}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">in {election.title}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitVote}
                className="flex-1 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold transition shadow-md"
              >
                Submit Vote 🗳️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
