import React from "react";
import ManualCard from "./ManualCard";
import "./css/ManualGrid.css";

const ManualGrid = ({
  manuals = [],
  activeTag = "",
  onTagClick = () => {},
  onLike = () => {},
  onDownload = () => {},
  onBookmark = () => {},
  className = "",
}) => {
  if (!manuals || manuals.length === 0) {
    return (
      <div className={`manual-grid-empty ${className}`}>
        <div className="manual-grid-empty-title">No manuals found</div>
        <div className="manual-grid-empty-text">
          Try adjusting your search criteria or browse different categories.
        </div>
      </div>
    );
  }

  return (
    <div className={`manual-grid ${className}`}>
      {manuals.map((manual) => (
        <ManualCard
          key={manual.id}
          manual={manual}
          activeTag={activeTag}
          onTagClick={onTagClick}
          onLike={() => onLike(manual)}
          onDownload={() => onDownload(manual)}
          onBookmark={() => onBookmark(manual)}
        />
      ))}
    </div>
  );
};

export default ManualGrid;
