import { useNavigate } from "react-router-dom";

export default function StudentElections(){

const elections = JSON.parse(localStorage.getItem("elections")) || [];

const user = JSON.parse(localStorage.getItem("loggedInUser"));

const navigate = useNavigate();

return(

<div>

<h1 className="text-3xl font-bold mb-6">

Elections

</h1>

<div className="space-y-4">

{elections.map(e=>{

const voteKey="vote_"+user.studentId+"_"+e.id;

const voted=localStorage.getItem(voteKey);

return(

<div key={e.id} className="bg-white p-4 rounded shadow flex justify-between">

<div>

<h2 className="font-bold">

{e.title}

</h2>

<p>

{new Date(e.startTime).toLocaleString()}

</p>

</div>

<button

onClick={()=>navigate("/student/vote/"+e.id)}

disabled={voted}

className={`px-4 py-2 text-white rounded ${voted?"bg-gray-400":"bg-blue-600"}`}

>

{voted?"Voted":"Vote"}

</button>

</div>

);

})}

</div>

</div>

);

}