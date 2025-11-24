import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Creatordashboard.css";
import manuals from "../data/ManualData";
import { useTranslation } from "../utils/translations";

const CreatorDashboard = () => {
  const [user, setUser] = useState(null);
  const [userManuals, setUserManuals] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

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

    setUser(currentUser);

    // Filter manuals created by this user (mock logic - in real app would be based on author ID)
    const creatorManuals = manuals.filter(
      (manual) =>
        manual.author === currentUser.firstName + " " + currentUser.lastName ||
        manual.author === currentUser.username ||
        // For demo purposes, show some manuals for any creator
        [
          "VS Code setup for new developers",
          "Brand asset usage guideline",
          "Security guidelines for developers",
        ].includes(manual.title)
    );

    // Add status property for dashboard display
    const manualsWithStatus = creatorManuals.map((manual, index) => ({
      ...manual,
      status: index === 1 ? "draft" : "published", // Make second manual a draft for demo
      views: manual.views || Math.floor(Math.random() * 500),
    }));

    setUserManuals(manualsWithStatus);
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
        </header>
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
                {published.length}{" "}
                {t("dashboard.creator.published") || "published"}
              </span>
            </div>{" "}
            <div className="cd-table">
              <div className="cd-tableHead">
                <span>{t("dashboard.creator.title") || "Title"}</span>
                <span>{t("dashboard.creator.category") || "Category"}</span>
                <span>
                  {t("dashboard.creator.lastUpdated") || "Last updated"}
                </span>
                <span>{t("dashboard.creator.views") || "Views"}</span>
                <span>{t("dashboard.creator.actions") || "Actions"}</span>
              </div>

              {published.map((m) => (
                <div key={m.id} className="cd-tableRow cd-tableRowActions">
                  <span className="cd-tableTitle">{m.title}</span>
                  <span className="cd-tableCategory">{m.category}</span>
                  <span className="cd-tableDate">
                    {m.updatedAt || m.createdAt}
                  </span>
                  <span className="cd-tableViews">{m.views}</span>
                  <span className="cd-tableActions">
                    <button
                      className="cd-btn ghost small"
                      onClick={() => navigate(`/manual/${m.id}`)}
                      title="View manual"
                    >
                      👁️
                    </button>
                    <button
                      className="cd-btn ghost small"
                      onClick={() => navigate(`/edit-manual/${m.id}`)}
                      title="Edit manual"
                    >
                      ✏️
                    </button>
                    <button
                      className="cd-btn ghost small"
                      onClick={() => {
                        if (window.confirm(`Delete manual "${m.title}"?`)) {
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
                            alert("Manual deleted successfully");
                          } catch (err) {
                            console.error(err);
                            alert("Failed to delete manual");
                          }
                        }
                      }}
                      title="Delete manual"
                      style={{ color: "#ef4444" }}
                    >
                      🗑️
                    </button>
                  </span>
                </div>
              ))}

              {published.length === 0 && (
                <div className="cd-empty">
                  {t("dashboard.creator.noManuals") ||
                    "No published manuals yet. Try creating your first manual!"}
                </div>
              )}
            </div>{" "}
          </section>
          {/* Drafts & Activity */}
          <section className="cd-card">
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">
                {t("dashboard.creator.drafts") || "Drafts"}
              </h2>
              <span className="cd-cardMeta">
                {drafts.length} {t("dashboard.creator.draft") || "draft"}
              </span>
            </div>
            <div className="cd-draftList">
              {drafts.map((m) => (
                <div key={m.id} className="cd-draftItem">
                  <div>
                    <div className="cd-draftTitle">{m.title}</div>
                    <div className="cd-draftMeta">
                      {m.category} •{" "}
                      {t("dashboard.creator.lastEdited") || "last edited"}{" "}
                      {m.updatedAt || m.createdAt}
                    </div>
                  </div>{" "}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="cd-btn ghost"
                      onClick={() => navigate(`/edit-manual/${m.id}`)}
                    >
                      {t("dashboard.creator.continue") || "Continue"}
                    </button>
                    <button
                      className="cd-btn ghost"
                      onClick={() => {
                        if (
                          window.confirm(
                            `${t("common.delete") || "Delete"} "${m.title}"?`
                          )
                        ) {
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
                          } catch (err) {
                            console.error(err);
                          }
                        }
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
                  {t("dashboard.creator.noDrafts") ||
                    "No drafts found. When you save as draft, it will appear here."}
                </div>
              )}
            </div>
            <div className="cd-divider" />
            <div className="cd-cardHeader">
              <h2 className="cd-cardTitle">
                {t("dashboard.creator.recentActivity") || "Recent activity"}
              </h2>
            </div>
            <ul className="cd-activityList">
              <li>
                <span className="cd-dot" />
                {t("dashboard.creator.newComment") || "New comment on"}{" "}
                <strong>VS Code setup for new developers</strong>
              </li>
              <li>
                <span className="cd-dot" />
                {t("dashboard.creator.updatedVersion") ||
                  "You updated version"}{" "}
                <strong>Onboarding checklist – Developer</strong>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CreatorDashboard;
