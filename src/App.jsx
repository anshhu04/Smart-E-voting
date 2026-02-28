import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Services from "./components/Services";
import Footer   from "./components/Footer";

import Login         from "./pages/Login";
import Register      from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";

/* ── Admin Panel ── */
import AdminLayout     from "./pages/admin/AdminLayout";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminElections  from "./pages/admin/AdminElections";
import AdminCandidates from "./pages/admin/AdminCandidates";
import AdminVoters     from "./pages/admin/AdminVoters";
import AdminResults    from "./pages/admin/AdminResults";

/* ── Student Panel ── */
import StudentLayout    from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard1";
import StudentElections from "./pages/student/StudentElections";
import StudentVote      from "./pages/student/StudentVote";
import StudentResults   from "./pages/student/StudentResults";
import StudentProfile   from "./pages/student/StudentProfile";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/login")    ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password")  ||
    location.pathname.startsWith("/admin")    ||
    location.pathname.startsWith("/student");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ── Landing ── */}
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

        {/* ── Auth ── */}
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Admin Panel ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="elections"  element={<AdminElections />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="voters"     element={<AdminVoters />} />
          <Route path="results"    element={<AdminResults />} />
        </Route>

        {/* ── Student Panel ── */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard"  element={<StudentDashboard />} />
          <Route path="elections"  element={<StudentElections />} />
          <Route path="vote/:id"   element={<StudentVote />} />
          <Route path="results"    element={<StudentResults />} />
          <Route path="profile"    element={<StudentProfile />} />
        </Route>

        {/* ── 404 Fallback ── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
