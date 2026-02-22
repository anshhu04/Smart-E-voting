import { useState, useEffect } from "react";

export default function AdminDashboard() {
  /* ---------------- STATES ---------------- */

  const [elections, setElections] = useState([]);

  const [title, setTitle] = useState("");

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [selectedElectionId, setSelectedElectionId] = useState("");

  const [candidateName, setCandidateName] = useState("");

  const [candidates, setCandidates] = useState([]);

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("elections")) || [];

    setElections(stored);
  }, []);

  /* ---------------- LOAD CANDIDATES ---------------- */

  useEffect(() => {
    if (!selectedElectionId) return;

    const stored =
      JSON.parse(localStorage.getItem("candidates_" + selectedElectionId)) ||
      [];

    setCandidates(stored);
  }, [selectedElectionId]);

  /* ---------------- CREATE ELECTION ---------------- */

  const createElection = () => {
    if (!title || !startTime || !endTime) return alert("Fill all fields");
    const newElection = {
      id: Date.now(),
      title,
      startTime,
      endTime,
      votes: 0,
      candidates: [], // ✅ REQUIRED FIX
    };

    const updated = [...elections, newElection];

    localStorage.setItem("elections", JSON.stringify(updated));

    setElections(updated);

    setTitle("");

    setStartTime("");

    setEndTime("");

    alert("Election Created ✅");
  };

  /* ---------------- ADD CANDIDATE ---------------- */

  const addCandidate = () => {
    if (!selectedElectionId || !candidateName)
      return alert("Enter candidate name");

    const key = "candidates_" + selectedElectionId;

    const stored = JSON.parse(localStorage.getItem(key)) || [];

    const newCandidate = {
      id: Date.now(),

      name: candidateName,

      votes: 0,
    };

    const updated = [...stored, newCandidate];

    localStorage.setItem(key, JSON.stringify(updated));

    /* ✅ IMPORTANT INTEGRATION — SYNC WITH ELECTION */
    const elections = JSON.parse(localStorage.getItem("elections")) || [];
    const updatedElections = elections.map((e) => {
      if (String(e.id) === String(selectedElectionId)) {
        return {
          ...e,
          candidates: updated,
        };
      }
      return e;
    });
    localStorage.setItem("elections", JSON.stringify(updatedElections));
    setElections(updatedElections);
    /* original state updates */
    setCandidates(updated);
    setCandidateName("");
  };

  /* ---------------- DELETE CANDIDATE ---------------- */

  const deleteCandidate = (id) => {
    const key = "candidates_" + selectedElectionId;

    const updated = candidates.filter((c) => c.id !== id);

    localStorage.setItem(key, JSON.stringify(updated));

    /* ✅ IMPORTANT INTEGRATION — SYNC WITH ELECTION */ const elections =
      JSON.parse(localStorage.getItem("elections")) || [];
    const updatedElections = elections.map((e) => {
      if (String(e.id) === String(selectedElectionId)) {
        return { ...e, candidates: updated };
      }
      return e;
    });
    localStorage.setItem("elections", JSON.stringify(updatedElections));
    setElections(updatedElections);
    /* original state */

    setCandidates(updated);
  };

  /* ---------------- DELETE ELECTION ---------------- */

  const deleteElection = (id) => {
    if (!window.confirm("Delete election?")) return;

    const updated = elections.filter((e) => e.id !== id);

    localStorage.setItem("elections", JSON.stringify(updated));

    localStorage.removeItem("candidates_" + id);

    setElections(updated);
  };

  /* ---------------- STATUS ---------------- */

  const getStatus = (election) => {
    const now = new Date();

    if (now < new Date(election.startTime)) return "Upcoming";

    if (now < new Date(election.endTime)) return "Live";

    return "Ended";
  };

  /* ---------------- STATS ---------------- */

  const totalElections = elections.length;

  const activeElections = elections.filter(
    (e) => getStatus(e) === "Live",
  ).length;

  const totalVotes = elections.reduce((sum, e) => sum + (e.votes || 0), 0);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617] p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Elections" value={totalElections} />

        <StatCard title="Active Elections" value={activeElections} />

        <StatCard title="Votes Cast" value={totalVotes} />
      </div>

      {/* Create Election */}

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Create Election
        </h2>

        <div className="flex gap-4 flex-wrap">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={createElection}
            className="bg-blue-700 text-white px-6 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      {/* Add Candidate */}

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Add Candidate
        </h2>

        <div className="flex gap-4 flex-wrap">
          <select
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Select Election</option>

            {elections.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>

          <input
            placeholder="Candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={addCandidate}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Candidate List */}

        <div className="mt-4">
          {candidates.map((c) => (
            <div key={c.id} className="flex justify-between border p-2 mt-2">
              {c.name}

              <button
                onClick={() => deleteCandidate(c.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Election Table */}

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          All Elections
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th>Title</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {elections.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>

                <td>{getStatus(e)}</td>

                <td>
                  <button
                    onClick={() => deleteElection(e.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Stat Card */

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <p>{title}</p>

      <h3 className="text-3xl font-bold text-blue-700">{value}</h3>
    </div>
  );
}
