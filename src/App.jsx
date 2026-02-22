import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";

// ✅ Student Panel Imports
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard1";
import StudentElections from "./pages/student/StudentElections";
import StudentVote from "./pages/student/StudentVote";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/student");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* Landing Page */}

        <Route
          path="/"
          element={
            <>
              <Hero />
              <Services />
              <Footer />
            </>
          }
        />

        {/* Auth */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* Admin Protected */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ✅ FULL STUDENT PANEL */}

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >

          <Route path="dashboard" element={<StudentDashboard />} />

          <Route path="elections" element={<StudentElections />} />

          <Route path="vote/:id" element={<StudentVote />} />

          <Route path="results" element={<StudentResults />} />

          <Route path="profile" element={<StudentProfile />} />

        </Route>


      </Routes>
    </>
  );

}

export default App;