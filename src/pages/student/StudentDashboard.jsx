// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";

// export default function StudentDashboard() {

//   const navigate = useNavigate();

//   /* ---------------- LOGGED IN USER ---------------- */

//   const loggedInUser =
//     JSON.parse(localStorage.getItem("loggedInUser"));


//   /* ---------------- STATES ---------------- */

//   const [elections, setElections] = useState([]);

//   const [activeElection, setActiveElection] = useState(null);

//   const [votedCandidate, setVotedCandidate] = useState(null);

//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0
//   });


//   /* ---------------- LOAD ELECTION ---------------- */

//   useEffect(() => {

//     const stored =
//       JSON.parse(localStorage.getItem("elections")) || [];

//     setElections(stored);

//     if (stored.length === 0) return;

//     const now = new Date();

//     const selectedElection =

//       stored.find(e =>
//         now >= new Date(e.startTime) &&
//         now <= new Date(e.endTime)
//       ) ||

//       stored.find(e =>
//         now < new Date(e.startTime)
//       ) ||

//       stored[stored.length - 1];

//     setActiveElection(selectedElection);

//   }, []);


//   /* ---------------- LOAD VOTE WHEN ELECTION CHANGES ---------------- */

//   useEffect(() => {

//     if (!activeElection || !loggedInUser) {

//       setVotedCandidate(null);

//       return;

//     }

//     const voteKey =
//       "vote_" +
//       loggedInUser.studentId +
//       "_" +
//       activeElection.id;

//     const existingVote =
//       localStorage.getItem(voteKey);

//     setVotedCandidate(existingVote);

//   }, [activeElection, loggedInUser]);


//   /* ---------------- COUNTDOWN ---------------- */

//   useEffect(() => {

//     if (!activeElection) return;

//     const electionStart =
//       new Date(activeElection.startTime).getTime();

//     const timer = setInterval(() => {

//       const now = new Date().getTime();

//       const diff = electionStart - now;

//       if (diff <= 0) return;

//       setTimeLeft({

//         days:
//         Math.floor(diff / (1000 * 60 * 60 * 24)),

//         hours:
//         Math.floor((diff / (1000 * 60 * 60)) % 24),

//         minutes:
//         Math.floor((diff / (1000 * 60)) % 60),

//       });

//     }, 1000);

//     return () => clearInterval(timer);

//   }, [activeElection]);


//   /* ---------------- VOTE ---------------- */

//   const handleVote = (candidate) => {

//     if (!loggedInUser || !activeElection) return;

//     const voteKey =
//       "vote_" +
//       loggedInUser.studentId +
//       "_" +
//       activeElection.id;

//     localStorage.setItem(
//       voteKey,
//       candidate
//     );

//     setVotedCandidate(candidate);

//     alert("Vote submitted successfully");

//   };


//   /* ---------------- LOGOUT ---------------- */

//   const logout = () => {

//     localStorage.removeItem("loggedInUser");

//     navigate("/login");

//   };


//   /* ---------------- STATS ---------------- */

//   const stats = [

//     {
//       title: "Elections Participated",
//       value: elections.length,
//     },

//     {
//       title: "Pending Votes",
//       value: votedCandidate ? 0 : elections.length,
//     },

//     {
//       title: "Your Vote Status",
//       value: votedCandidate ? "Voted" : "Not Voted",
//     },

//   ];


//   /* ---------------- CHART ---------------- */

//   const chartData = [

//     {
//       name: "Voted",
//       value: votedCandidate ? 1 : 0,
//     },

//     {
//       name: "Not Voted",
//       value: votedCandidate ? 0 : 1,
//     },

//   ];

//   const COLORS = ["#2563eb", "#94a3b8"];


//   /* ---------------- UI ---------------- */

//   return (

//     <div className="min-h-screen flex bg-gray-100 dark:bg-[#020617]">


//       {/* Sidebar */}

//       <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 p-6 hidden md:block">

//         <h2 className="text-xl font-bold mb-8 dark:text-white">

//           Smart E-Voting

//         </h2>


//         <nav className="space-y-4 text-gray-600 dark:text-gray-300">

//           <p className="font-semibold text-blue-700">
//             Dashboard
//           </p>

//           <p className="hover:text-blue-600 cursor-pointer">
//             Elections
//           </p>

//           <p className="hover:text-blue-600 cursor-pointer">
//             Results
//           </p>

//           <p className="hover:text-blue-600 cursor-pointer">
//             Profile
//           </p>

//           <p
//             onClick={logout}
//             className="hover:text-red-500 cursor-pointer"
//           >
//             Logout
//           </p>

