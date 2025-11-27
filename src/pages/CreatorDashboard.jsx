import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import "./css/Creatordashboard.css";
import manuals from "../data/ManualData";
import { useTranslation } from "../utils/translations";

const CreatorDashboard = () => {
  const [user, setUser] = useState(null);
  const [userManuals, setUserManuals] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modalState, showAlert, showConfirm, hideAlert } = useAlertModal();

  useEffect(() => {
    // Check if user is authenticated and has creator/admin role
    const userData = localStorage.getItem("userData");
    const authToken = localStorage.getItem("authToken");

    if (!userData || !authToken) {
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(userData);

    // Check if user has creator or admin role
    if (currentUser.role !== "creator" && currentUser.role !== "admin") {
      navigate("/");
      return;
    }
    setUser(currentUser); // Get both static and custom manuals created by this user
    const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;

    // Filter static manuals created by this user (only exact matches)
    const staticUserManuals = manuals.filter(
      (manual) =>
        manual.author === userFullName || manual.author === currentUser.username
    );

    // Get custom manuals from localStorage
    const customManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );

    // Filter custom manuals created by this user
    const userCustomManuals = customManuals.filter(
      (manual) =>
        manual.author === userFullName || manual.author === currentUser.username
    );

    // FIX: Prevent duplicates - custom manuals override static ones
    // Build set of custom IDs to filter out static manuals with same ID
    const customIds = new Set(userCustomManuals.map((m) => m.id));
    const filteredStaticManuals = staticUserManuals.filter(
      (m) => !customIds.has(m.id)
    );

    // Combine all user manuals and add status
    const allUserManuals = [
      ...userCustomManuals.map((manual) => ({
        ...manual,
        status: manual.status || "published", // Use status from manual or default to published
        views: manual.views || 0,
      })),
      ...filteredStaticManuals.map((manual) => ({
        ...manual,
        status: "published", // Static manuals are always published
        views: manual.views || 0,
      })),
    ];

    setUserManuals(allUserManuals);
  }, [navigate]);

  if (!user) {
    return (
      <main className="cd-page">
        <div className="cd-inner">
          <div className="cd-loading">Loading...</div>
        </div>
      </main>
    );
  }
  const published = userManuals.filter((m) => m.status === "published");
  const drafts = userManuals.filter((m) => m.status === "draft");
  const pending = userManuals.filter((m) => m.status === "pending");
  const totalViews = published.reduce((sum, m) => sum + (m.views || 0), 0);

  return (
    <main className="cd-page">
      <div className="cd-inner">
        {" "}
        <header className="cd-header">
          <div>
            <h1 className="cd-title">
              {t("dashboard.creator.title") || "Creator Dashboard"}
            </h1>
            <p className="cd-sub">
              {t("dashboard.creator.subtitle") ||
                "Overview of your manuals, drafts, and recent activity"}
            </p>
          </div>
          <button
            className="cd-btn primary"
            onClick={() => navigate("/create-manual")}
          >
            {" "}
            + {t("dashboard.creator.createManual") || "Create manual"}
          </button>
        </header>{" "}
        {/* Summary cards */}
        <section className="cd-summaryGrid">
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">
              {t("dashboard.creator.publishedManuals") || "Published manuals"}
            </div>
            <div className="cd-summaryValue">{published.length}</div>
            <div className="cd-summarySub">
              {t("dashboard.creator.publishedDesc") ||
                "Manuals that are live and searchable"}
            </div>
          </div>
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">
              {t("dashboard.creator.pendingManuals") || "Pending approval"}
            </div>
            <div className="cd-summaryValue">{pending.length}</div>
            <div className="cd-summarySub">
              {t("dashboard.creator.pendingDesc") ||
                "Manuals awaiting admin approval"}
            </div>
          </div>
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">
              {t("dashboard.creator.drafts") || "Drafts"}
            </div>
            <div className="cd-summaryValue">{drafts.length}</div>
            <div className="cd-summarySub">
              {t("dashboard.creator.draftsDesc") ||
                "Unpublished manuals you can continue editing"}
            </div>
          </div>
          <div className="cd-summaryCard">
            <div className="cd-summaryLabel">
              {t("dashboard.creator.totalViews") || "Total views"}
            </div>
            <div className="cd-summaryValue">{totalViews}</div>
            <div className="cd-summarySub">
              {t("dashboard.creator.viewsDesc") ||
                "Total views across all your manuals"}
            </div>
          </div>
        </section>
        <div className="cd-mainGrid">
          {" "}
          {/* My manuals */}
          <section className="cd-card">
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">
                {t("dashboard.creator.myManuals") || "My manuals"}
              </h2>
              <span className="cd-cardMeta">
                {userManuals.length} total • {published.length}{" "}
                {t("dashboard.creator.published") || "published"}
                {pending.length > 0 && (
                  <>
                    {" • "}
                    {pending.length} pending
                  </>
                )}
              </span>
            </div>{" "}
            <div className="cd-table">
              <div className="cd-tableHead">
                <span>{t("dashboard.admin.title") || "Title"}</span>
                <span>{t("dashboard.creator.category") || "Category"}</span>
                <span>{t("dashboard.creator.status") || "Status"}</span>
                <span>
                  {t("dashboard.creator.lastUpdated") || "Last updated"}
                </span>
                <span>{t("dashboard.creator.views") || "Views"}</span>
                <span>{t("dashboard.creator.actions") || "Actions"}</span>
              </div>
              {userManuals.map((m) => (
                <div key={m.id} className="cd-tableRow cd-tableRowActions">
                  <span className="cd-tableTitle">{m.title}</span>
                  <span className="cd-tableCategory">{m.category}</span>
                  <span className={`cd-statusPill cd-${m.status}`}>
                    {m.status}
                  </span>
                  <span className="cd-tableDate">
                    {m.updatedAt || m.createdAt}
                  </span>
                  <span className="cd-tableViews">{m.views}</span>
                  <span className="cd-tableActions">
                    {m.status === "published" && (
                      <button
                        className="cd-btn ghost small"
                        onClick={() => navigate(`/manual/${m.id}`)}
                        title="View manual"
                      >
                        👁️
                      </button>
                    )}
                    <button
                      className="cd-btn ghost small"
                      onClick={() => navigate(`/edit-manual/${m.id}`)}
                      title="Edit manual"
                    >
                      ✏️
                    </button>{" "}
                    <button
                      className="cd-btn ghost small"
                      onClick={() => {
                        showConfirm(
                          `Delete manual "${m.title}"? This action cannot be undone.`,
                          () => {
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
                              setUserManuals((prev) =>
                                prev.filter((manual) => manual.id !== m.id)
                              );

                              // Dispatch event to update other components
                              window.dispatchEvent(new Event("manualUpdated"));

                              showAlert(
                                "Manual deleted successfully",
                                "success"
                              );
                            } catch (err) {
                              console.error(err);
                              showAlert("Failed to delete manual", "error");
                            }
                          },
                          "danger",
                          "Confirm Deletion",
                          "Delete",
                          "Cancel"
                        );
                      }}
                      title="Delete manual"
                      style={{ color: "#ef4444" }}
                    >
                      🗑️
                    </button>
                  </span>
                </div>
              ))}{" "}
              {userManuals.length === 0 && (
                <div className="cd-empty">
                  {t("dashboard.creator.noManuals") ||
                    "No manuals yet. Try creating your first manual!"}
                </div>
              )}
            </div>{" "}
          </section>{" "}
          {/* Drafts & Pending - Split into two sections */}
          <section className="cd-card">
            {/* Draft Manuals Section */}
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">
                {t("dashboard.creator.draftManuals") || "Draft Manuals"}
              </h2>
              <span className="cd-cardMeta">
                {drafts.length} {t("dashboard.creator.draft") || "draft"}
                {drafts.length !== 1 && "s"}
              </span>
            </div>
            <div className="cd-draftList">
              {drafts.map((m) => (
                <div key={m.id} className="cd-draftItem">
                  <div>
                    <div className="cd-draftTitle">
                      {m.title}
                      <span
                        className={`cd-statusPill cd-${m.status}`}
                        style={{ marginLeft: "8px", fontSize: "9px" }}
                      >
                        {m.status}
                      </span>
                    </div>
                    <div className="cd-draftMeta">
                      {m.category} •{" "}
                      {t("dashboard.creator.lastEdited") || "last edited"}{" "}
                      {m.updatedAt || m.createdAt}
                    </div>
                  </div>{" "}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="cd-btn ghost"
                      onClick={() => navigate(`/edit-draft/${m.id}`)}
                    >
                      {t("dashboard.creator.publish") || "Publish"}
                    </button>
                    <button
                      className="cd-btn ghost"
                      onClick={() => {
                        showConfirm(
                          `${t("common.delete") || "Delete"} "${
                            m.title
                          }"? This action cannot be undone.`,
                          () => {
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

                              setUserManuals((prev) =>
                                prev.filter((manual) => manual.id !== m.id)
                              );

                              window.dispatchEvent(new Event("manualUpdated"));

                              showAlert(
                                "Draft deleted successfully",
                                "success"
                              );
                            } catch (err) {
                              console.error(err);
                              showAlert("Failed to delete draft", "error");
                            }
                          },
                          "danger",
                          "Confirm Deletion",
                          "Delete",
                          "Cancel"
                        );
                      }}
                      title={t("common.delete") || "Delete draft"}
                      style={{ color: "#ef4444" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {drafts.length === 0 && (
                <div className="cd-empty">
                  {t("dashboard.creator.noDraftsMessage") ||
                    "No draft manuals. When you save as draft, they will appear here."}
                </div>
              )}
            </div>
            {/* Pending Manuals Section */}
            {pending.length > 0 && (
              <>
                <div className="cd-divider" style={{ margin: "20px 0" }} />
                <div className="cd-cardHeader">
                  <h2 className="cd-cardTitle">
                    {t("dashboard.creator.pendingManuals") ||
                      "Pending Approval"}
                  </h2>
                  <span className="cd-cardMeta">
                    {pending.length}{" "}
                    {t("dashboard.creator.pending") || "pending"}
                  </span>
                </div>
                <div className="cd-draftList">
                  {pending.map((m) => (
                    <div key={m.id} className="cd-draftItem">
                      <div>
                        <div className="cd-draftTitle">
                          {m.title}
                          <span
                            className={`cd-statusPill cd-${m.status}`}
                            style={{ marginLeft: "8px", fontSize: "9px" }}
                          >
                            {m.status}
                          </span>
                        </div>
                        <div className="cd-draftMeta">
                          {m.category} •{" "}
                          {t("dashboard.creator.submitted") || "submitted"}{" "}
                          {m.updatedAt || m.createdAt}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="cd-btn ghost"
                          onClick={() => navigate(`/edit-manual/${m.id}`)}
                        >
                          {t("dashboard.creator.edit") || "Edit"}
                        </button>
                        <button
                          className="cd-btn ghost"
                          onClick={() => {
                            showConfirm(
                              `${t("common.delete") || "Delete"} "${
                                m.title
                              }"? This action cannot be undone.`,
                              () => {
                                try {
                                  const localManuals = JSON.parse(
                                    localStorage.getItem("customManuals") ||
                                      "[]"
                                  );
                                  const newLocalManuals = localManuals.filter(
                                    (manual) => manual.id !== m.id
                                  );
                                  localStorage.setItem(
                                    "customManuals",
                                    JSON.stringify(newLocalManuals)
                                  );

                                  setUserManuals((prev) =>
                                    prev.filter((manual) => manual.id !== m.id)
                                  );

                                  window.dispatchEvent(
                                    new Event("manualUpdated")
                                  );

                                  showAlert(
                                    "Pending manual deleted successfully",
                                    "success"
                                  );
                                } catch (err) {
                                  console.error(err);
                                  showAlert("Failed to delete manual", "error");
                                }
                              },
                              "danger",
                              "Confirm Deletion",
                              "Delete",
                              "Cancel"
                            );
                          }}
                          title={t("common.delete") || "Delete"}
                          style={{ color: "#ef4444" }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}{" "}
            <div className="cd-divider" />
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">
                {t("dashboard.creator.recentActivity") || "Recent activity"}
              </h2>
            </div>
            <ul className="cd-activityList">
              {userManuals.length > 0 ? (
                <>
                  {userManuals.slice(0, 3).map((manual, idx) => (
                    <li key={idx}>
                      <span className="cd-dot" />
                      {manual.status === "published"
                        ? `Manual "${manual.title}" is published and live`
                        : manual.status === "pending"
                        ? `Manual "${manual.title}" is pending approval`
                        : `Draft "${manual.title}" was last updated ${
                            manual.updatedAt || manual.createdAt
                          }`}
                    </li>
                  ))}
                </>
              ) : (
                <li>
                  <span className="cd-dot" />
                  {t("dashboard.creator.noActivity") ||
                    "No recent activity. Create your first manual to get started!"}
                </li>
              )}{" "}
            </ul>
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

export default CreatorDashboard;
