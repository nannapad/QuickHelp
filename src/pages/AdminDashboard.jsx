import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import "./css/AdminDashboard.css";
import manuals from "../data/ManualData";
import { getAllUsers, updateUserProfile } from "../data/UserData";
import { getAllRequests, updateRequestStatus } from "../data/CreatorRequests";
import { addNotification } from "../utils/notifications";
import { useTranslation } from "../utils/translations";
import { getSearchStats, getTotalSearches } from "../utils/searchAnalytics";

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
  const [searchStats, setSearchStats] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modalState, showAlert, showConfirm, hideAlert } = useAlertModal();

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
      const admins = allUsers.filter((u) => u.role === "admin"); // Get creator requests from localStorage
      const requests = getAllRequests();
      const pendingRequests = requests.filter((r) => r.status === "pending");

      // Get recent manuals including custom manuals with status
      // FIX: Prevent duplicates - custom manuals override static ones
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );

      // Build set of custom IDs to filter out static manuals with same ID
      const customIds = new Set(customManuals.map((m) => m.id));
      const staticManuals = manuals.filter((m) => !customIds.has(m.id));

      // Custom manuals first, then non-duplicate static manuals
      const allManuals = [...customManuals, ...staticManuals];

      const sortedManuals = allManuals.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Add status to existing manuals if not present (backward compatibility)
      const recent = sortedManuals.slice(0, 5).map((manual) => ({
        ...manual,
        status: manual.status || "published", // Default to published for existing manuals
      })); // Count pending and draft manuals
      const pendingManuals = customManuals.filter(
        (m) => m.status === "pending"
      );
      const draftManuals = customManuals.filter((m) => m.status === "draft");

      setStats({
        totalUsers: allUsers.length,
        creators: creators.length,
        admins: admins.length,
        manuals: allManuals.length,
        pendingRequests: pendingRequests.length,
        pendingManuals: pendingManuals.length,
        draftManuals: draftManuals.length,
      });
      setCreatorRequests(pendingRequests.slice(0, 3)); // Show first 3
      setRecentManuals(recent);

      // Load search analytics
      const topSearches = getSearchStats({ days: 7, limit: 5 });
      setSearchStats(topSearches);

      // Load user questions from FAQ
      const questions = JSON.parse(
        localStorage.getItem("userQuestions") || "[]"
      );
      const pendingQuestions = questions.filter((q) => q.status === "pending");
      setUserQuestions(pendingQuestions);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };
  const approveManual = (manualId) => {
    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const manual = customManuals.find((m) => m.id === manualId);
      const updatedManuals = customManuals.map((manual) =>
        manual.id === manualId ? { ...manual, status: "published" } : manual
      );

      localStorage.setItem("customManuals", JSON.stringify(updatedManuals));

      // Send notification to manual creator
      if (manual && manual.authorId) {
        addNotification({
          userId: manual.authorId,
          message: `Your manual "${manual.title}" has been approved and published!`,
          type: "success",
          link: `/manual/${manualId}`,
        });
      }

      // Update state
      setRecentManuals((prev) =>
        prev.map((manual) =>
          manual.id === manualId ? { ...manual, status: "published" } : manual
        )
      ); // Update pending count
      setStats((prev) => ({
        ...prev,
        pendingManuals: prev.pendingManuals - 1,
      }));

      showAlert("Manual approved and published successfully!", "success");
    } catch (error) {
      console.error("Error approving manual:", error);
      showAlert("Failed to approve manual", "error");
    }
  };
  const rejectManual = (manualId, manualTitle) => {
    showConfirm(
      `Reject and delete manual "${manualTitle}"? This action cannot be undone.`,
      () => {
        performRejectManual(manualId);
      },
      "danger",
      "Confirm Rejection",
      "Reject",
      "Cancel"
    );
  };

  const performRejectManual = (manualId) => {
    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const manual = customManuals.find((m) => m.id === manualId);
      const updatedManuals = customManuals.filter(
        (manual) => manual.id !== manualId
      );

      localStorage.setItem("customManuals", JSON.stringify(updatedManuals));

      // Send notification to manual creator
      if (manual && manual.authorId) {
        addNotification({
          userId: manual.authorId,
          message: `Your manual "${manual.title}" was not approved.`,
          type: "warning",
          link: null,
        });
      }

      // Update state
      setRecentManuals((prev) =>
        prev.filter((manual) => manual.id !== manualId)
      );

      // Update counts
      setStats((prev) => ({
        ...prev,
        manuals: prev.manuals - 1,
        pendingManuals: prev.pendingManuals - 1,
      }));

      showAlert("Manual rejected and deleted successfully!", "success");
    } catch (error) {
      console.error("Error rejecting manual:", error);
      showAlert("Failed to reject manual", "error");
    }
  };
  const deleteDraft = (manualId, manualTitle) => {
    showConfirm(
      `Delete draft "${manualTitle}"? This action cannot be undone.`,
      () => {
        performDeleteDraft(manualId);
      },
      "danger",
      "Confirm Deletion",
      "Delete",
      "Cancel"
    );
  };

  const performDeleteDraft = (manualId) => {
    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const manual = customManuals.find((m) => m.id === manualId);
      const updatedManuals = customManuals.filter(
        (manual) => manual.id !== manualId
      );

      localStorage.setItem("customManuals", JSON.stringify(updatedManuals));

      // Send notification to manual creator
      if (manual && manual.authorId) {
        addNotification({
          userId: manual.authorId,
          message: `Your draft "${manual.title}" has been deleted by an admin.`,
          type: "warning",
          link: null,
        });
      }

      // Update state
      setRecentManuals((prev) =>
        prev.filter((manual) => manual.id !== manualId)
      );

      // Update counts
      setStats((prev) => ({
        ...prev,
        manuals: prev.manuals - 1,
        draftManuals: prev.draftManuals - 1,
      }));

      showAlert("Draft deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting draft:", error);
      showAlert("Failed to delete draft", "error");
    }
  };
  const deleteManual = (manualId, manualTitle) => {
    showConfirm(
      `Delete manual "${manualTitle}"? This action cannot be undone.`,
      () => {
        performDeleteManual(manualId);
      },
      "danger",
      "Confirm Deletion",
      "Delete",
      "Cancel"
    );
  };

  const performDeleteManual = (manualId) => {
    try {
      const customManuals = JSON.parse(
        localStorage.getItem("customManuals") || "[]"
      );
      const updatedManuals = customManuals.filter(
        (manual) => manual.id !== manualId
      );

      localStorage.setItem("customManuals", JSON.stringify(updatedManuals));

      // Update state
      setRecentManuals((prev) =>
        prev.filter((manual) => manual.id !== manualId)
      );
      setStats((prev) => ({
        ...prev,
        manuals: prev.manuals - 1,
      }));

      showAlert("Manual deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting manual:", error);
      showAlert("Failed to delete manual", "error");
    }
  };
  const answerQuestion = (questionId, answerText) => {
    try {
      const allQuestions = JSON.parse(
        localStorage.getItem("userQuestions") || "[]"
      );

      const adminName = user ? `${user.firstName} ${user.lastName}` : "Admin";

      const updatedQuestions = allQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: "answered",
              answer: answerText,
              answeredAt: new Date().toISOString(),
              answeredBy: adminName,
            }
          : q
      );

      localStorage.setItem("userQuestions", JSON.stringify(updatedQuestions));

      // Update state
      setUserQuestions((prev) => prev.filter((q) => q.id !== questionId));

      showAlert("Question answered successfully!", "success");
    } catch (error) {
      console.error("Error answering question:", error);
      showAlert("Failed to answer question", "error");
    }
  };

  const archiveQuestion = (questionId) => {
    try {
      const allQuestions = JSON.parse(
        localStorage.getItem("userQuestions") || "[]"
      );

      const updatedQuestions = allQuestions.map((q) =>
        q.id === questionId
          ? { ...q, status: "archived", archivedAt: new Date().toISOString() }
          : q
      );

      localStorage.setItem("userQuestions", JSON.stringify(updatedQuestions));

      // Update state
      setUserQuestions((prev) => prev.filter((q) => q.id !== questionId));

      showAlert("Question archived successfully!", "success");
    } catch (error) {
      console.error("Error archiving question:", error);
      showAlert("Failed to archive question", "error");
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
          </div>{" "}
          <div className="ad-headerRight">
            <button
              className="ad-btn ghost"
              onClick={() =>
                showAlert(
                  "Export report functionality would be implemented here",
                  "info"
                )
              }
            >
              {t("dashboard.admin.exportReport") || "Export report"}
            </button>
          </div>
        </header>{" "}
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
          </div>{" "}
          <div className="ad-statCard ad-statAccent">
            {" "}
            <div className="ad-statLabel">
              {t("dashboard.admin.pendingManuals") || "Pending manuals"}
            </div>
            <div className="ad-statValue">{stats.pendingManuals || 0}</div>
            <div className="ad-statSub">
              {t("dashboard.admin.awaitingApproval") || "Awaiting approval"}
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
              {" "}
              {creatorRequests.map((r) => (
                <div key={r.id} className="ad-requestItem">
                  <div className="ad-requestMain">
                    <div className="ad-requestName">{r.username}</div>
                    <div className="ad-requestMeta">
                      {r.team} • requested{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                    <div className="ad-requestReason">{r.reason}</div>
                  </div>{" "}
                  <div className="ad-requestActions">
                    {" "}
                    <button
                      className="ad-btn ghost"
                      onClick={() =>
                        showAlert(
                          `Types: ${r.types?.join(", ") || "N/A"}\n\nReason: ${
                            r.reason
                          }`,
                          "info",
                          "Request Details"
                        )
                      }
                    >
                      {t("dashboard.admin.view") || "View"}
                    </button>
                    <button
                      className="ad-btn approve"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Approve creator request for ${r.username}?`
                          )
                        ) {
                          try {
                            // Update request status
                            updateRequestStatus(r.id, {
                              status: "approved",
                              reviewerId: user.id,
                              note: "Request approved by admin",
                            });

                            // Update user role in quickhelp_users
                            const allUsers = getAllUsers();
                            const updatedUsers = allUsers.map((u) =>
                              u.id === r.userId ? { ...u, role: "creator" } : u
                            );
                            localStorage.setItem(
                              "quickhelp_users",
                              JSON.stringify(updatedUsers)
                            );

                            // If this is the currently logged-in user, update userData
                            const currentUserData =
                              localStorage.getItem("userData");
                            if (currentUserData) {
                              const currentUser = JSON.parse(currentUserData);
                              if (currentUser.id === r.userId) {
                                currentUser.role = "creator";
                                localStorage.setItem(
                                  "userData",
                                  JSON.stringify(currentUser)
                                );
                                window.dispatchEvent(
                                  new Event("authStateChanged")
                                );
                              }
                            }

                            // Send notification
                            addNotification({
                              userId: r.userId,
                              message:
                                "Your creator request has been approved! You can now create manuals.",
                              type: "success",
                              link: "/creator-dashboard",
                            }); // Update state
                            setCreatorRequests((prev) =>
                              prev.filter((req) => req.id !== r.id)
                            );
                            setStats((prev) => ({
                              ...prev,
                              pendingRequests: prev.pendingRequests - 1,
                              creators: prev.creators + 1,
                            }));

                            showAlert(
                              `Approved ${r.username} as a creator.`,
                              "success"
                            );
                          } catch (error) {
                            console.error("Error approving request:", error);
                            showAlert("Failed to approve request", "error");
                          }
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
                            `Reject creator request for ${r.username}?`
                          )
                        ) {
                          try {
                            // Update request status
                            updateRequestStatus(r.id, {
                              status: "rejected",
                              reviewerId: user.id,
                              note: "Request rejected by admin",
                            });

                            // Send notification
                            addNotification({
                              userId: r.userId,
                              message:
                                "Your creator request was not approved at this time.",
                              type: "warning",
                              link: "/creator-request",
                            }); // Update state
                            setCreatorRequests((prev) =>
                              prev.filter((req) => req.id !== r.id)
                            );
                            setStats((prev) => ({
                              ...prev,
                              pendingRequests: prev.pendingRequests - 1,
                            }));

                            showAlert(
                              `Rejected request for ${r.username}.`,
                              "success"
                            );
                          } catch (error) {
                            console.error("Error rejecting request:", error);
                            showAlert("Failed to reject request", "error");
                          }
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
          </section>{" "}
          {/* Pending Manuals Section */}
          <section className="ad-card">
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                {t("dashboard.admin.pendingManuals") || "Pending Manuals"}
              </h2>
              <span className="ad-cardMeta">
                {stats.pendingManuals || 0}{" "}
                {t("dashboard.admin.pending") || "pending"}
              </span>
            </div>{" "}
            <div className="ad-table">
              <div className="ad-tableHead">
                <span>{t("dashboard.admin.tableTitle") || "Title"}</span>
                <span>{t("dashboard.admin.author") || "Author"}</span>
                <span>{t("dashboard.admin.category") || "Category"}</span>
                <span>{t("dashboard.admin.submitted") || "Submitted"}</span>
                <span>{t("dashboard.admin.actions") || "Actions"}</span>
              </div>

              {recentManuals
                .filter((m) => m.status === "pending")
                .map((m) => (
                  <div key={m.id} className="ad-tableRow">
                    <span className="ad-tableTitle">{m.title}</span>
                    <span className="ad-tableAuthor">{m.author}</span>
                    <span className="ad-tableCategory">{m.category}</span>
                    <span className="ad-tableDate">{m.createdAt}</span>
                    <div className="ad-tableActions">
                      <button
                        className="ad-btn ghost small"
                        onClick={() => navigate(`/manual/${m.id}`)}
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        className="ad-btn approve small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Approve and publish manual "${m.title}"?`
                            )
                          ) {
                            approveManual(m.id);
                          }
                        }}
                        title="Approve"
                      >
                        ✅
                      </button>
                      <button
                        className="ad-btn reject small"
                        onClick={(e) => {
                          e.stopPropagation();
                          rejectManual(m.id, m.title);
                        }}
                        title="Reject"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}

              {recentManuals.filter((m) => m.status === "pending").length ===
                0 && (
                <div className="ad-empty">
                  {t("dashboard.admin.noPendingManuals") ||
                    "No pending manuals. All manuals have been reviewed."}
                </div>
              )}
            </div>{" "}
          </section>
          {/* Draft Manuals Section - Compact */}
          <section className="ad-card ad-card-compact">
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                {t("dashboard.admin.draftManuals") || "Draft Manuals"}
              </h2>
              <span className="ad-cardMeta">
                {stats.draftManuals || 0}{" "}
                {t("dashboard.admin.drafts") || "drafts"}
              </span>
            </div>{" "}
            <div className="ad-table">
              <div className="ad-tableHead">
                <span>{t("dashboard.admin.tableTitle") || "Title"}</span>
                <span>{t("dashboard.admin.author") || "Author"}</span>
                <span>{t("dashboard.admin.actions") || "Actions"}</span>
              </div>

              {recentManuals
                .filter((m) => m.status === "draft")
                .slice(0, 3)
                .map((m) => (
                  <div key={m.id} className="ad-tableRow">
                    <span className="ad-tableTitle">{m.title}</span>
                    <span className="ad-tableAuthor">{m.author}</span>
                    <div className="ad-tableActions">
                      <button
                        className="ad-btn ghost small"
                        onClick={() => navigate(`/edit-manual/${m.id}`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="ad-btn reject small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDraft(m.id, m.title);
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

              {recentManuals.filter((m) => m.status === "draft").length ===
                0 && (
                <div className="ad-empty">
                  {t("dashboard.admin.noDrafts") || "No draft manuals found."}
                </div>
              )}
            </div>
          </section>
          {/* User Questions from FAQ */}
          <section className="ad-card">
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                💬{" "}
                {t("dashboard.admin.userQuestions") ||
                  "User Questions from FAQ"}
              </h2>
              <span className="ad-cardMeta">
                {userQuestions.length}{" "}
                {t("dashboard.admin.pending") || "pending"}
              </span>
            </div>

            {userQuestions.length === 0 ? (
              <div className="ad-empty">
                {t("dashboard.admin.noQuestions") ||
                  "No pending questions. Users can submit questions from the FAQ page."}
              </div>
            ) : (
              <div className="ad-questionList">
                {userQuestions.slice(0, 5).map((q) => (
                  <div key={q.id} className="ad-questionItem">
                    <div className="ad-questionHeader">
                      <div className="ad-questionMeta">
                        <strong>{q.name}</strong>
                        <span className="ad-questionEmail">{q.email}</span>
                        <span className="ad-questionDate">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="ad-questionText">{q.question}</div>
                    <div className="ad-questionActions">
                      <button
                        className="ad-btn ghost small"
                        onClick={() => {
                          const answer = prompt(
                            "Enter your answer to this question:"
                          );
                          if (answer && answer.trim()) {
                            answerQuestion(q.id, answer.trim());
                          }
                        }}
                      >
                        ✍️ Answer
                      </button>
                      <button
                        className="ad-btn ghost small"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Archive this question without answering?"
                            )
                          ) {
                            archiveQuestion(q.id);
                          }
                        }}
                      >
                        📁 Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Published Manuals */}
          <section className="ad-card">
            {" "}
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                {t("dashboard.admin.publishedManuals") || "Published Manuals"}
              </h2>
              <span className="ad-cardMeta">
                {recentManuals.filter((m) => m.status === "published").length}{" "}
                {t("dashboard.admin.published") || "published"}
              </span>
            </div>{" "}
            <div className="ad-table">
              <div className="ad-tableHead">
                <span>{t("dashboard.admin.tableTitle") || "Title"}</span>
                <span>{t("dashboard.admin.author") || "Author"}</span>
                <span>{t("dashboard.admin.category") || "Category"}</span>
                <span>{t("dashboard.admin.created") || "Created"}</span>
                <span>{t("dashboard.admin.actions") || "Actions"}</span>
              </div>
              {recentManuals
                .filter((m) => m.status === "published")
                .map((m) => (
                  <div key={m.id} className="ad-tableRow">
                    <span className="ad-tableTitle">{m.title}</span>
                    <span className="ad-tableAuthor">{m.author}</span>
                    <span className="ad-tableCategory">{m.category}</span>
                    <span className="ad-tableDate">{m.createdAt}</span>
                    <div className="ad-tableActions">
                      <button
                        className="ad-btn ghost small"
                        onClick={() => navigate(`/manual/${m.id}`)}
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        className="ad-btn ghost small"
                        onClick={() => navigate(`/edit-manual/${m.id}`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="ad-btn reject small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteManual(m.id, m.title);
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}{" "}
              {recentManuals.filter((m) => m.status === "published").length ===
                0 && (
                <div className="ad-empty">
                  {t("dashboard.admin.noPublishedManuals") ||
                    "No published manuals found"}
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
            </ul>{" "}
          </section>
          {/* Search Analytics Section */}
          <section className="ad-card">
            <div className="ad-cardHeader">
              <h2 className="ad-cardTitle">
                🔍{" "}
                {t("dashboard.admin.topSearches") ||
                  "Top search terms (last 7 days)"}
              </h2>
              <span className="ad-cardMeta">
                {searchStats.length} {t("dashboard.admin.queries") || "queries"}
              </span>
            </div>

            {searchStats.length === 0 ? (
              <div className="ad-empty">
                {t("dashboard.admin.noSearchData") ||
                  "No search data yet. Search analytics will appear here once users start searching for manuals."}
              </div>
            ) : (
              <div className="ad-table">
                <div className="ad-tableHead">
                  <span>{t("dashboard.admin.query") || "Query"}</span>
                  <span>{t("dashboard.admin.searchCount") || "Count"}</span>
                  <span>
                    {t("dashboard.admin.noResults") || "No-result searches"}
                  </span>
                </div>
                {searchStats.map((item, index) => (
                  <div key={index} className="ad-tableRow">
                    <span className="ad-tableTitle">
                      <strong>"{item.query}"</strong>
                    </span>
                    <span className="ad-tableCount">{item.count}</span>
                    <span
                      className={`ad-tableNoResults ${
                        item.noResultCount > 0 ? "ad-warning" : ""
                      }`}
                    >
                      {item.noResultCount > 0 ? (
                        <>⚠️ {item.noResultCount}</>
                      ) : (
                        <>✓ {item.noResultCount}</>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {searchStats.some((s) => s.noResultCount > 0) && (
              <div className="ad-searchTip">
                <span className="ad-tipIcon">💡</span>
                <span>
                  {t("dashboard.admin.searchTip") ||
                    "Queries with no results may indicate missing manuals. Consider creating guides for these topics."}
                </span>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        show={modalState.show}
        onHide={hideAlert}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </main>
  );
};

export default AdminDashboard;
