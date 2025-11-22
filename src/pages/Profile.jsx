import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Profile.css";
import { useTranslation } from "../utils/translations";
import { getUserById, updateUserProfile } from "../data/UserData";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const userData = localStorage.getItem("userData");
        const authToken = localStorage.getItem("authToken");

        if (!userData || !authToken) {
          // User not authenticated, redirect to login
          navigate("/login");
          return;
        }

        const currentUser = JSON.parse(userData);
        // Refresh user data from storage to get latest stats
        const updatedUser = getUserById(currentUser.id);

        if (updatedUser) {
          setUser(updatedUser);
          setEditData({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            department: updatedUser.department,
            position: updatedUser.position,
          });
        } else {
          setUser(currentUser);
          setEditData({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            department: currentUser.department || "",
            position: currentUser.position || "",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();

    // Listen for auth state changes
    window.addEventListener("authStateChanged", loadUserProfile);
    return () =>
      window.removeEventListener("authStateChanged", loadUserProfile);
  }, [navigate]);
  const handleSaveProfile = () => {
    try {
      // Update user data using the utility function
      const updatedUser = updateUserProfile(user.id, editData);

      if (updatedUser) {
        // Update localStorage for current session
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);

        // Dispatch event to update navbar
        window.dispatchEvent(new Event("authStateChanged"));

        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile");
    }
  };

  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-inner">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            {t("common.loading")}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-inner">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            User not found
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-inner">
        {" "}
        <header className="profile-header">
          <div className="profile-user">
            <div className="profile-avatar">
              {getInitials(user.firstName, user.lastName, user.username)}
            </div>
            <div>
              <h1 className="profile-name">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </h1>
              <div className="profile-meta">
                <span>
                  {user.role === "admin"
                    ? "Administrator"
                    : user.role === "creator"
                    ? "Creator"
                    : "User"}
                </span>
                <span className="profile-dot">•</span>
                <span>
                  {t("profile.memberSince")} {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <button
            className="profile-btn ghost"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? t("common.cancel") : t("profile.editProfile")}
          </button>
        </header>
        <div className="profile-grid">
          {" "}
          {/* Left: editable info */}
          <section className="profile-card">
            <h2 className="profile-card-title">{t("profile.personalInfo")}</h2>
            <p className="profile-card-sub">
              {t("profile.personalInfo")} details used for display in manuals
              and comments
            </p>

            <div className="profile-field">
              <label>{t("profile.firstName")}</label>
              <input
                type="text"
                value={editData.firstName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
                placeholder="Your first name"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label>{t("profile.lastName")}</label>
              <input
                type="text"
                value={editData.lastName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
                placeholder="Your last name"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label>{t("profile.position")}</label>
              <input
                type="text"
                value={editData.position || ""}
                onChange={(e) =>
                  setEditData({ ...editData, position: e.target.value })
                }
                placeholder="Product Designer"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label>{t("profile.department")}</label>
              <input
                type="text"
                value={editData.department || ""}
                onChange={(e) =>
                  setEditData({ ...editData, department: e.target.value })
                }
                placeholder="Design / IT / HR / Marketing"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label>{t("profile.username")}</label>
              <input
                type="text"
                value={user.username}
                placeholder="Username (read-only)"
                disabled
                style={{ backgroundColor: "var(--bg-light)", opacity: 0.7 }}
              />
            </div>

            <div className="profile-field">
              <label>{t("profile.email")}</label>
              <input
                type="email"
                value={user.email}
                placeholder="Email (read-only)"
                disabled
                style={{ backgroundColor: "var(--bg-light)", opacity: 0.7 }}
              />
            </div>

            {isEditing && (
              <div className="profile-actions">
                <button
                  className="profile-btn primary"
                  onClick={handleSaveProfile}
                >
                  {t("profile.saveChanges")}
                </button>
                <button
                  className="profile-btn ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      department: user.department,
                      position: user.position,
                    });
                  }}
                >
                  {t("common.cancel")}
                </button>
              </div>
            )}
          </section>{" "}
          {/* Right: summary / readonly */}
          <section className="profile-card">
            <h2 className="profile-card-title">{t("profile.accountStats")}</h2>
            <p className="profile-card-sub">
              Overview of your QuickHelp usage statistics
            </p>

            <div className="profile-statRow">
              <div>
                <div className="profile-stat-label">
                  {t("profile.manualsViewed")}
                </div>
                <div className="profile-stat-value">
                  {user.stats?.manualsViewed || 0}
                </div>
              </div>
              <div>
                <div className="profile-stat-label">
                  {t("profile.manualsDownloaded")}
                </div>
                <div className="profile-stat-value">
                  {user.stats?.manualsDownloaded || 0}
                </div>
              </div>
            </div>

            <div className="profile-statRow">
              <div>
                <div className="profile-stat-label">
                  {t("profile.manualsBookmarked")}
                </div>
                <div className="profile-stat-value">
                  {user.stats?.manualsBookmarked || 0}
                </div>
              </div>
              <div>
                <div className="profile-stat-label">
                  {t("profile.loginCount")}
                </div>
                <div className="profile-stat-value">
                  {user.stats?.loginCount || 0}
                </div>
              </div>
            </div>

            {(user.role === "creator" || user.role === "admin") && (
              <div className="profile-statRow">
                <div>
                  <div className="profile-stat-label">Manuals Created</div>
                  <div className="profile-stat-value">
                    {user.stats?.manualsCreated || 0}
                  </div>
                </div>
                <div>
                  <div className="profile-stat-label">Manuals Edited</div>
                  <div className="profile-stat-value">
                    {user.stats?.manualsEdited || 0}
                  </div>
                </div>
              </div>
            )}

            <div className="profile-divider" />

            <div className="profile-statRow">
              <div>
                <div className="profile-stat-label">
                  {t("profile.lastLogin")}
                </div>
                <div className="profile-stat-value">
                  {formatDate(user.lastLogin)}
                </div>
              </div>
            </div>

            <div className="profile-tagsTitle">Account Details</div>
            <div className="profile-tagsRow">
              <span className="profile-tagChip">Role: {user.role}</span>
              {user.department && (
                <span className="profile-tagChip">{user.department}</span>
              )}
              {user.position && (
                <span className="profile-tagChip">{user.position}</span>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
