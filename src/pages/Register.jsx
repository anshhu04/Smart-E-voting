import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    role: "Student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    const { name, email, studentId, password } = formData;

    if (!name || !email || !studentId || !password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));

    alert("Registration Successful ✅");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617]">
      {/* Container */}

      <div className="flex flex-col items-center px-4 py-10">
        {/* Header */}

        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 flex items-center justify-center
                          rounded-full border-2 border-blue-700"
          >
            <svg
              className="w-6 h-6 text-blue-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold dark:text-white">Smart E-Voting</h1>
        </div>

        {/* Card */}

        <div
          className="w-full max-w-md bg-white dark:bg-slate-900
                        p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold dark:text-white">
            Create Account
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Register to participate in student elections
          </p>

          {/* Name */}

          <label className="block mb-2 dark:text-gray-300">Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="John Doe"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg
                       dark:bg-slate-800 dark:text-white"
          />

          {/* Email */}

          <label className="block mb-2 dark:text-gray-300">Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="student@college.edu"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg
                       dark:bg-slate-800 dark:text-white"
          />

          {/* Student ID */}

          <label className="block mb-2 dark:text-gray-300">Student ID</label>

          <input
            type="text"
            name="studentId"
            placeholder="STU2024001"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg
                       dark:bg-slate-800 dark:text-white"
          />

          {/* Password */}

          <label className="block mb-2 dark:text-gray-300">Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg
                       dark:bg-slate-800 dark:text-white"
          />

          {/* Role */}

          <label className="block mb-2 dark:text-gray-300">Register As</label>

          <select
            name="role"
            onChange={handleChange}
            className="w-full p-3 mb-6 border rounded-lg
                       dark:bg-slate-800 dark:text-white"
          >
            <option>Student</option>
            <option>Admin</option>
          </select>

          {/* Button */}

          <button
            onClick={handleRegister}
            className="w-full bg-blue-800 hover:bg-blue-900
                       text-white py-3 rounded-lg"
          >
            Register
          </button>

          <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
            Already have account?
            <Link to="/login" className="text-blue-700 ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
