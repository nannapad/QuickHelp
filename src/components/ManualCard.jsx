import React from "react";
import { Link } from "react-router-dom";
import "./css/ManualCard.css";
import { getSafeImageUrl } from "../utils/cleanupBlobUrls";
import { getEnhancedManual } from "../utils/manualInteractions";

const ManualCard = ({
  manual,
  activeTag = "",
  onTagClick = () => {},
  onLike = () => {},
  onDownload = () => {},
  onBookmark = () => {},
}) => {
  if (!manual) return null;

  // Get enhanced manual with interaction data
  const enhancedManual = getEnhancedManual(manual);

  const handleTagClick = (tag, e) => {
    e.preventDefault();
    e.stopPropagation();
    onTagClick(tag);
  };

  const handleActionClick = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  // Get safe thumbnail URL (filters out blob URLs)
  const safeThumbnail = getSafeImageUrl(enhancedManual.thumbnail);
  return (
    <Link to={`/manual/${enhancedManual.id}`} className="manual-card-link">
      <article className="manual-card">
        <div className="manual-card-thumb">
          {safeThumbnail ? (
            <img
              src={safeThumbnail}
              alt={`Thumbnail for ${enhancedManual.title}`}
              className="manual-card-thumb-img"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div class="manual-card-thumb-placeholder"><span>📄</span></div>';
              }}
            />
          ) : (
            <div className="manual-card-thumb-placeholder">
              <span>📄</span>
            </div>
          )}
        </div>
        <div className="manual-card-body">
          <h3 className="manual-card-title">{enhancedManual.title}</h3>
          <p className="manual-card-meta">{enhancedManual.meta}</p>
          {enhancedManual.description && (
            <p className="manual-card-description">
              {enhancedManual.description}
            </p>
          )}{" "}
          {enhancedManual.tags && enhancedManual.tags.length > 0 && (
            <div className="manual-card-tags-row">
              {enhancedManual.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`manual-tag-pill ${
                    activeTag === tag ? "is-active" : ""
                  }`}
                  onClick={(e) => handleTagClick(tag, e)}
                >
                  {tag}
                </button>
              ))}
              {enhancedManual.tags.length > 3 && (
                <span className="manual-tag-more">
                  +{enhancedManual.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <footer className="manual-card-footer">
          <div className="manual-card-footer-left">
            <span className="manual-circle-dot" />
            <span>{enhancedManual.views ?? 0} views</span>
          </div>
          <div className="manual-card-footer-right">
            <button
              type="button"
              className={`manual-icon-btn ${
                enhancedManual.hasLiked ? "is-liked" : ""
              }`}
              onClick={(e) => handleActionClick(onLike, e)}
              title={`${enhancedManual.likes ?? 0} likes`}
            >
              {enhancedManual.hasLiked ? "♥" : "♡"}{" "}
              <span className="manual-count">{enhancedManual.likes ?? 0}</span>
            </button>
            <button
              type="button"
              className="manual-icon-btn"
              onClick={(e) => handleActionClick(onDownload, e)}
              title={`${enhancedManual.downloads ?? 0} downloads`}
            >
              ⤓{" "}
              <span className="manual-count">
                {enhancedManual.downloads ?? 0}
              </span>
            </button>
            <button
              type="button"
              className={`manual-icon-btn ${
                enhancedManual.isBookmarked ? "is-bookmarked" : ""
              }`}
              onClick={(e) => handleActionClick(onBookmark, e)}
              title={
                enhancedManual.isBookmarked ? "Remove bookmark" : "Add bookmark"
              }
            >
              {enhancedManual.isBookmarked ? "🔖" : "🏷️"}
            </button>
          </div>
        </footer>
      </article>
    </Link>
  );
};

export default ManualCard;
