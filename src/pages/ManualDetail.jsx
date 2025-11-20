import React from "react";
import { useParams, Link } from "react-router-dom";
import manuals from "../data/ManualData";

const ManualDetail = () => {
  const { id } = useParams();
  const manual = manuals.find((m) => m.id === parseInt(id));

  if (!manual) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Manual not found</h2>
        <p>The manual you're looking for doesn't exist.</p>
        <Link to="/feed">← Back to Feed</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <Link
        to="/feed"
        style={{
          color: "#667eea",
          textDecoration: "none",
          marginBottom: "1rem",
          display: "inline-block",
        }}
      >
        ← Back to Feed
      </Link>

      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#111827" }}
        >
          {manual.title}
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>{manual.meta}</p>
        <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
          {manual.description}
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#f8fafc",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#111827" }}>
            Manual Content
          </h3>
          <p style={{ color: "#6b7280" }}>
            This is where the actual manual content would be displayed. The
            content could be markdown, HTML, or any other format depending on
            your implementation.
          </p>
        </div>

        <aside
          style={{
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            height: "fit-content",
          }}
        >
          <h4 style={{ marginBottom: "1rem", color: "#111827" }}>
            Manual Info
          </h4>

          <div style={{ marginBottom: "1rem" }}>
            <strong>Author:</strong> {manual.author}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong>Difficulty:</strong> {manual.difficulty}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong>Estimated Time:</strong> {manual.estimatedTime}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong>Views:</strong> {manual.views}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <strong>Likes:</strong> {manual.likes}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <strong>Downloads:</strong> {manual.downloads}
          </div>

          {manual.tags && manual.tags.length > 0 && (
            <div>
              <strong style={{ display: "block", marginBottom: "0.5rem" }}>
                Tags:
              </strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {manual.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "0.25rem 0.5rem",
                      background: "#f3f4f6",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      color: "#6b7280",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          style={{
            padding: "0.75rem 2rem",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ♡ Like ({manual.likes})
        </button>

        <button
          style={{
            padding: "0.75rem 2rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ⤓ Download ({manual.downloads})
        </button>

        <button
          style={{
            padding: "0.75rem 2rem",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          🔖 Bookmark
        </button>
      </div>
    </div>
  );
};

export default ManualDetail;
