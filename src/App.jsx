import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ManualDetail from "./pages/ManualDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";
import CreatorRequest from "./pages/CreatorRequest";
import { LanguageProvider } from "./contexts/LanguageContext";
import CreatorDashboard from "./pages/CreatorDashboard";
import Admindashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateManual from "./pages/CreateManual";

// Helper component: redirect to the appropriate dashboard based on role
const DashboardRedirect = () => {
  const raw = localStorage.getItem("userData");
  if (!raw) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(raw);
    if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (user.role === "creator") return <Navigate to="/creator-dashboard" replace />;
    // default for regular users
    return <Navigate to="/feed" replace />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/QuickHelp/">
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="manual/:id" element={<ManualDetail />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="creator-request" element={<CreatorRequest />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="creator-dashboard"
              element={
                <ProtectedRoute allowedRoles={["creator"]}>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admindashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "creator", "user"]}>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            <Route path="create-manual" element={<ProtectedRoute allowedRoles={["admin","creator"]}><CreateManual/></ProtectedRoute>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
