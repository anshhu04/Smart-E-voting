import { Outlet, useNavigate } from "react-router-dom";

export default function StudentLayout() {

const navigate = useNavigate();

const logout = () => {

localStorage.removeItem("loggedInUser");

navigate("/login");

};

return (

<div className="min-h-screen flex">

{/* Sidebar */}

<div className="w-64 bg-slate-900 text-white p-6">

<h2 className="text-2xl font-bold mb-10">

Smart Voting

</h2>

<div className="space-y-4">

<p onClick={()=>navigate("/student/dashboard")} className="cursor-pointer hover:text-blue-400">

Dashboard

</p>

<p onClick={()=>navigate("/student/elections")} className="cursor-pointer hover:text-blue-400">

Elections

</p>

<p onClick={()=>navigate("/student/results")} className="cursor-pointer hover:text-blue-400">

Results

</p>

<p onClick={()=>navigate("/student/profile")} className="cursor-pointer hover:text-blue-400">

Profile

</p>

<p onClick={logout} className="cursor-pointer text-red-400">

Logout

</p>

</div>

</div>

{/* Page Content */}

<div className="flex-1 bg-gray-100 p-6">

<Outlet/>

</div>

</div>

);

}