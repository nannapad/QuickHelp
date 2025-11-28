// Simple notification storage using localStorage
const STORAGE_KEY = "quickhelp_notifications";

const getNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load notifications", err);
    return [];
  }
};

const saveNotifications = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save notifications", err);
  }
};

// Add notification for a specific user
export const addNotification = ({
  userId,
  message,
  type = "info",
  link = null,
}) => {
  const items = getNotifications();
  const id = Date.now();
  const n = {
    id,
    userId: String(userId), // Always store as string for consistency
    message,
    type, // info | success | warning | error
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [n, ...items];
  saveNotifications(updated);
  // Notify listeners
  window.dispatchEvent(new Event("notificationsChanged"));
  return n;
};

// Get notifications for a specific user
export const getNotificationsForUser = (userId) => {
  if (!userId) return [];
  const items = getNotifications();
  return items.filter((n) => String(n.userId) === String(userId));
};

// Get unread count for a specific user
export const getUnreadCountForUser = (userId) => {
  if (!userId) return 0;
  const items = getNotificationsForUser(userId);
  return items.filter((n) => !n.read).length;
};

// Mark all notifications as read for a user
export const markAllReadForUser = (userId) => {
  if (!userId) return;
  const items = getNotifications();
  const updated = items.map((n) => {
    if (String(n.userId) === String(userId) && !n.read) {
      return { ...n, read: true };
    }
    return n;
  });
  saveNotifications(updated);
  window.dispatchEvent(new Event("notificationsChanged"));
};

// Mark a specific notification as read
export const markNotificationAsRead = (notificationId) => {
  const items = getNotifications();
  const updated = items.map((n) => {
    if (String(n.id) === String(notificationId)) {
      return { ...n, read: true };
    }
    return n;
  });
  saveNotifications(updated);
  window.dispatchEvent(new Event("notificationsChanged"));
};

export default {
  getNotifications,
  addNotification,
  getNotificationsForUser,
  getUnreadCountForUser,
  markAllReadForUser,
  markNotificationAsRead,
};
