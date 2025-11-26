import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotificationsForUser,
  markAllReadForUser,
  markNotificationAsRead,
} from "../utils/notifications";
import "./css/NotificationDropdown.css";

const NotificationDropdown = ({ user, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id && isOpen) {
      loadNotifications();
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleNotificationsChanged = () => {
      if (user && user.id) {
        loadNotifications();
      }
    };

    window.addEventListener("notificationsChanged", handleNotificationsChanged);
    return () => {
      window.removeEventListener(
        "notificationsChanged",
        handleNotificationsChanged
      );
    };
  }, [user]);

  const loadNotifications = () => {
    if (!user || !user.id) return;
    const userNotifications = getNotificationsForUser(user.id);
    setNotifications(userNotifications);
  };

  const handleMarkAllRead = () => {
    if (!user || !user.id) return;
    markAllReadForUser(user.id);
    loadNotifications();
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }

    // Navigate to link if provided
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else {
      return "Just now";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <button onClick={handleMarkAllRead} className="mark-all-read-btn">
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${
                notification.read ? "read" : "unread"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {getTimeAgo(notification.createdAt)}
                </span>
              </div>
              {!notification.read && (
                <div className="notification-unread-dot"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
