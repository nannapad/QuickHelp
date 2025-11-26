import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import "./css/Profile.css";
import { useTranslation } from "../utils/translations";
import { getUserById, updateUserProfile } from "../data/UserData";
import ProfileAvatar from "../components/ProfileAvatar";
import { getSafeImageUrl } from "../utils/cleanupBlobUrls";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modalState, showAlert, hideAlert } = useAlertModal();

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
        const baseUser = updatedUser || currentUser;

        setUser(baseUser);
        setEditData({
          firstName: baseUser.firstName,
          lastName: baseUser.lastName,
          department: baseUser.department || "",
          position: baseUser.position || "",
          bio: baseUser.bio || "",
          phone: baseUser.phone || "",
          location: baseUser.location || "",
        });
        // Filter out blob URLs using getSafeImageUrl
        const safeProfilePicture = getSafeImageUrl(baseUser.profilePicture);
        setProfilePictureUrl(safeProfilePicture);
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
      // Include profile picture URL in the update
      const updateDataWithPicture = {
        ...editData,
        profilePicture: profilePictureUrl,
      };

      // Update user data using the utility function
      const updatedUser = updateUserProfile(user.id, updateDataWithPicture);

      if (updatedUser) {
        // Update localStorage for current session
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);

        // Dispatch event to update navbar
        window.dispatchEvent(new Event("authStateChanged"));

        showAlert("Profile updated successfully!", "success");
      } else {
        showAlert("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      showAlert("Error saving profile", "error");
    }
  };
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);

      // Convert to data URI for persistence instead of blob URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePictureUrl(null);
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

  // Mock system-level stats for admin view (frontend only)
  const systemStats =
    user.role === "admin"
      ? user.systemStats || {
          totalManuals: 128,
          totalUsers: 56,
          pendingApprovals: 3,
          openReports: 0,
        }
      : null;

  // Mock recent activity for admin
  const recentActions =
    user.role === "admin"
      ? user.recentActions || [
          {
            id: 1,
            label: "Approved new onboarding manual for Marketing",
            time: "2 hours ago",
          },
          {
            id: 2,
            label: 'Reviewed draft: "Social media campaign checklist"',
            time: "Yesterday",
          },
          {
            id: 3,
            label: "Updated roles for 2 users",
            time: "This week",
          },
        ]
      : [];

  return (
    <main className="profile-page">
      <div className="profile-inner">
        {" "}
        <header className="profile-header">
          <div className="profile-user">
            <div className="profile-avatar-container">
              <ProfileAvatar
                user={user}
                size="xlarge"
                className="bordered-white"
              />
              {isEditing && (
                <div className="profile-avatar-edit">
                  <label className="profile-avatar-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: "none" }}
                    />
                    📷
                  </label>
                  {profilePictureUrl && (
                    <button
                      className="profile-avatar-remove"
                      onClick={removeProfilePicture}
                      type="button"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
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
                    ? "Content Creator"
                    : "Member"}
                </span>
                {user.position && (
                  <>
                    <span className="profile-dot">•</span>
                    <span>{user.position}</span>
                  </>
                )}
                <span className="profile-dot">•</span>
                <span>
                  {t("profile.memberSince")} {formatDate(user.createdAt)}
                </span>
              </div>
              {user.bio && !isEditing && (
                <div className="profile-bio">{user.bio}</div>
              )}
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
          {/* Left: Personal / Work / Account / Security */}
          <section className="profile-card">
            <h2 className="profile-card-title">{t("profile.personalInfo")}</h2>
            <p className="profile-card-sub">
              Update your personal information and contact details
            </p>

            <div className="profile-field">
              <label>{t("profile.firstName")} *</label>
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
              <label>{t("profile.lastName")} *</label>
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

            {/* Bio + Location: แสดงเฉพาะ non-admin เพื่อลดความรกของหน้า Admin */}
            {user.role !== "admin" && (
              <>
                <div className="profile-field">
                  <label>Bio / About Me</label>
                  <textarea
                    value={editData.bio || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, bio: e.target.value })
                    }
                    placeholder="Tell others about yourself..."
                    disabled={!isEditing}
                    rows={3}
                  />
                  <div className="profile-hint">
                    A brief description that appears on your profile
                  </div>
                </div>

                <div className="profile-field">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editData.location || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, location: e.target.value })
                    }
                    placeholder="City, Country"
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                disabled={!isEditing}
              />
            </div>

            <div className="profile-divider" />

            <h3 className="profile-section-title">Work Information</h3>

            <div className="profile-field">
              <label>{t("profile.position")}</label>
              <input
                type="text"
                value={editData.position || ""}
                onChange={(e) =>
                  setEditData({ ...editData, position: e.target.value })
                }
                placeholder="System Administrator, Manager, etc."
                disabled={!isEditing}
              />
            </div>

            {user.role !== "admin" && (
              <div className="profile-field">
                <label>{t("profile.department")}</label>
                <input
                  type="text"
                  value={editData.department || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, department: e.target.value })
                  }
                  placeholder="Engineering, Design, Marketing, HR, etc."
                  disabled={!isEditing}
                />
              </div>
            )}

            <div className="profile-divider" />

            <h3 className="profile-section-title">Account Information</h3>

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

            <div className="profile-field">
              <label>Account Created</label>
              <input
                type="text"
                value={formatDate(user.createdAt)}
                disabled
                style={{ backgroundColor: "var(--bg-light)", opacity: 0.7 }}
              />
            </div>

            {/* Security section (mock only) */}
            <div className="profile-divider" />
            <h3 className="profile-section-title">Security</h3>

            <div className="profile-security-row">
              <div className="profile-security-text">
                Change your password to keep your account secure.
              </div>{" "}
              <button
                type="button"
                className="profile-btn ghost"
                onClick={() =>
                  showAlert(
                    "This is a demo view. Password changes are not implemented.",
                    "info"
                  )
                }
              >
                Change password
              </button>
            </div>

            <div className="profile-security-row">
              <div className="profile-security-text">
                Two-factor authentication (2FA) adds an extra layer of security.
              </div>
              <button
                type="button"
                className={`profile-toggle ${isTwoFactorEnabled ? "on" : ""}`}
                onClick={() => {
                  const next = !isTwoFactorEnabled;
                  setIsTwoFactorEnabled(next);
                  showAlert(
                    `Two-factor authentication is now ${
                      next ? "enabled" : "disabled"
                    } (demo only).`,
                    "success"
                  );
                }}
              >
                {isTwoFactorEnabled ? "2FA enabled" : "Enable 2FA"}
              </button>
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
                      department: user.department || "",
                      position: user.position || "",
                      bio: user.bio || "",
                      phone: user.phone || "",
                      location: user.location || "",
                    });
                    setProfilePictureUrl(getSafeImageUrl(user.profilePicture));
                    setProfilePicture(null);
                  }}
                >
                  {t("common.cancel")}
                </button>
              </div>
            )}
          </section>

          {/* Right: Stats / System Overview / Activity / Roles */}
          <section className="profile-card">
            <h2 className="profile-card-title">{t("profile.accountStats")}</h2>
            <p className="profile-card-sub">
              Your activity and contributions to QuickHelp
            </p>
            {/* Usage Statistics */}
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
            </div>
            {/* Creator/Admin Statistics */}
            {(user.role === "creator" || user.role === "admin") && (
              <>
                <div className="profile-divider" />
                <h3 className="profile-section-title">Content Creation</h3>

                <div className="profile-statRow">
                  <div>
                    <div className="profile-stat-label">Manuals Created</div>
                    <div className="profile-stat-value">
                      {user.stats?.manualsCreated || 0}
                    </div>
                  </div>
                  <div>
                    <div className="profile-stat-label">
                      Total Likes Received
                    </div>
                    <div className="profile-stat-value">
                      {user.stats?.likesReceived || 0}
                    </div>
                  </div>
                </div>

                <div className="profile-statRow">
                  <div>
                    <div className="profile-stat-label">Total Manual Views</div>
                    <div className="profile-stat-value">
                      {user.stats?.totalManualViews || 0}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="profile-divider" />
            <div className="profile-tagsTitle">Roles &amp; Permissions</div>
            <div className="profile-tagsRow">
              <span className={`profile-tagChip role-${user.role}`}>
                {user.role === "admin"
                  ? "Administrator"
                  : user.role === "creator"
                  ? "Content Creator"
                  : "Member"}
              </span>
              {user.role !== "admin" && user.department && (
                <span className="profile-tagChip">{user.department}</span>
              )}
              {user.position && (
                <span className="profile-tagChip">{user.position}</span>
              )}
              {user.role !== "admin" && user.location && (
                <span className="profile-tagChip">📍 {user.location}</span>
              )}
            </div>{" "}
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
      />
    </main>
  );
};

export default Profile;
