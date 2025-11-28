// src/pages/ManualDetail.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlertModal } from "../hooks/useAlertModal";
import AlertModal from "../components/AlertModal";
import "./css/ManualDetail.css";
import ErrorBoundary from "../components/ErrorBoundary";

import manuals from "../data/ManualData";
import commentsData from "../data/CommentData.js";
import { getSafeImageUrl } from "../utils/cleanupBlobUrls";
import {
  getEnhancedManual,
  incrementViews,
  toggleLike,
  incrementDownloads,
  getManualStats,
  getManualInteractions,
} from "../utils/manualInteractions";
import {
  isManualBookmarked,
  toggleBookmark as toggleBookmarkUtil,
} from "../utils/bookmarks";

const ManualDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manualViews, setManualViews] = useState(0);
  const [manualLikes, setManualLikes] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [localComments, setLocalComments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const { modalState, showAlert, showConfirm, hideAlert } = useAlertModal();
  const manual = useMemo(() => {
    if (!manuals || manuals.length === 0) return null;

    // Combine static manuals with custom manuals from localStorage
    const customManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );
    // Filter out static manuals that have been customized (prevent duplicates)
    const customIds = new Set(customManuals.map((m) => m.id));
    const staticManuals = manuals.filter((m) => !customIds.has(m.id));
    const allManuals = [...customManuals, ...staticManuals];

    return allManuals.find((m) => String(m.id) === String(id)) || allManuals[0];
  }, [id, refreshKey]);

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
        const user = JSON.parse(userData);
        setCurrentUser(user); // Initialize like and bookmark status for current user
        if (id) {
          const interactions = getManualInteractions();
          const manualData = interactions[id] || { likedBy: [] };
          setLiked(
            manualData.likedBy
              ? manualData.likedBy.includes(parseInt(user.id))
              : false
          );
          setBookmarked(isManualBookmarked(user.id, id));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Increment view count once when manual loads (only if user hasn't viewed before)
    if (id) {
      const userData = localStorage.getItem("userData");
      let userId = null;
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id;
        } catch (e) {
          // Continue without userId
        }
      }

      const viewCount = incrementViews(id, userId);
      const stats = getManualStats(id);
      setManualViews(viewCount);
      setManualLikes(stats.likes || 0);
    }

    // Listen for localStorage changes to refresh manual data
    const handleStorageChange = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event when editing in the same tab
    window.addEventListener("manualUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("manualUpdated", handleStorageChange);
    };
  }, [id]);
  useEffect(() => {
    if (manual && manual.version) {
      // Use manual.version as the current version
      setSelectedVersion(manual.version);
    } else if (manual && manual.versions && manual.versions.length > 0) {
      // Fallback to first version in versions array
      setSelectedVersion(manual.versions[0]);
    } else if (manual && manual.meta) {
      // Fallback to extracting from meta
      const versionMatch = manual.meta.match(/v(\d+\.\d+)/);
      if (versionMatch) {
        setSelectedVersion(versionMatch[1]);
      }
    }
  }, [manual]);
  const relatedManuals = useMemo(() => {
    if (!manuals || !manual) return [];

    // Combine static manuals with custom manuals from localStorage
    const customManuals = JSON.parse(
      localStorage.getItem("customManuals") || "[]"
    );
    // Filter out static manuals that have been customized (prevent duplicates)
    const customIds = new Set(customManuals.map((m) => m.id));
    const staticManuals = manuals.filter((m) => !customIds.has(m.id));
    const allManuals = [...customManuals, ...staticManuals];

    return allManuals
      .filter(
        (m) =>
          m.id !== manual.id &&
          (m.category === manual.category ||
            m.tags?.some((t) => manual.tags?.includes(t)))
      )
      .slice(0, 3);
  }, [manual, refreshKey]);
  const comments = useMemo(() => {
    if (!manual) return localComments;

    // Handle case where commentsData might not be loaded
    const originalComments = commentsData
      ? commentsData.filter((c) => String(c.manualId) === String(manual.id))
      : [];

    // Combine original comments with local comments
    return [...originalComments, ...localComments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [manual, localComments]);
  const handleLike = () => {
    if (!currentUser) return;
    const { liked, likes } = toggleLike(id, currentUser.id);
    setLiked(liked);
    setManualLikes(likes);
  };
  const handleBookmark = () => {
    if (!currentUser) return;
    if (!manual) return;

    const newState = toggleBookmarkUtil(currentUser.id, manual);
    setBookmarked(newState);
    if (newState) {
      showAlert(
        "Bookmarked! You will be notified when this manual is updated.",
        "success",
        "Bookmark Added"
      );
    }
  };
  const handleShare = async () => {
    try {
      // Always copy to clipboard
      await navigator.clipboard.writeText(window.location.href);

      // Show "Copied!" state
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      // Try native share if available
      if (navigator.share) {
        await navigator.share({
          title: manual.title,
          text: manual.description,
          url: window.location.href,
        });
      }
    } catch (error) {
      // If clipboard write fails, still show copied state
      console.error("Error sharing:", error);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
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

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? "1d ago" : `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1h ago" : `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? "1m ago" : `${diffMinutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;

    setIsSubmittingComment(true);

    try {
      // Create new comment object
      const newCommentObj = {
        id: Date.now(), // Simple ID generation for demo
        manualId: parseInt(id),
        userId: currentUser.id,
        author: `${currentUser.firstName} ${currentUser.lastName}`,
        text: newComment.trim(),
        createdAt: new Date().toISOString().split("T")[0],
      }; // Add to local comments state
      setLocalComments((prev) => [newCommentObj, ...prev]);
      setNewComment("");

      // Show success feedback
      setTimeout(() => {
        showAlert("Comment posted successfully!", "success", "Comment Posted");
      }, 100);
    } catch (error) {
      console.error("Error posting comment:", error);
      showAlert("Failed to post comment. Please try again.", "error", "Error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleCommentSubmit();
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  const handleSaveEdit = (commentId) => {
    if (!editingCommentText.trim()) {
      showAlert("Comment cannot be empty", "error", "Error");
      return;
    }

    // Update local comments
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, text: editingCommentText.trim(), edited: true }
          : c
      )
    );

    setEditingCommentId(null);
    setEditingCommentText("");
    showAlert("Comment updated successfully!", "success", "Updated");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = (comment) => {
    showConfirm(
      `Delete this comment? This action cannot be undone.`,
      () => performDeleteComment(comment.id),
      "danger",
      "Confirm Deletion",
      "Delete",
      "Cancel"
    );
  };

  const performDeleteComment = (commentId) => {
    setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
    showAlert("Comment deleted successfully!", "success", "Deleted");
  };

  if (!manual) {
    return (
      <main className="manualPage">
        <div className="manualPageInner">
          <p>Manual not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="manualPage">
      <div className="manualPageInner">
        {/* BREADCRUMB */}
        <div className="breadcrumbRow">
          <button
            className="backLink"
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="breadcrumb">
            {manual.category}
            {manual.subCategory ? ` • ${manual.subCategory}` : ""}
            {` • ${manual.title}`}
          </div>
        </div>

        <div className="grid">
          {/* LEFT CONTENT */}
          <article className="left">
            <header className="header">
              <div className="topRow">
                <h1 className="title">{manual.title}</h1>

                {manual.versions && (
                  <div className="versionRow">
                    <div className="versionWrapper">
                      <span className="versionLabel">Version</span>
                      <select
                        className="versionSelect"
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
                    <div className="versionLine"></div>
                  </div>
                )}
              </div>

              <div className="bottomRow">
                <div className="authorMetaRow">
                  <div className="authorAvatar" title={manual.author}>
                    {manual.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="authorDetails">
                    <div className="authorTop">
                      <span className="authorName">{manual.author}</span>
                      <span className="metaSeparator">•</span>
                      <span className="categoryBadge">{manual.category}</span>
                    </div>
                    <div className="authorBottom">
                      <span className="metaText">
                        Updated {manual.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="headerActions">
                  {canEdit && (
                    <button
                      className="actionBtn editBtn"
                      onClick={() => navigate(`/edit-manual/${manual.id}`)}
                      title="Edit this manual"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className={`actionBtn ${liked ? "liked" : ""}`}
                    onClick={handleLike}
                    aria-pressed={liked}
                    title={liked ? "Unlike this manual" : "Like this manual"}
                  >
                    {liked ? "Liked" : "Like"}
                  </button>{" "}
                  <button
                    className={`actionBtn ${bookmarked ? "bookmarked" : ""}`}
                    onClick={handleBookmark}
                    aria-pressed={bookmarked}
                    title={
                      bookmarked ? "Remove bookmark" : "Bookmark this manual"
                    }
                  >
                    {bookmarked ? "Bookmarked" : "Bookmark"}
                  </button>{" "}
                  <button
                    className={`actionBtn ${copied ? "copied" : ""}`}
                    onClick={handleShare}
                    title={copied ? "Link copied!" : "Share this manual"}
                  >
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>
              </div>
            </header>

            {/* HERO */}
            <div className="hero">
              <div className="heroContent">
                <div className="heroTitle">{manual.description}</div>
              </div>
            </div>

            {/* TOC */}
            {(manual.sections?.length > 0 ||
              manual.blocks?.some((b) => b.type === "heading")) && (
              <div className="tocContainer">
                <h3 className="tocTitle">Table of Contents</h3>
                <ul className="tocList">
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
            <div className="contentBody">
              {manual.blocks ? (
                manual.blocks.map((block, index) => (
                  <div
                    key={block.id || index}
                    id={`section-${index}`}
                    className="blockWrapper"
                  >
                    {block.type === "heading" && (
                      <h2 className="sectionTitle">{block.value}</h2>
                    )}
                    {block.type === "text" && (
                      <p className="text">{block.value}</p>
                    )}
                    {block.type === "quote" && (
                      <blockquote className="quote">{block.value}</blockquote>
                    )}
                    {block.type === "code" && (
                      <pre className="codeBlock">
                        <code>{block.value}</code>
                      </pre>
                    )}{" "}
                    {block.type === "image" && (
                      <div className="imageWrapper">
                        {getSafeImageUrl(block.imageUrl || block.value) ? (
                          <img
                            src={getSafeImageUrl(block.imageUrl || block.value)}
                            alt="Manual content"
                            className="contentImage"
                            onError={(e) => {
                              e.target.style.display = "none";
                              console.warn(
                                "Failed to load image:",
                                block.imageUrl || block.value
                              );
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              padding: "2rem",
                              textAlign: "center",
                              background: "var(--bg-secondary)",
                              borderRadius: "8px",
                              color: "var(--text-muted)",
                            }}
                          >
                            📷 Image not available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : manual.sections ? (
                manual.sections.map((section, index) => (
                  <section
                    key={index}
                    id={`section-${index}`}
                    className="section"
                  >
                    <h2 className="sectionTitle">{section.title}</h2>
                    <p className="text">{section.content}</p>
                  </section>
                ))
              ) : (
                <section className="section">
                  <p className="text">
                    {manual.intro || "No content available for this manual."}
                  </p>
                </section>
              )}
            </div>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className="right">
            {" "}
            {/* DOWNLOAD */}
            <section className="card">
              <h3 className="cardTitle">Download</h3>
              <p className="cardDesc">
                Get the full {manual.fileInfo ? "version" : "PDF version"} for
                offline reading.
              </p>
              <button
                type="button"
                className="btn primary full"
                onClick={() => {
                  if (
                    manual.fileInfo &&
                    typeof manual.fileInfo === "object" &&
                    manual.fileInfo.dataUrl
                  ) {
                    // Download the actual uploaded file
                    const link = document.createElement("a");
                    link.href = manual.fileInfo.dataUrl;
                    link.download = manual.fileInfo.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showAlert("Download started!", "success", "Downloading");
                  } else {
                    showAlert(
                      "File not available for download",
                      "warning",
                      "No File"
                    );
                  }
                }}
              >
                {manual.fileInfo ? "Download File" : "Download PDF"}
              </button>{" "}
              <div className="fileInfo">
                {manual.fileInfo && typeof manual.fileInfo === "object" ? (
                  <>
                    <span>
                      {manual.fileInfo.type?.split("/")[1]?.toUpperCase() ||
                        "FILE"}{" "}
                      • {(manual.fileInfo.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span>{manual.fileInfo.name}</span>
                  </>
                ) : manual.fileInfo && typeof manual.fileInfo === "string" ? (
                  <>
                    <span>FILE</span>
                    <span>{manual.fileInfo}</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "var(--text-muted)" }}>
                      📄 No file uploaded yet
                    </span>
                  </>
                )}
              </div>
            </section>
            {/* TAGS */}
            <section className="card">
              <h3 className="cardTitle">Tags</h3>
              <div className="tagsRow">
                {(manual.tags || []).map((tag) => (
                  <span key={tag} className="tagChip">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
            {/* RELATED */}
            <section className="card">
              <h3 className="cardTitle">Related Manuals</h3>
              <div className="relatedList">
                {relatedManuals.map((m) => (
                  <button
                    key={m.id}
                    className="relatedItem"
                    onClick={() => navigate(`/manual/${m.id}`)}
                  >
                    <div className="relatedTitle">{m.title}</div>
                    <div className="relatedMeta">
                      {m.category} • {m.views} views
                    </div>
                  </button>
                ))}
                {relatedManuals.length === 0 && (
                  <div className="empty">No related manuals found</div>
                )}
              </div>
            </section>
            {/* COMMENTS */}
            <section className="card">
              <h3 className="cardTitle">Comments ({comments.length})</h3>

              {currentUser ? (
                <div className="commentInputWrapper">
                  <textarea
                    className="commentInput"
                    rows={3}
                    placeholder="Add a comment... (Ctrl+Enter to post)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleCommentKeyPress}
                    disabled={isSubmittingComment}
                  />
                  <button
                    className="commentSubmitBtn"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              ) : (
                <div className="commentLoginPrompt">
                  <p>
                    Please{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="loginLink"
                    >
                      login
                    </button>{" "}
                    to add a comment
                  </p>
                </div>
              )}

              <div className="commentList">
                {comments.map((c) => (
                  <div key={c.id} className="commentRow">
                    <div className="commentAvatar">
                      {c.author?.[0]?.toUpperCase()}
                    </div>
                    <div className="commentContent">
                      <div className="commentHeader">
                        <span className="commentAuthor">{c.author}</span>
                        <span className="commentTime">
                          {getTimeAgo(c.createdAt)}
                          {c.edited && (
                            <span className="editedBadge"> (edited)</span>
                          )}
                        </span>
                        {currentUser && c.userId === currentUser.id && (
                          <div className="commentActions">
                            <button
                              className="commentActionBtn"
                              onClick={() => handleEditComment(c)}
                              title="Edit comment"
                            >
                              ✏️
                            </button>
                            <button
                              className="commentActionBtn deleteBtn"
                              onClick={() => handleDeleteComment(c)}
                              title="Delete comment"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                      {editingCommentId === c.id ? (
                        <div className="commentEditWrapper">
                          <textarea
                            className="commentEditInput"
                            value={editingCommentText}
                            onChange={(e) =>
                              setEditingCommentText(e.target.value)
                            }
                            rows={3}
                            autoFocus
                          />
                          <div className="commentEditActions">
                            <button
                              className="commentEditSaveBtn"
                              onClick={() => handleSaveEdit(c.id)}
                            >
                              Save
                            </button>
                            <button
                              className="commentEditCancelBtn"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="commentText">{c.text}</p>
                      )}
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="empty">
                    No comments yet.{" "}
                    {currentUser
                      ? "Be the first to comment!"
                      : "Login to be the first to comment!"}
                  </div>
                )}
              </div>
            </section>{" "}
          </aside>
        </div>
      </div>

      <AlertModal
        show={modalState.show}
        onHide={hideAlert}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </main>
  );
};

export default ManualDetail;
