import React from "react";
import ManualGrid from "../components/ManualGrid";
import manuals from "../data/ManualData";

const About = () => {
  // Show only the first 3 manuals as featured content
  const featuredManuals = manuals.slice(0, 3);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#111827" }}
        >
          About QuickHelp
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#6b7280",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Your one-stop solution for accessing company manuals, guides, and
          documentation. Find what you need quickly and efficiently.
        </p>
      </header>

      <section style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              🔍 Smart Search
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.5" }}>
              Find manuals instantly with our intelligent search that looks
              through titles, categories, tags, and content.
            </p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              🤖 AI Assistant
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.5" }}>
              Get personalized recommendations and contextual help based on your
              search queries and browsing patterns.
            </p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              📚 Organized Content
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.5" }}>
              Browse by categories like IT, Design, Marketing, and HR.
              Everything is properly tagged and categorized.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2
          style={{
            fontSize: "1.875rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#111827",
          }}
        >
          Featured Manuals
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#6b7280",
          }}
        >
          Check out some of our most popular and helpful manuals
        </p>

        <ManualGrid
          manuals={featuredManuals}
          onTagClick={(tag) => console.log(`Clicked tag: ${tag}`)}
          onLike={(manual) => console.log(`Liked: ${manual.title}`)}
          onDownload={(manual) => console.log(`Downloaded: ${manual.title}`)}
          onBookmark={(manual) => console.log(`Bookmarked: ${manual.title}`)}
        />
      </section>
    </div>
  );
};

export default About;
