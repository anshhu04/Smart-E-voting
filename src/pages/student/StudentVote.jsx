import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function StudentVote(){

const { id } = useParams();

const navigate = useNavigate();

const user =
JSON.parse(localStorage.getItem("loggedInUser"));

if(!user){
return <div>Please login</div>;
}

const voteKey =
"vote_" + user.studentId + "_" + id;


const [election,setElection]=useState(null);

const [voted,setVoted]=useState(
localStorage.getItem(voteKey)
);


useEffect(()=>{

const elections =
JSON.parse(localStorage.getItem("elections")) || [];


const found =
elections.find(e => String(e.id) === String(id));


if(found){

/* FIX old candidate format */

const fixedCandidates = found.candidates.map(c =>

typeof c === "string"
? { name:c, votes:0 }
: c

);

found.candidates = fixedCandidates;

setElection(found);

}

},[id]);




const vote=(candidateName)=>{

if(voted) return;


const elections =
JSON.parse(localStorage.getItem("elections")) || [];


const updated = elections.map(e=>{

if(String(e.id)===String(id)){

return{

...e,

candidates:e.candidates.map(c=>

c.name===candidateName

? {...c,votes:(c.votes||0)+1}

:c

)

};

}

return e;

});


localStorage.setItem(
"elections",
JSON.stringify(updated)
);


localStorage.setItem(
voteKey,
candidateName
);


setVoted(candidateName);


alert("Vote submitted successfully");


navigate("/student/elections");

};



/* SAFETY FIX */

if(!election){

return(

<div className="p-6">

Election not found

</div>

);

}



return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">

{election.title}

</h1>


<div className="grid grid-cols-1 md:grid-cols-3 gap-6">


{election.candidates.map(c=>(

<div
key={c.name}
className="bg-white p-6 shadow rounded text-center"
>

<h2 className="font-bold">

{c.name}

</h2>


<p className="text-gray-500">

Vote count hidden

</p>


<button

onClick={()=>vote(c.name)}

disabled={voted}

className={`px-4 py-2 mt-4 text-white rounded

${voted

?"bg-gray-400"

:"bg-blue-600 hover:bg-blue-700"

}`}

>

{voted?"Voted":"Vote"}

</button>


</div>

))}


</div>

</div>

);

}