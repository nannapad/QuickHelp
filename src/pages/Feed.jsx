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

const Feed = () => {
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useTranslation();

  const hasFilters = useMemo(
    () => Boolean(search || activeTag || category !== "all"),
    [search, activeTag, category]
  );
  const filteredManuals = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    // Combine static manuals with published custom manuals from localStorage
    const customManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );
    const publishedCustomManuals = customManuals.filter(
      (m) => m.status === "published"
    );
    // customManuals first so edited versions override static ones
    const allManuals = [...publishedCustomManuals, ...manuals];

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
    scrollToList();
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setActiveTag("");
    setSearch("");
    scrollToList();
  };
  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setSearch("");
    setSearchInput("");
    setCategory("all");
    scrollToList();
  };

  const handleLike = (manual) => {
    const result = toggleLike(manual.id);
    console.log(
      `${result.hasLiked ? "Liked" : "Unliked"} manual: ${manual.title}`
    );
  };

  const handleDownload = (manual) => {
    const newCount = incrementDownloads(manual.id);
    console.log(`Downloaded manual: ${manual.title} (Total: ${newCount})`);
    // You can add actual download logic here
  };

  const handleBookmark = (manual) => {
    const isBookmarked = toggleBookmark(manual.id);
    console.log(
      `${isBookmarked ? "Bookmarked" : "Removed bookmark from"} manual: ${
        manual.title
      }`
    );
  };

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
