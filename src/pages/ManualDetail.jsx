// src/pages/ManualDetail.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./css/ManualDetail.module.css";

import manuals from "../data/ManualData";
import commentsData from "../data/CommentData";

const ManualDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const manual = useMemo(() => {
    if (!manuals || manuals.length === 0) return null;
    return manuals.find((m) => String(m.id) === String(id)) || manuals[0];
  }, [id]);

  // Check if current user can edit this manual
  const canEdit = useMemo(() => {
    if (!currentUser || !manual) return false;

    // Admin can edit any manual
    if (currentUser.role === "admin") return true;

    // Creator can edit their own manuals
    if (currentUser.role === "creator") {
      const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
      return (
        manual.author === userFullName || manual.author === currentUser.username
      );
    }

    return false;
  }, [currentUser, manual]);

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  useEffect(() => {
    if (manual && manual.versions && manual.versions.length > 0) {
      // Default to the first version (usually latest) if not set
      // In a real app, this might come from the URL or manual data
      const versionFromMeta = manual.meta ? manual.meta.split("v")[1] : null;
      const currentVersion = versionFromMeta || manual.versions[0];
      setSelectedVersion(currentVersion);
    } else if (manual && manual.version) {
      // Fallback to manual.version if versions array doesn't exist
      setSelectedVersion(manual.version);
    }
  }, [manual]);

  const relatedManuals = useMemo(() => {
    if (!manuals || !manual) return [];
    return manuals
      .filter(
        (m) =>
          m.id !== manual.id &&
          (m.category === manual.category ||
            m.tags?.some((t) => manual.tags?.includes(t)))
      )
      .slice(0, 3);
  }, [manual]);

  const comments = useMemo(() => {
    if (!commentsData || !manual) return [];
    return commentsData.filter((c) => String(c.manualId) === String(manual.id));
  }, [manual]);
  const handleLike = () => {
    setLiked(!liked);
    // In a real app, this would make an API call
  };

  const handleBookmark = () => {
    const newState = !bookmarked;
    setBookmarked(newState);
    if (newState) {
      alert("Bookmarked! You will be notified when this manual is updated.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: manual.title,
          text: manual.description,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Share link copied to clipboard!");
    }
  };
  const handleVersionChange = (e) => {
    setSelectedVersion(e.target.value);
    // In a real app, this would likely navigate to a different URL or fetch different data
  };

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!manual) {
    return (
      <main className={styles.manualPage}>
        <div className={styles.manualPageInner}>
          <p>Manual not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.manualPage}>
      <div className={styles.manualPageInner}>
        {/* BREADCRUMB */}
        <div className={styles.breadcrumbRow}>
          <button
            className={styles.backLink}
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className={styles.breadcrumb}>
            {manual.category}
            {manual.subCategory ? ` • ${manual.subCategory}` : ""}
            {` • ${manual.title}`}
          </div>
        </div>

        <div className={styles.grid}>
          {/* LEFT CONTENT */}
          <article className={styles.left}>
            {" "}
            <header className={styles.header}>
              <div className={styles.topRow}>
                <h1 className={styles.title}>{manual.title}</h1>

                {manual.versions && (
                  <div className={styles.versionRow}>
                    <div className={styles.versionWrapper}>
                      <span className={styles.versionLabel}>Version</span>
                      <select
                        className={styles.versionSelect}
                        value={selectedVersion}
                        onChange={handleVersionChange}
                        aria-label="Select version"
                      >
                        {manual.versions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.versionLine}></div>
                  </div>
                )}
              </div>

              <div className={styles.bottomRow}>
                <div className={styles.authorMetaRow}>
                  <div className={styles.authorAvatar} title={manual.author}>
                    {manual.author.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.authorDetails}>
                    <div className={styles.authorTop}>
                      <span className={styles.authorName}>{manual.author}</span>
                      <span className={styles.metaSeparator}>•</span>
                      <span className={styles.categoryBadge}>
                        {manual.category}
                      </span>
                    </div>
                    <div className={styles.authorBottom}>
                      <span className={styles.metaText}>
                        Updated {manual.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>{" "}
                <div className={styles.headerActions}>
                  {" "}
                  {canEdit && (
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => navigate(`/edit-manual/${manual.id}`)}
                      title="Edit this manual"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className={`${styles.actionBtn} ${
                      liked ? styles.liked : ""
                    }`}
                    onClick={handleLike}
                    aria-pressed={liked}
                    title={liked ? "Unlike this manual" : "Like this manual"}
                  >
                    {liked ? "Liked" : "Like"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${
                      bookmarked ? styles.bookmarked : ""
                    }`}
                    onClick={handleBookmark}
                    aria-pressed={bookmarked}
                    title={
                      bookmarked ? "Remove bookmark" : "Bookmark this manual"
                    }
                  >
                    {bookmarked ? "Bookmarked" : "Bookmark"}
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={handleShare}
                    title="Share this manual"
                  >
                    Share
                  </button>
                </div>
              </div>
            </header>
            {/* HERO */}
            <div className={styles.hero}>
              <div className={styles.heroContent}>
                <div className={styles.heroTitle}>{manual.description}</div>
                <div className={styles.heroStats}>
                  <span>⏱ {manual.estimatedTime || "10 min"} read</span>
                  <span>•</span>
                  <span>👁 {manual.views} views</span>
                  <span>•</span>
                  <span>★ {manual.difficulty || "Beginner"}</span>
                </div>
              </div>
            </div>
            {/* TOC */}
            {(manual.sections?.length > 0 ||
              manual.blocks?.some((b) => b.type === "heading")) && (
              <div className={styles.tocContainer}>
                <h3 className={styles.tocTitle}>Table of Contents</h3>
                <ul className={styles.tocList}>
                  {manual.blocks
                    ? manual.blocks
                        .filter((b) => b.type === "heading")
                        .map((block, index) => (
                          <li key={block.id || index}>
                            <button onClick={() => scrollToSection(index)}>
                              {block.value}
                            </button>
                          </li>
                        ))
                    : manual.sections.map((section, index) => (
                        <li key={index}>
                          <button onClick={() => scrollToSection(index)}>
                            {section.title}
                          </button>
                        </li>
                      ))}
                </ul>
              </div>
            )}
            {/* CONTENT SECTIONS */}
            <div className={styles.contentBody}>
              {manual.blocks ? (
                manual.blocks.map((block, index) => (
                  <div
                    key={block.id || index}
                    id={`section-${index}`}
                    className={styles.blockWrapper}
                  >
                    {block.type === "heading" && (
                      <h2 className={styles.sectionTitle}>{block.value}</h2>
                    )}
                    {block.type === "text" && (
                      <p className={styles.text}>{block.value}</p>
                    )}
                    {block.type === "quote" && (
                      <blockquote className={styles.quote}>
                        {block.value}
                      </blockquote>
                    )}
                    {block.type === "code" && (
                      <pre className={styles.codeBlock}>
                        <code>{block.value}</code>
                      </pre>
                    )}
                    {block.type === "image" && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={block.imageUrl || block.value}
                          alt="Manual content"
                          className={styles.contentImage}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : manual.sections ? (
                manual.sections.map((section, index) => (
                  <section
                    key={index}
                    id={`section-${index}`}
                    className={styles.section}
                  >
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <p className={styles.text}>{section.content}</p>
                  </section>
                ))
              ) : (
                <section className={styles.section}>
                  <p className={styles.text}>
                    {manual.intro || "No content available for this manual."}
                  </p>
                </section>
              )}
            </div>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className={styles.right}>
            {/* DOWNLOAD */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Download</h3>
              <p className={styles.cardDesc}>
                Get the full PDF version for offline reading.
              </p>

              <button
                type="button"
                className={`${styles.btn} ${styles.primary} ${styles.full}`}
              >
                Download PDF
              </button>

              <div className={styles.fileInfo}>
                <span>PDF • 2.4 MB</span>
                <span>v{selectedVersion || manual.version || "1.0"}</span>
              </div>
            </section>

            {/* TAGS */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Tags</h3>
              <div className={styles.tagsRow}>
                {(manual.tags || []).map((tag) => (
                  <span key={tag} className={styles.tagChip}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* RELATED */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Related Manuals</h3>
              <div className={styles.relatedList}>
                {relatedManuals.map((m) => (
                  <button
                    key={m.id}
                    className={styles.relatedItem}
                    onClick={() => navigate(`/manual/${m.id}`)}
                  >
                    <div className={styles.relatedTitle}>{m.title}</div>
                    <div className={styles.relatedMeta}>
                      {m.category} • {m.views} views
                    </div>
                  </button>
                ))}
                {relatedManuals.length === 0 && (
                  <div className={styles.empty}>No related manuals found</div>
                )}
              </div>
            </section>

            {/* COMMENTS */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Comments ({comments.length})</h3>

              <div className={styles.commentInputWrapper}>
                <textarea
                  className={styles.commentInput}
                  rows={2}
                  placeholder="Add a comment..."
                />
                <button className={styles.commentSubmitBtn}>Post</button>
              </div>

              <div className={styles.commentList}>
                {comments.map((c) => (
                  <div key={c.id} className={styles.commentRow}>
                    <div className={styles.commentAvatar}>
                      {c.author?.[0]?.toUpperCase()}
                    </div>
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{c.author}</span>
                        <span className={styles.commentTime}>2d ago</span>
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className={styles.empty}>No comments yet</div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ManualDetail;
