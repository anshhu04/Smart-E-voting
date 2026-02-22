import { useParams,useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StudentVote(){

const {id}=useParams();

const navigate=useNavigate();

const user=JSON.parse(localStorage.getItem("loggedInUser"));

const voteKey="vote_"+user.studentId+"_"+id;

const [voted,setVoted]=useState(localStorage.getItem(voteKey));

const candidates=["Candidate A","Candidate B","Candidate C"];

const vote=(name)=>{

localStorage.setItem(voteKey,name);

setVoted(name);

alert("Vote submitted");

navigate("/student/elections");

};

return(

<div>

<h1 className="text-3xl font-bold mb-6">

Vote

</h1>

<div className="grid grid-cols-3 gap-6">

{candidates.map(c=>(

<div key={c} className="bg-white p-6 shadow rounded text-center">

<h2>{c}</h2>

<button

onClick={()=>vote(c)}

disabled={voted}

className="bg-blue-600 text-white px-4 py-2 rounded mt-4"

>

Vote

</button>

</div>

))}

</div>

</div>

);

}