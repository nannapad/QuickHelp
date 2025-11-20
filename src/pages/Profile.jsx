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
      
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* User Info Card */}
        <div style={{ 
          background: "#ffffff", 
          padding: "2rem", 
          borderRadius: "8px", 
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              background: user.role === 'admin' ? "#dc2626" : "#667eea", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white", 
              fontSize: "2rem",
              marginRight: "1rem"
            }}>
              {user.role === 'admin' ? '👑' : '👤'}
            </div>
            <div>
              <h2 style={{ margin: "0 0 0.5rem 0", color: "#111827" }}>
                {user.firstName || user.username} {user.lastName || ''}
              </h2>
              <p style={{ margin: "0", color: "#6b7280" }}>
                {user.position || 'User'} • {user.department || 'General'}
              </p>
              <span style={{ 
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase",
                background: user.role === 'admin' ? "#fef2f2" : "#f0f9ff",
                color: user.role === 'admin' ? "#dc2626" : "#0369a1",
                marginTop: "0.5rem"
              }}>
                {user.role || 'user'}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
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
                  background: "#f9fafb"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
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
                  background: "#f9fafb"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
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
                  background: "#f9fafb"
                }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Member Since
              </label>
              <input 
                type="text" 
                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} 
                readOnly
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  background: "#f9fafb"
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats Card */}
        {user.stats && (
          <div style={{ 
            background: "#ffffff", 
            padding: "2rem", 
            borderRadius: "8px", 
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.25rem" }}>
              Activity Statistics
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div style={{ textAlign: "center", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea" }}>
                  {user.stats.manualsViewed || 0}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Manuals Viewed</div>
              </div>
              
              <div style={{ textAlign: "center", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
                  {user.stats.manualsDownloaded || 0}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Downloads</div>
              </div>
              
              <div style={{ textAlign: "center", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b" }}>
                  {user.stats.manualsBookmarked || 0}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Bookmarked</div>
              </div>
              
              <div style={{ textAlign: "center", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6" }}>
                  {user.stats.loginCount || 0}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Logins</div>
              </div>
              
              {/* Admin-specific stats */}
              {user.role === 'admin' && user.stats.manualsCreated && (
                <>
                  <div style={{ textAlign: "center", padding: "1rem", background: "#fef2f2", borderRadius: "0.5rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>
                      {user.stats.manualsCreated}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Manuals Created</div>
                  </div>
                  
                  <div style={{ textAlign: "center", padding: "1rem", background: "#fef2f2", borderRadius: "0.5rem" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>
                      {user.stats.usersManaged || 0}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Users Managed</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0f9ff", borderRadius: "0.375rem", border: "1px solid #0ea5e9" }}>
          <p style={{ margin: "0", color: "#0369a1", fontSize: "0.875rem" }}>
            ℹ️ Profile editing functionality would be implemented here in a real application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
