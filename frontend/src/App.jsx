// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import ChooseRole from "./pages/ChooseRole";
import DriverRegister from "./pages/DriverRegister";
import RecruiterRegister from "./pages/RecruiterRegister";
import Login from "./pages/Login";
import DriverDashboard from "./pages/DriverDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";
import DriverApplications from "./pages/DriverApplications";
import MyProfile from "./pages/MyProfile";
import Chat from "./pages/Chat";
import RecruiterChat from "./pages/RecruiterChat";






export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/register/driver" element={<DriverRegister />} />
          <Route path="/register/recruiter" element={<RecruiterRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/chat/:jobId/:userId" element={<Chat />} />
          <Route path="/chat/recruiter/:jobId/:driverId" element={<RecruiterChat />} />



          {/* Protect driver dashboard */}
          <Route
            path="/dashboard/driver"
            element={
              <ProtectedRoute requiredRole="driver">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protect recruiter dashboard */}
          <Route
            path="/dashboard/recruiter"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={<DriverApplications />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
