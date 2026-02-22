import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    role: "student",
    adminKey: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    const { name, email, studentId, password, role, adminKey } = formData;

    if (!name || !email || !studentId || !password) {
      alert("Please fill all fields");

      return;
    }

    if (role === "admin" && adminKey !== "ADMIN123") {
      alert("Invalid Admin Secret Key ❌");

      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.email === email);

    if (userExists) {
      alert("User already exists");

      return;
    }

    const newUser = {
      name,

      email,

      studentId,

      password,

      role,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful ✅");

    setFormData({
      name: "",

      email: "",

      studentId: "",

      password: "",

      role: "student",

      adminKey: "",
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#020617]">
      <div className="flex flex-col items-center px-4 py-10">
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

          <label className="block mb-2 dark:text-gray-300">Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-800 dark:text-white"
          />

          <label className="block mb-2 dark:text-gray-300">Email Address</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@college.edu"
            className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-800 dark:text-white"
          />

          <label className="block mb-2 dark:text-gray-300">Student ID</label>

          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="STU2024001"
            className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-800 dark:text-white"
          />

          <label className="block mb-2 dark:text-gray-300">Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create password"
            className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-800 dark:text-white"
          />

          <label className="block mb-2 dark:text-gray-300">Register As</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-800 dark:text-white"
          >
            <option value="student">Student</option>

            <option value="admin">Admin</option>
          </select>

          {formData.role === "admin" && (
            <>
              <label className="block mb-2 dark:text-gray-300">
                Admin Secret Key
              </label>

              <input
                type="password"
                name="adminKey"
                value={formData.adminKey}
                onChange={handleChange}
                placeholder="Enter secret key"
                className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-800 dark:text-white"
              />
            </>
          )}

          <button
            onClick={handleRegister}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg"
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
