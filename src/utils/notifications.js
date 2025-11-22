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

export const addNotification = ({ title, body, toRoles = ["admin"], data = {} }) => {
  const items = getNotifications();
  const id = Date.now();
  const n = {
    id,
    title,
    body,
    toRoles,
    readBy: [], // array of user ids who read
    data,
    createdAt: new Date().toISOString(),
  };
  const updated = [n, ...items];
  saveNotifications(updated);
  // Notify listeners
  window.dispatchEvent(new Event("notificationsChanged"));
  return n;
};

export const getUnreadCountForUser = (user) => {
  if (!user) return 0;
  const items = getNotifications();
  const role = user.role;
  // unread = notifications targeted to this user's role AND not marked read by this user
  return items.filter((n) => n.toRoles.includes(role) && !(n.readBy || []).includes(user.id)).length;
};

export const markAllReadForUser = (user) => {
  if (!user) return;
  const items = getNotifications();
  const updated = items.map((n) => {
    if (n.toRoles.includes(user.role)) {
      const readBy = new Set(n.readBy || []);
      readBy.add(user.id);
      return { ...n, readBy: Array.from(readBy) };
    }
    return n;
  });
  saveNotifications(updated);
  window.dispatchEvent(new Event("notificationsChanged"));
};

export default {
  getNotifications,
  addNotification,
  getUnreadCountForUser,
  markAllReadForUser,
};
