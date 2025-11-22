import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Settings.css";
import { useTranslation } from "../utils/translations";
import { useLanguage } from "../contexts/LanguageContext";
import { updateUserProfile } from "../data/UserData";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    manualUpdates: true,
    commentsNotification: true,
    productUpdates: false,
  });
  const { t, language } = useTranslation();
  const { changeLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserSettings = () => {
      try {
        const userData = localStorage.getItem("userData");
        const authToken = localStorage.getItem("authToken");

        if (!userData || !authToken) {
          navigate("/login");
          return;
        }

        const currentUser = JSON.parse(userData);
        setUser(currentUser);

        // Load user preferences
        if (currentUser.preferences) {
          setPreferences({
            notifications: currentUser.preferences.notifications ?? true,
            darkMode: currentUser.preferences.darkMode ?? false,
            emailUpdates: currentUser.preferences.emailUpdates ?? true,
            manualUpdates: true,
            commentsNotification: true,
            productUpdates: false,
          });
        }
      } catch (error) {
        console.error("Error loading user settings:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();

    // Listen for auth state changes
    window.addEventListener("authStateChanged", loadUserSettings);
    return () =>
      window.removeEventListener("authStateChanged", loadUserSettings);
  }, [navigate]);
  const handleSaveSettings = () => {
    if (!user) return;

    try {
      const updatedPreferences = {
        ...user.preferences,
        ...preferences,
      };

      // Update user using the utility function
      const updatedUser = updateUserProfile(user.id, {
        preferences: updatedPreferences,
      });

      if (updatedUser) {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Apply dark mode immediately if changed
        document.body.classList.toggle("dark", preferences.darkMode);
        localStorage.setItem("darkMode", preferences.darkMode.toString());

        alert("Settings saved successfully! ✨");

        // Dispatch event to update other components
        window.dispatchEvent(new Event("authStateChanged"));
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    }
  };

  const handleDeactivateAccount = () => {
    const confirmed = confirm(
      "Are you sure you want to deactivate your account? This action cannot be undone."
    );
    if (confirmed) {
      // Clear authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      // Dispatch auth change event
      window.dispatchEvent(new Event("authStateChanged"));

      // Redirect to login
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("authStateChanged"));
    navigate("/feed");
  };

  if (isLoading) {
    return (
      <main className="settings-page">
        <div className="settings-inner">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            {t("common.loading")}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="settings-page">
        <div className="settings-inner">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            User not found
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <div className="settings-inner">
        {" "}
        <header className="settings-header">
          <div>
            <h1 className="settings-title">{t("settings.title")}</h1>
            <p className="settings-sub">
              Manage notifications, display preferences, and account information
              for QuickHelp
            </p>
          </div>
          <div className="settings-badge">
            <span className="settings-dot" />
            <span>Signed in as {user.username}</span>
          </div>
        </header>
        <div className="settings-grid">
          {" "}
          {/* Account */}
          <section className="settings-card">
            <h2 className="settings-card-title">Account</h2>
            <p className="settings-card-sub">
              Main account information used to sign in to QuickHelp
            </p>

            <div className="settings-row">
              <div className="settings-row-label">Email</div>
              <div className="settings-row-main">
                <div className="settings-row-text">{user.email}</div>
                <button className="settings-btn ghost" disabled>
                  Change email
                </button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">Username</div>
              <div className="settings-row-main">
                <div className="settings-row-text">{user.username}</div>
                <button className="settings-btn ghost" disabled>
                  Change username
                </button>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-label">Role</div>
              <div className="settings-row-main">
                <div className="settings-row-text">
                  {user.role === "admin"
                    ? "Administrator"
                    : user.role === "creator"
                    ? "Creator"
                    : "User"}
                </div>
                <button className="settings-btn ghost" onClick={handleLogout}>
                  {t("nav.logout")}
                </button>
              </div>
            </div>
          </section>
          {/* Language */}
          <section className="settings-card">
            <h2 className="settings-card-title">{t("settings.language")}</h2>
            <p className="settings-card-sub">
              Choose your preferred language for the interface
            </p>

            <div className="settings-row">
              <div className="settings-row-label">Interface Language</div>
              <div className="settings-row-main settings-options">
                <label className="settings-pillOption">
                  <input
                    type="radio"
                    name="language"
                    checked={language === "en"}
                    onChange={() => changeLanguage("en")}
                  />
                  <span>English</span>
                </label>
                <label className="settings-pillOption">
                  <input
                    type="radio"
                    name="language"
                    checked={language === "th"}
                    onChange={() => changeLanguage("th")}
                  />
                  <span>ไทย (Thai)</span>
                </label>
              </div>
            </div>
          </section>{" "}
          {/* Appearance */}
          <section className="settings-card">
            <h2 className="settings-card-title">Appearance</h2>
            <p className="settings-card-sub">
              Choose theme and content density that suits your usage
            </p>

            <div className="settings-row">
              <div className="settings-row-label">{t("settings.theme")}</div>
              <div className="settings-row-main settings-options">
                <label className="settings-pillOption">
                  <input
                    type="radio"
                    name="theme"
                    checked={!preferences.darkMode}
                    onChange={() =>
                      setPreferences({ ...preferences, darkMode: false })
                    }
                  />
                  <span>{t("settings.light")}</span>
                </label>
                <label className="settings-pillOption">
                  <input
                    type="radio"
                    name="theme"
                    checked={preferences.darkMode}
                    onChange={() =>
                      setPreferences({ ...preferences, darkMode: true })
                    }
                  />
                  <span>{t("settings.dark")}</span>
                </label>
              </div>
            </div>
          </section>
          {/* Notifications */}
          <section className="settings-card">
            <h2 className="settings-card-title">
              {t("settings.notifications")}
            </h2>
            <p className="settings-card-sub">
              Control what notifications you receive from QuickHelp
            </p>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  Manual updated (favorite)
                </div>
                <div className="settings-toggle-sub">
                  Get notified when manuals you bookmarked have new versions
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.manualUpdates}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    manualUpdates: e.target.checked,
                  })
                }
              />
            </label>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  Comments on my manuals
                </div>
                <div className="settings-toggle-sub">
                  Get notified when someone comments on manuals you created
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.commentsNotification}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    commentsNotification: e.target.checked,
                  })
                }
              />
            </label>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  {t("settings.emailNotifications")}
                </div>
                <div className="settings-toggle-sub">
                  Receive email updates about new features and usage tips
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailUpdates}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    emailUpdates: e.target.checked,
                  })
                }
              />
            </label>

            <label className="settings-toggleRow">
              <div>
                <div className="settings-toggle-title">
                  Product updates & tips
                </div>
                <div className="settings-toggle-sub">
                  Email updates about new features and usage techniques
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.productUpdates}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    productUpdates: e.target.checked,
                  })
                }
              />
            </label>
          </section>{" "}
          {/* Danger zone */}
          <section className="settings-card danger">
            <h2 className="settings-card-title">Danger zone</h2>
            <p className="settings-card-sub">
              These actions may affect your data access. Please use with
              caution.
            </p>

            <div className="settings-row">
              <div>
                <div className="settings-toggle-title">Delete Account</div>
                <div className="settings-toggle-sub">
                  ลบบัญชีถาวร คุณจะไม่สามารถเข้าสู่ระบบ
                  QuickHelp ได้
                </div>
              </div>
              <button className="settings-btn danger">Delete Account</button>
            </div>
          </section>
        </div>
        <footer className="settings-footer">
          <button className="settings-btn primary" onClick={handleSaveSettings}>
            {t("common.save")} changes
          </button>
          <button
            className="settings-btn ghost"
            onClick={() => window.location.reload()}
          >
            {t("common.cancel")}
          </button>
        </footer>
      </div>
    </main>
  );
};

export default Settings;
