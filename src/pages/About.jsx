import React from "react";
import ManualGrid from "../components/ManualGrid";
import manuals from "../data/ManualData";
import { useTranslation } from "../utils/translations";

const About = () => {
  // Show only the first 3 manuals as featured content
  const featuredManuals = manuals.slice(0, 3);
  const { t } = useTranslation();

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {" "}
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#111827" }}
        >
          {t("about.title")}
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
          {t("about.subtitle")}
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
            {" "}
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              {t("about.features.search.title")}
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.5" }}>
              {t("about.features.search.desc")}
            </p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            {" "}
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              {t("about.features.organized.title")}
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.5" }}>
              {t("about.features.organized.desc")}
            </p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            {" "}
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "#111827",
              }}
            >
              {t("about.features.updated.title")}
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.5" }}>
              {t("about.features.updated.desc")}
            </p>
          </div>
        </div>
      </section>
      <section>
        {" "}
        <h2
          style={{
            fontSize: "1.875rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#111827",
          }}
        >
          {t("about.featuredTitle")}
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#6b7280",
          }}
        >
          {t("about.featuredDesc")}
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
