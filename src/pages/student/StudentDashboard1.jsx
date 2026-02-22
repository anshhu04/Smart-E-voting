export default function StudentDashboard() {
  const elections = JSON.parse(localStorage.getItem("elections")) || [];

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const votes = elections.filter((e) =>
    localStorage.getItem("vote_" + user.studentId + "_" + e.id),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Elections" value={elections.length} />

        <Card title="Votes Cast" value={votes.length} />

        <Card title="Pending Votes" value={elections.length - votes.length} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p>{title}</p>

      <h1 className="text-2xl font-bold">{value}</h1>
    </div>
  );
}
