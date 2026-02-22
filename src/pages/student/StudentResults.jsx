import { useEffect, useState } from "react";

export default function StudentResults(){

const [elections,setElections]=useState([]);

useEffect(()=>{

const stored=
JSON.parse(localStorage.getItem("elections"))||[];

setElections(stored);

},[]);



const getResult=(election)=>{

if(!election.candidates || election.candidates.length===0)
return {status:"No candidates"};

const now=new Date();

const end=new Date(election.endTime);


/* election not finished */

if(now<end){

return {status:"Ongoing"};

}


/* election finished */

const maxVotes=Math.max(
...election.candidates.map(c=>c.votes)
);


if(maxVotes===0){

return {status:"No votes"};

}


const winners=
election.candidates.filter(
c=>c.votes===maxVotes
);


if(winners.length===1){

return{

status:"Winner",

names:[winners[0].name],

votes:maxVotes

};

}


return{

status:"Tie",

names:winners.map(w=>w.name),

votes:maxVotes

};

};



return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">

Results

</h1>



<div className="space-y-6">


{elections.map(e=>{

const result=getResult(e);

return(

<div
key={e.id}
className="bg-white p-6 rounded shadow"
>


<h2 className="text-xl font-bold">

{e.title}

</h2>


<p className="text-gray-500 mb-3">

Ended:
{new Date(e.endTime).toLocaleString()}

</p>



{/* Candidates vote list */}

<div className="mb-3">

{e.candidates?.map(c=>(

<div
key={c.id}
className="flex justify-between border-b py-1"
>

<span>

{c.name}

</span>

<span>

{c.votes} votes

</span>

</div>

))}

</div>



{/* Result */}

{result.status==="Ongoing" && (

<p className="text-yellow-600 font-semibold">

Election still ongoing

</p>

)}



{result.status==="No votes" && (

<p className="text-gray-600 font-semibold">

No votes cast

</p>

)}



{result.status==="Winner" && (

<p className="text-green-600 font-bold">

🏆 Winner:

{result.names[0]}

({result.votes} votes)

</p>

)}



{result.status==="Tie" && (

<p className="text-blue-600 font-bold">

🤝 Tie between:

{result.names.join(", ")}

({result.votes} votes each)

</p>

)}



</div>

);

})}


</div>

</div>

);

}