import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/AdminDashboard.css";
import manuals from "../data/ManualData";
import { getAllUsers, getCreatorRequests } from "../data/UserData";
import { useTranslation } from "../utils/translations";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    creators: 0,
    admins: 0,
    manuals: 0,
    pendingRequests: 0,
  });
  const [creatorRequests, setCreatorRequests] = useState([]);
  const [recentManuals, setRecentManuals] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const userData = localStorage.getItem("userData");
    const authToken = localStorage.getItem("authToken");

    if (!userData || !authToken) {
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(userData);

    // Check if user has admin role
    if (currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    setUser(currentUser);

    // Load data
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = () => {
    try {
      // Get all users
      const allUsers = getAllUsers();
      const creators = allUsers.filter((u) => u.role === "creator");
      const admins = allUsers.filter((u) => u.role === "admin");

      // Get creator requests
      const requests = getCreatorRequests();
      const pendingRequests = requests.filter((r) => r.status === "pending");

      // Get recent manuals (last 5)
      const sortedManuals = [...manuals].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const recent = sortedManuals.slice(0, 5).map((manual) => ({
        ...manual,
        status: Math.random() > 0.7 ? "review" : "published", // Random status for demo
      }));

      setStats({
        totalUsers: allUsers.length,
        creators: creators.length,
        admins: admins.length,
        manuals: manuals.length,
        pendingRequests: pendingRequests.length,
      });

      setCreatorRequests(pendingRequests.slice(0, 3)); // Show first 3
      setRecentManuals(recent);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  if (!user) {
    return (
      <main className="ad-page">
        <div className="ad-inner">
          <div className="ad-loading">Loading...</div>
        </div>
      </main>
    );
  }
  return (
    <main className="ad-page">
      <div className="ad-inner">
        <header className="ad-header">
          <div>
            <h1 className="ad-title">
              {t("dashboard.admin.title") || "Admin Dashboard"}
            </h1>
            <p className="ad-sub">
              {t("dashboard.admin.subtitle") ||
                "Overview of users, manuals, and creator requests in your organization"}
            </p>
          </div>
          <div className="ad-headerRight">
            <button
              className="ad-btn ghost"
              onClick={() =>
                alert("Export report functionality would be implemented here")
              }
            >
              {t("dashboard.admin.exportReport") || "Export report"}
            </button>
          </div>
        </header>
        {/* Top stats */}
        <section className="ad-statsGrid">
          <div className="ad-statCard">
            {" "}
            <div className="ad-statLabel">
              {t("dashboard.admin.users") || "Users"}
            </div>
            <div className="ad-statValue">{stats.totalUsers}</div>
            <div className="ad-statSub">
              {t("dashboard.admin.creators") || "Creators"}: {stats.creators} •{" "}
              {t("dashboard.admin.admins") || "Admin"}: {stats.admins}
            </div>
          </div>

          <div className="ad-statCard">
            {" "}
            <div className="ad-statLabel">
              {t("dashboard.admin.manuals") || "Manuals"}
            </div>
            <div className="ad-statValue">{stats.manuals}</div>
            <div className="ad-statSub">
              {t("dashboard.admin.totalManuals") || "Total manuals in system"}
            </div>
          </div>

          <div className="ad-statCard ad-statAccent">
            {" "}
            <div className="ad-statLabel">
              {t("dashboard.admin.creatorRequests") || "Creator requests"}
            </div>
            <div className="ad-statValue">{stats.pendingRequests}</div>
            <div className="ad-statSub">
              {t("dashboard.admin.pendingApproval") ||
                "Requests pending approval"}
            </div>
          </div>
        </section>
        <div className="ad-mainGrid">
          {/* Creator request queue */}
          <section className="ad-card">
            {" "}
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                {t("dashboard.admin.creatorRequests") || "Creator requests"}
              </h2>
              <span className="ad-cardMeta">
                {stats.pendingRequests}{" "}
                {t("dashboard.admin.pending") || "pending"}
              </span>
            </div>
            <div className="ad-requestList">
              {creatorRequests.map((r) => (
                <div key={r.id} className="ad-requestItem">
                  <div className="ad-requestMain">
                    <div className="ad-requestName">{r.name}</div>
                    <div className="ad-requestMeta">
                      {r.department} • requested {r.createdAt}
                    </div>
                    <div className="ad-requestReason">{r.reason}</div>
                  </div>
                  <div className="ad-requestActions">
                    {" "}
                    <button
                      className="ad-btn ghost"
                      onClick={() => alert(`View details for request #${r.id}`)}
                    >
                      {t("dashboard.admin.view") || "View"}
                    </button>
                    <button
                      className="ad-btn approve"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Approve creator request for ${r.name}?`
                          )
                        ) {
                          // In a real app, this would call an API
                          // Here we'll simulate it by updating local storage or just removing from list
                          setCreatorRequests((prev) =>
                            prev.filter((req) => req.id !== r.id)
                          );
                          setStats((prev) => ({
                            ...prev,
                            pendingRequests: prev.pendingRequests - 1,
                            creators: prev.creators + 1,
                          }));
                          alert(`Approved ${r.name} as a creator.`);
                        }
                      }}
                    >
                      {t("dashboard.admin.approve") || "Approve"}
                    </button>
                    <button
                      className="ad-btn reject"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Reject creator request for ${r.name}?`
                          )
                        ) {
                          setCreatorRequests((prev) =>
                            prev.filter((req) => req.id !== r.id)
                          );
                          setStats((prev) => ({
                            ...prev,
                            pendingRequests: prev.pendingRequests - 1,
                          }));
                          alert(`Rejected request for ${r.name}.`);
                        }
                      }}
                    >
                      {t("dashboard.admin.reject") || "Reject"}
                    </button>
                  </div>
                </div>
              ))}{" "}
              {creatorRequests.length === 0 && (
                <div className="ad-empty">
                  {t("dashboard.admin.noRequests") ||
                    "No pending requests. Approved requests are recorded in the system."}
                </div>
              )}
            </div>
          </section>

          {/* Manual overview & user snapshot */}
          <section className="ad-card">
            {" "}
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                {t("dashboard.admin.manageManuals") || "Manage Manuals"}
              </h2>
            </div>
            <div className="ad-table">
              <div className="ad-tableHead">
                <span>{t("dashboard.admin.title") || "Title"}</span>
                <span>{t("dashboard.admin.author") || "Author"}</span>
                <span>{t("dashboard.admin.category") || "Category"}</span>
                <span>{t("dashboard.admin.status") || "Status"}</span>
                <span>{t("dashboard.admin.actions") || "Actions"}</span>
              </div>

              {recentManuals.map((m) => (
                <div key={m.id} className="ad-tableRow">
                  <span className="ad-tableTitle">{m.title}</span>
                  <span className="ad-tableAuthor">{m.author}</span>
                  <span className="ad-tableCategory">{m.category}</span>
                  <span className={`ad-statusPill ad-${m.status}`}>
                    {m.status}
                  </span>
                  <div className="ad-tableActions">
                    <button
                      className="ad-btn ghost small"
                      onClick={() => navigate(`/manual/${m.id}`)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      className="ad-btn reject small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete manual "${m.title}"?`)) {
                          // Delete logic
                          try {
                            const localManuals = JSON.parse(
                              localStorage.getItem("customManuals") || "[]"
                            );
                            const newLocalManuals = localManuals.filter(
                              (manual) => manual.id !== m.id
                            );
                            localStorage.setItem(
                              "customManuals",
                              JSON.stringify(newLocalManuals)
                            );

                            // Update state
                            setRecentManuals((prev) =>
                              prev.filter((manual) => manual.id !== m.id)
                            );
                            setStats((prev) => ({
                              ...prev,
                              manuals: prev.manuals - 1,
                            }));
                            alert("Manual deleted successfully");
                          } catch (err) {
                            console.error(err);
                            alert("Failed to delete manual");
                          }
                        }
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {recentManuals.length === 0 && (
                <div className="ad-empty">
                  {t("dashboard.admin.noRecentManuals") || "No manuals found"}
                </div>
              )}
            </div>
            <div className="ad-divider" />{" "}
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                {t("dashboard.admin.userSnapshot") || "User snapshot"}
              </h2>
            </div>
            <ul className="ad-list">
              <li>
                <span className="ad-dot" />
                {t("dashboard.admin.newUsers") || "8 new users this week"}
              </li>
              <li>
                <span className="ad-dot" />
                {t("dashboard.admin.recentEdits") ||
                  "5 manuals edited in the last 24 hours"}
              </li>
              <li>
                <span className="ad-dot" />
                {t("dashboard.admin.newCreators") ||
                  "2 creators added from requests this week"}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
