import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#111827" }}>
        Profile
      </h1>

      <div
        style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#667eea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "2rem",
              marginRight: "1rem",
            }}
          >
            👤
          </div>
          <div>
            <h2 style={{ margin: "0 0 0.5rem 0", color: "#111827" }}>
              {user.username}
            </h2>
            <p style={{ margin: "0", color: "#6b7280" }}>{user.email}</p>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#374151",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={user.username}
              readOnly
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                background: "#f9fafb",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#374151",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                background: "#f9fafb",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#374151",
              }}
            >
              User ID
            </label>
            <input
              type="text"
              value={user.id}
              readOnly
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                background: "#f9fafb",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f0f9ff",
            borderRadius: "0.375rem",
            border: "1px solid #0ea5e9",
          }}
        >
          <p style={{ margin: "0", color: "#0369a1", fontSize: "0.875rem" }}>
            ℹ️ Profile editing functionality would be implemented here in a real
            application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
