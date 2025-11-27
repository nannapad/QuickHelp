// src/pages/Feed.jsx
import React, { useEffect, useMemo, useState } from "react";
import ManualGrid from "../components/ManualGrid";
import manuals from "../data/ManualData";
import "./css/Feed.css";
import { useTranslation } from "../utils/translations";
import {
  toggleLike,
  incrementDownloads,
  toggleBookmark,
} from "../utils/manualInteractions";
import { aiSearchManuals } from "../utils/aiSearch";
import { logSearch } from "../utils/searchAnalytics";
import { Link } from "react-router-dom";

const Feed = () => {
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiResults, setAiResults] = useState([]);
  const [aiExplanations, setAiExplanations] = useState([]);
  const { t } = useTranslation();

  const hasFilters = useMemo(
    () => Boolean(search || activeTag || category !== "all"),
    [search, activeTag, category]
  );
  const filteredManuals = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    // Combine static manuals with published custom manuals from localStorage
    // FIX: Prevent duplicates - custom manuals override static ones
    const customManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );
    const publishedCustomManuals = customManuals.filter(
      (m) => m.status === "published"
    );

    // Build set of custom IDs to filter out static manuals with same ID
    const customIds = new Set(publishedCustomManuals.map((m) => m.id));
    const staticManuals = manuals.filter((m) => !customIds.has(m.id));

    // Custom manuals first, then non-duplicate static manuals
    const allManuals = [...publishedCustomManuals, ...staticManuals];

    return allManuals.filter((manual) => {
      const manualCategory = manual.category || "";
      const tags = manual.tags || [];
      const title = manual.title || "";

      // category
      if (category !== "all" && manualCategory !== category) return false;

      // tag
      if (
        activeTag &&
        !tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase())
      ) {
        return false;
      }

      // search text
      if (keyword) {
        const haystack = `${title} ${manualCategory} ${tags.join(
          " "
        )}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }

      return true;
    });
  }, [search, activeTag, category, refreshKey]);
  const resultText = useMemo(() => {
    if (!hasFilters) return t("feed.resultsText");

    const parts = [];
    if (search) parts.push(`search: "${search}"`);
    if (category !== "all") parts.push(`category: ${category}`);
    if (activeTag) parts.push(`tag: ${activeTag}`);

    return `${t("feed.searchResults")} ${
      filteredManuals.length
    } manual(s) • ${parts.join(" • ")}`;
  }, [hasFilters, search, category, activeTag, filteredManuals, t]);
  useEffect(() => {
    // Listen for localStorage changes to refresh manual data
    const handleStorageChange = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event when editing in the same tab
    window.addEventListener("manualUpdated", handleStorageChange);
    // Listen for interaction updates
    window.addEventListener("manualInteractionsUpdated", handleStorageChange);
    window.addEventListener("bookmarksUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("manualUpdated", handleStorageChange);
      window.removeEventListener(
        "manualInteractionsUpdated",
        handleStorageChange
      );
      window.removeEventListener("bookmarksUpdated", handleStorageChange);
    };
  }, []);

  const scrollToList = () => {
    const el = document.getElementById("manual-list");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setActiveTag("");

    // Build allManuals array for AI search
    const customManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );
    const publishedCustomManuals = customManuals.filter(
      (m) => m.status === "published"
    );
    const allManuals = [...publishedCustomManuals, ...manuals];

    // Run AI search
    if (searchInput.trim()) {
      const { results, explanations } = aiSearchManuals(
        searchInput,
        allManuals
      );
      setAiResults(results);
      setAiExplanations(explanations);
    } else {
      setAiResults([]);
      setAiExplanations([]);
    }

    scrollToList();
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setActiveTag("");
    setSearch("");
    setAiResults([]);
    setAiExplanations([]);
    scrollToList();
  };
  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setSearch("");
    setSearchInput("");
    setCategory("all");
    setAiResults([]);
    setAiExplanations([]);
    scrollToList();
  };
  const handleLike = (manual) => {
    // Get current user
    const userData = localStorage.getItem("userData");
    if (!userData) {
      console.log("Please log in to like manuals");
      return;
    }

    try {
      const user = JSON.parse(userData);
      const result = toggleLike(manual.id, user.id);
      console.log(
        `${result.isLiked ? "Liked" : "Unliked"} manual: ${manual.title}`
      );
    } catch (error) {
      console.error("Error liking manual:", error);
    }
  };

  const handleDownload = (manual) => {
    const newCount = incrementDownloads(manual.id);
    console.log(`Downloaded manual: ${manual.title} (Total: ${newCount})`);
    // You can add actual download logic here
  };

  const handleBookmark = (manual) => {
    // Get current user
    const userData = localStorage.getItem("userData");
    if (!userData) {
      console.log("Please log in to bookmark manuals");
      return;
    }

    try {
      const user = JSON.parse(userData);
      const isBookmarked = toggleBookmark(manual.id, user.id);
      console.log(
        `${isBookmarked ? "Bookmarked" : "Removed bookmark from"} manual: ${
          manual.title
        }`
      );
    } catch (error) {
      console.error("Error bookmarking manual:", error);
    }
  };

  useEffect(() => {
    // Component initialization
  }, []);

  // Log search analytics when search changes
  useEffect(() => {
    if (search && search.trim()) {
      // Get current user
      const userDataStr = localStorage.getItem("userData");
      let currentUser = null;

      try {
        if (userDataStr) {
          currentUser = JSON.parse(userDataStr);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }

      // Log the search with results count
      logSearch(search, filteredManuals.length, currentUser);
    }
  }, [search, filteredManuals.length]);

  useEffect(() => {
    // Component initialization
  }, []);

  return (
    <main className="feed-page">
      {/* HERO */}
      <section className="feed-hero" id="hero-top">
        <h1 className="feed-hero-title">Quick Search</h1>
        <p className="feed-hero-sub">
          ค้นหาคู่มือทั้งหมดขององค์กรจากที่เดียว — ลองพิมพ์ “VS Code”,
          “Onboarding”, “Brand guideline” หรือเลือกหมวดด้านล่าง
        </p>

        <form className="feed-hero-searchWrapper" onSubmit={handleSubmit}>
          <div className="feed-hero-search">
            <span className="feed-hero-searchIcon">🔍</span>{" "}
            <input
              type="text"
              placeholder={t("feed.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </form>

        <div className="feed-chipRow">
          {" "}
          {[
            { id: "all", label: t("feed.categories.all") },
            { id: "IT", label: t("feed.categories.it") },
            { id: "Design", label: t("feed.categories.design") },
            { id: "Marketing", label: t("feed.categories.marketing") },
            { id: "HR", label: t("feed.categories.hr") },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`feed-chip ${category === chip.id ? "is-active" : ""}`}
              onClick={() => handleCategoryClick(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* AI SUGGESTIONS SECTION */}
      {search && (
        <section className="feed-ai-suggestions">
          <div className="feed-ai-header">
            <h2 className="feed-ai-title">
              🤖 AI แนะนำคู่มือสำหรับ: "{search}"
            </h2>
          </div>
          {aiResults.length === 0 ? (
            <div className="feed-ai-empty">
              <p>
                ไม่พบคู่มือที่ตรงกับคำค้นหาของคุณ
                ลองค้นหาด้วยคำอื่นหรือเลือกหมวดหมู่
              </p>
            </div>
          ) : (
            <div className="feed-ai-results">
              {aiResults.map((manual, index) => (
                <Link
                  key={manual.id}
                  to={`/manual/${manual.id}`}
                  className="feed-ai-card"
                >
                  <div className="feed-ai-card-number">{index + 1}</div>
                  <div className="feed-ai-card-content">
                    <h3 className="feed-ai-card-title">{manual.title}</h3>
                    <p className="feed-ai-card-meta">{manual.meta}</p>
                    <p className="feed-ai-card-explanation">
                      {aiExplanations[index]}
                    </p>
                    {manual.tags && manual.tags.length > 0 && (
                      <div className="feed-ai-card-tags">
                        {manual.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="feed-ai-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="feed-ai-card-arrow">→</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MAIN LIST */}
      <section className="feed-main" id="manual-list">
        {" "}
        <header className="feed-mainHeader">
          <div className="feed-mainTitle">
            {hasFilters ? t("feed.searchResults") : t("feed.recommended")}
          </div>
          <div className="feed-mainSub">{resultText}</div>
        </header>{" "}
        <ManualGrid
          manuals={filteredManuals}
          activeTag={activeTag}
          onTagClick={handleTagClick}
          onLike={handleLike}
          onDownload={handleDownload}
          onBookmark={handleBookmark}
          className="feed-cardGrid"
        />
      </section>
    </main>
  );
};

export default Feed;
