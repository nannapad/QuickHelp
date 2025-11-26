import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import "./App.css";

// Context Providers
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";

// Core components that need to load immediately
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { SkipLink } from "./components/AccessibilityComponents";

// Utilities
import { cleanupLocalStorageBlobUrls } from "./utils/cleanupBlobUrls";

// Lazy load components for better bundle splitting
const Feed = lazy(() => import("./pages/Feed"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ManualDetail = lazy(() => import("./pages/ManualDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CreatorRequest = lazy(() => import("./pages/CreatorRequest"));
const CreatorDashboard = lazy(() => import("./pages/CreatorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateManual = lazy(() => import("./pages/CreateManual"));
const EditManual = lazy(() => import("./pages/EditManual"));
const EditDraft = lazy(() => import("./pages/EditDraft"));

// Loading component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      fontSize: "1.1rem",
      color: "var(--text-muted)",
    }}
  >
    <div>Loading...</div>
  </div>
);

// Helper component: redirect to the appropriate dashboard based on role
const DashboardRedirect = () => {
  const raw = localStorage.getItem("userData");
  if (!raw) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(raw);
    if (user.role === "admin")
      return <Navigate to="/admin-dashboard" replace />;
    if (user.role === "creator")
      return <Navigate to="/creator-dashboard" replace />;
    // default for regular users
    return <Navigate to="/feed" replace />;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  useEffect(() => {
    cleanupLocalStorageBlobUrls();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter basename="/QuickHelp/">
            <SkipLink />
            <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="dashboard" element={<DashboardRedirect />} />
                  {/* Protected Routes */}
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
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="create-manual"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "creator"]}>
                        <CreateManual />
                      </ProtectedRoute>
                    }
                  />{" "}
                  <Route
                    path="edit-manual/:id"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "creator"]}>
                        <EditManual />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="edit-manual"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "creator"]}>
                        <EditManual />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="edit-draft/:id"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "creator"]}>
                        <EditDraft />
                      </ProtectedRoute>
                    }
                  />
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
