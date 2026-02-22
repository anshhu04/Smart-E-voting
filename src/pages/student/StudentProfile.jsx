export default function StudentProfile(){

const user=JSON.parse(localStorage.getItem("loggedInUser"));

return(

<div>

<h1 className="text-3xl font-bold mb-6">

Profile

</h1>

<p>Name: {user.name}</p>

<p>Email: {user.email}</p>

<p>Student ID: {user.studentId}</p>

</div>

);

}