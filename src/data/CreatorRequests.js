// Simple storage for creator requests using localStorage
const STORAGE_KEY = "quickhelp_creator_requests";

const getRequests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load creator requests", err);
    return [];
  }
};

const saveRequests = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save creator requests", err);
  }
};

export const addRequest = ({ userId, username, team = "", reason = "", types = [] }) => {
  const items = getRequests();
  const id = Date.now();
  const req = {
    id,
    userId,
    username,
    team,
    reason,
    types,
    status: "pending", // pending | approved | rejected
    createdAt: new Date().toISOString(),
    reviewedAt: null,
    reviewerId: null,
    note: null,
  };
  const updated = [req, ...items];
  saveRequests(updated);
  // notify listeners
  window.dispatchEvent(new Event("creatorRequestsChanged"));
  return req;
};

export const getRequestByUserId = (userId) => {
  const items = getRequests();
  return items.find((r) => r.userId === parseInt(userId));
};

export const getAllRequests = () => getRequests();

export const updateRequestStatus = (requestId, { status, reviewerId, note }) => {
  const items = getRequests();
  const idx = items.findIndex((r) => r.id === parseInt(requestId));
  if (idx === -1) return null;
  const updated = [...items];
  updated[idx] = {
    ...updated[idx],
    status,
    reviewerId: reviewerId || updated[idx].reviewerId,
    reviewedAt: new Date().toISOString(),
    note: note || updated[idx].note,
  };
  saveRequests(updated);
  window.dispatchEvent(new Event("creatorRequestsChanged"));
  return updated[idx];
};

export default {
  addRequest,
  getRequestByUserId,
  getAllRequests,
  updateRequestStatus,
};