//         </nav>

//       </aside>


//       {/* Main */}

//       <main className="flex-1 p-6">


//         {/* Hero */}

//         <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 mb-8">

//           <h1 className="text-3xl font-bold mb-2">

//             {activeElection
//               ? activeElection.title
//               : "No Election"}

//           </h1>


//           <p className="opacity-90 mb-4">

//             Cast your vote and shape the future of your campus

//           </p>


//           <div className="flex gap-6 mt-4">

//             <div>
//               <p className="text-sm opacity-70">Days</p>
//               <p className="text-2xl font-bold">{timeLeft.days}</p>
//             </div>

//             <div>
//               <p className="text-sm opacity-70">Hours</p>
//               <p className="text-2xl font-bold">{timeLeft.hours}</p>
//             </div>

//             <div>
//               <p className="text-sm opacity-70">Minutes</p>
//               <p className="text-2xl font-bold">{timeLeft.minutes}</p>
//             </div>

//           </div>

//         </div>

// {/* Stats + Chart Row */}

// <div className="flex flex-col lg:flex-row gap-6 mb-8">


//   {/* Stats Cards */}
  
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
  
//     {stats.map((item, i) => (
    
//       <div
//         key={i}
//         className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow"
//       >
      
//         <p className="text-gray-500 dark:text-gray-400 text-sm">
//           {item.title}
//         </p>
        
        
//         <h3 className="text-2xl font-bold mt-2 dark:text-white">
//           {item.value}
//         </h3>
        
//       </div>
      
//     ))}
    
//   </div>



//   {/* Chart Right Side */}
  
//   <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow flex justify-center items-center min-w-[280px]">
  
//     <div>
    
//       <h2 className="font-bold mb-2 text-center dark:text-white">
//         Vote Status
//       </h2>


//       <PieChart width={100} height={100}>
      
//         <Pie
//           data={chartData}
//           dataKey="value"
//           outerRadius={40}
//           label
//         >
        
//           {chartData.map((_, index) => (
          
//             <Cell
//               key={index}
//               fill={COLORS[index]}
//             />
            
//           ))}
          
//         </Pie>
        
//         <Tooltip />
        
//       </PieChart>


//     </div>

//   </div>


// </div>

//         {/* Candidates */}

//         <h2 className="text-xl font-semibold mb-4 dark:text-white">
//           Candidates
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//           {["Candidate A", "Candidate B", "Candidate C", "Candidate D"].map(
//             (name, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow text-center"
//               >
//                 <div className="w-16 h-16 mx-auto rounded-full bg-blue-200 mb-3" />

//                 <h3 className="font-semibold dark:text-white">{name}</h3>

//                 <p className="text-sm text-gray-500">President</p>

//                 <button
//                   onClick={() => handleVote(name)}
//                   disabled={votedCandidate}
//                   className={`mt-4 w-full py-2 rounded-lg text-white


// ${
//   votedCandidate
//     ? "bg-gray-400 cursor-not-allowed"
//     : "bg-blue-700 hover:bg-blue-800"
// }`}
//                 >
//                   {votedCandidate ? "Already Voted" : "Vote"}
//                 </button>
//               </div>
//             ),
//           )}
//         </div>

//         {/* Table */}

//         <h2 className="text-xl font-semibold mb-4 dark:text-white">
//           All Candidates
//         </h2>

//         <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 dark:bg-slate-800">
//               <tr>
//                 <th className="p-4">Name</th>

//                 <th className="p-4">Position</th>

//                 <th className="p-4">Department</th>

//                 <th className="p-4">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {["A", "B", "C"].map((c, i) => (
//                 <tr key={i} className="border-t dark:border-slate-700">
//                   <td className="p-4">Candidate {c}</td>

//                   <td className="p-4">President</td>

//                   <td className="p-4">CSE</td>

//                   <td className="p-4">
//                     <button
//                       onClick={() => handleVote("Candidate " + c)}
//                       disabled={votedCandidate}
//                       className="text-blue-700 hover:underline"
//                     >
//                       {votedCandidate ? "Already Voted" : "Vote"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Chart

//         <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow w-fit">
//           <h2 className="font-bold mb-4 dark:text-white">Voting Status</h2>

//           <PieChart width={250} height={250}>
//             <Pie data={chartData} dataKey="value" outerRadius={80} label>
//               {chartData.map((_, index) => (
//                 <Cell key={index} fill={COLORS[index]} />
//               ))}
//             </Pie>

//             <Tooltip />
//           </PieChart>
//         </div> */}
//       </main>
//     </div>
//   );
// }
