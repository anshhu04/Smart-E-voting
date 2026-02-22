import { useNavigate } from "react-router-dom";

export default function StudentElections(){

const elections =
JSON.parse(localStorage.getItem("elections")) || [];

const user =
JSON.parse(localStorage.getItem("loggedInUser"));

const navigate = useNavigate();

const now = new Date();


// sort elections by start time

const sorted = elections.sort(
(a,b)=>new Date(a.startTime)-new Date(b.startTime)
);


return(

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">

Elections

</h1>


<div className="space-y-4">


{sorted.map(e=>{


const voteKey =
"vote_"+user.studentId+"_"+e.id;


const voted =
localStorage.getItem(voteKey);


const start = new Date(e.startTime);

const end = new Date(e.endTime);


let status="Upcoming";

if(now>=start && now<=end)
status="Live";

if(now>end)
status="Ended";



return(

<div
key={e.id}
className="bg-white p-4 rounded shadow flex justify-between items-center"
>


<div>

<h2 className="font-bold text-lg">

{e.title}

</h2>

<p className="text-sm text-gray-500">

{start.toLocaleString()}

</p>

<p className={`font-semibold

${status==="Live"?"text-green-600":

status==="Upcoming"?"text-yellow-500":

"text-red-500"}`}

>

{status}

</p>


</div>



<button

onClick={()=>navigate("/student/vote/"+e.id)}

disabled={

voted ||

status!=="Live"

}

className={`px-4 py-2 text-white rounded


${

voted

?"bg-gray-400"

:status==="Live"

?"bg-blue-600 hover:bg-blue-700"

:"bg-gray-400"

}

`}

>

{voted

?"Voted"

:status==="Live"

?"Vote"

:status}

</button>


</div>

);

})}


</div>

</div>

);

}