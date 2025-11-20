import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    autoSave: true,
  });

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
    // In a real app, you'd save this to the backend
    console.log(`${setting} changed to:`, value);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#111827" }}>
        Settings
      </h1>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* Notifications Section */}
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#111827",
              fontSize: "1.125rem",
            }}
          >
            Notifications
          </h3>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                  Push Notifications
                </p>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  Receive notifications for new manuals and updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleSettingChange("notifications", e.target.checked)
                }
                style={{ width: "20px", height: "20px" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                  Email Updates
                </p>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  Get weekly digest of new manuals via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={(e) =>
                  handleSettingChange("emailUpdates", e.target.checked)
                }
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#111827",
              fontSize: "1.125rem",
            }}
          >
            Appearance
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                Dark Mode
              </p>
              <p
                style={{ margin: "0", fontSize: "0.875rem", color: "#6b7280" }}
              >
                Switch to dark theme
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) =>
                handleSettingChange("darkMode", e.target.checked)
              }
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#111827",
              fontSize: "1.125rem",
            }}
          >
            Preferences
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: "0", fontWeight: "500", color: "#374151" }}>
                Auto-save
              </p>
              <p
                style={{ margin: "0", fontSize: "0.875rem", color: "#6b7280" }}
              >
                Automatically save your progress
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) =>
                handleSettingChange("autoSave", e.target.checked)
              }
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        </div>

        {/* Account Actions */}
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#111827",
              fontSize: "1.125rem",
            }}
          >
            Account Actions
          </h3>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Save Changes
            </button>

            <button
              style={{
                padding: "0.75rem 1.5rem",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
