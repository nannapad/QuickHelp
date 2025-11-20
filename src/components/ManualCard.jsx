import React from "react";
import { Link } from "react-router-dom";
import "./css/ManualCard.css";

const ManualCard = ({
  manual,
  activeTag = "",
  onTagClick = () => {},
  onLike = () => {},
  onDownload = () => {},
  onBookmark = () => {},
}) => {
  if (!manual) return null;

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

  return (
    <Link to={`/manual/${manual.id}`} className="manual-card-link">
      <article className="manual-card">
        <div className="manual-card-thumb" />
        <div className="manual-card-body">
          <h3 className="manual-card-title">{manual.title}</h3>
          <p className="manual-card-meta">{manual.meta}</p>
          {manual.description && (
            <p className="manual-card-description">{manual.description}</p>
          )}
          {manual.tags && manual.tags.length > 0 && (
            <div className="manual-card-tags-row">
              {manual.tags.slice(0, 3).map((tag) => (
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
              {manual.tags.length > 3 && (
                <span className="manual-tag-more">
                  +{manual.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <footer className="manual-card-footer">
          <div className="manual-card-footer-left">
            <span className="manual-circle-dot" />
            <span>{manual.views ?? 0} views</span>
          </div>
          <div className="manual-card-footer-right">
            <button
              type="button"
              className="manual-icon-btn"
              onClick={(e) => handleActionClick(onLike, e)}
              title={`${manual.likes ?? 0} likes`}
            >
              ♡ <span className="manual-count">{manual.likes ?? 0}</span>
            </button>
            <button
              type="button"
              className="manual-icon-btn"
              onClick={(e) => handleActionClick(onDownload, e)}
              title={`${manual.downloads ?? 0} downloads`}
            >
              ⤓ <span className="manual-count">{manual.downloads ?? 0}</span>
            </button>
            <button
              type="button"
              className="manual-icon-btn"
              onClick={(e) => handleActionClick(onBookmark, e)}
              title="Bookmark"
            >
              🔖
            </button>
          </div>
        </footer>
      </article>
    </Link>
  );
};

export default ManualCard;
