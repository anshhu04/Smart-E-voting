import { useState, useEffect } from "react";

export default function AdminDashboard() {
  /* ---------------- STATES ---------------- */

  const [elections, setElections] = useState([]);

  const [title, setTitle] = useState("");

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  /* ---------------- LOAD ELECTIONS ---------------- */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("elections")) || [];

    setElections(stored);
  }, []);

  /* ---------------- CREATE ELECTION ---------------- */

  const createElection = () => {
    if (!title || !startTime || !endTime) return alert("Fill all fields");

    const newElection = {
      id: Date.now(),

      title,

      startTime,

      endTime,

      votes: 0,

      candidates: ["Candidate A", "Candidate B", "Candidate C", "Candidate D"],
    };

    const updated = [...elections, newElection];

    localStorage.setItem("elections", JSON.stringify(updated));

    /* 🔥 important for student dashboard sync */
    window.dispatchEvent(new Event("storage"));

    setElections(updated);

    setTitle("");

    setStartTime("");

    setEndTime("");

    alert("Election Created Successfully ✅");
  };

  /* ---------------- STATUS FUNCTION ---------------- */

  const getStatus = (election) => {
    const now = new Date();

    const start = new Date(election.startTime);

    const end = new Date(election.endTime);

    if (now < start) return "Upcoming";

    if (now < end) return "Live";

    return "Ended";
  };

  /* ---------------- DELETE ELECTION ---------------- */

  const deleteElection = (id) => {
    if (!window.confirm("Delete this election?")) return;

    const updated = elections.filter((e) => e.id !== id);

    localStorage.setItem("elections", JSON.stringify(updated));

    window.dispatchEvent(new Event("storage"));

    setElections(updated);
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
      {/* Header */}

      <h1 className="text-3xl font-bold dark:text-white mb-6">
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

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Election Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
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

      {/* Election Table */}

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          All Elections
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-gray-500">
              <th>Election</th>

              <th>Status</th>

              <th>Start</th>

              <th>End</th>

              <th>Votes</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {elections.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="py-3">{e.title}</td>

                <td
                  className={`py-3 font-semibold

                  ${
                    getStatus(e) === "Live"
                      ? "text-green-600"
                      : getStatus(e) === "Upcoming"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {getStatus(e)}
                </td>

                <td>{new Date(e.startTime).toLocaleString()}</td>

                <td>{new Date(e.endTime).toLocaleString()}</td>

                <td>{e.votes || 0}</td>

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

/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>

      <h3 className="text-3xl font-bold text-blue-700">{value}</h3>
    </div>
  );
}
