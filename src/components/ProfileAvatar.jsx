import React from "react";
import { getSafeImageUrl } from "../utils/cleanupBlobUrls";
import "./css/ProfileAvatar.css";

/**
 * ProfileAvatar component
 * Shows user profile picture if available, otherwise shows first letter of first name
 * @param {Object} user - User object with profilePicture, firstName, lastName, username
 * @param {string} size - Size of avatar: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} className - Additional CSS classes
 */
const ProfileAvatar = ({ user, size = "medium", className = "" }) => {
  if (!user) {
    return (
      <div className={`profile-avatar ${size} ${className}`}>
        <span className="profile-avatar-text">?</span>
      </div>
    );
  }

  // Get safe profile picture URL (filters out blob URLs)
  const safeProfilePicture = getSafeImageUrl(user.profilePicture);

  // Get user initials
  const getInitials = () => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className={`profile-avatar ${size} ${className}`}>
      {safeProfilePicture ? (
        <img
          src={safeProfilePicture}
          alt={`${user.firstName || user.username}'s profile`}
          className="profile-avatar-img"
          onError={(e) => {
            // If image fails to load, hide it and show initials
            e.target.style.display = "none";
            const initialsElement = e.target.nextElementSibling;
            if (initialsElement) {
              initialsElement.style.display = "flex";
            }
          }}
        />
      ) : null}
      <span
        className="profile-avatar-text"
        style={{ display: safeProfilePicture ? "none" : "flex" }}
      >
        {getInitials()}
      </span>
    </div>
  );
};

export default ProfileAvatar;
