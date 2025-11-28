import { getUsersWhoBookmarkedManual, isManualBookmarked } from "./bookmarks";
import { addNotification } from "./notifications";

const KEY = "manualInteractions";

// Load interaction data from localStorage
function loadInteractions() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    console.error("Failed to load manual interactions:", e);
    return {};
  }
}

// Save interaction data to localStorage
function saveInteractions(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save manual interactions:", e);
  }
}

// Initialize interaction data for a manual
function initializeInteractionData(data, manualId) {
  const idStr = String(manualId);
  if (!data[idStr]) {
    data[idStr] = {
      views: 0,
      likes: 0,
      downloads: 0,
      likedBy: [],
      viewedBy: [],
    };
  }
  return data[idStr];
}

/**
 * Increment view count for a manual (prevents duplicate counting per user)
 */
export function incrementViews(manualId, userId) {
  if (manualId == null) return;

  const data = loadInteractions();
  const item = initializeInteractionData(data, manualId);
  const userKey = userId ? String(userId) : null;

  // Check if user already viewed this manual
  if (userKey && item.viewedBy && item.viewedBy.includes(userKey)) {
    return;
  }

  item.views = (item.views || 0) + 1;
  if (userKey) {
    item.viewedBy = item.viewedBy || [];
    item.viewedBy.push(userKey);
  }

  saveInteractions(data);
}

/**
 * Toggle like status for a manual
 * @returns {Object} { liked: boolean, likes: number }
 */
export function toggleLike(manualId, userId) {
  if (manualId == null || !userId) return { liked: false, likes: 0 };

  const userKey = String(userId);
  const data = loadInteractions();
  const item = initializeInteractionData(data, manualId);

  item.likedBy = item.likedBy || [];

  const index = item.likedBy.indexOf(userKey);
  const likedNow = index === -1;

  if (likedNow) {
    item.likedBy.push(userKey);
  } else {
    item.likedBy.splice(index, 1);
  }

  item.likes = item.likedBy.length;
  saveInteractions(data);

  return { liked: likedNow, likes: item.likes };
}

/**
 * Increment download count for a manual
 */
export function incrementDownloads(manualId) {
  if (manualId == null) return;

  const data = loadInteractions();
  const item = initializeInteractionData(data, manualId);

  item.downloads = (item.downloads || 0) + 1;
  saveInteractions(data);
}

/**
 * Get all raw interaction data (for internal use)
 * @returns {Object} All interaction data
 */
export function getManualInteractions() {
  return loadInteractions();
}

/**
 * Get statistics for a manual
 * @returns {Object} { views: number, likes: number, downloads: number }
 */
export function getManualStats(manualId) {
  if (manualId == null) {
    return { views: 0, likes: 0, downloads: 0 };
  }

  const idStr = String(manualId);
  const data = loadInteractions();
  const item = data[idStr];

  if (!item) {
    return { views: 0, likes: 0, downloads: 0 };
  }

  return {
    views: item.views || 0,
    likes: item.likes || 0,
    downloads: item.downloads || 0,
  };
}

/**
 * Merge manual data with stats and user-specific state (liked/bookmarked)
 * @returns {Object} Enhanced manual object with interaction data
 */
export function getEnhancedManual(manual, userId) {
  if (!manual) return null;

  const stats = getManualStats(manual.id);
  const idStr = String(manual.id);
  const data = loadInteractions();
  const item = data[idStr];

  // Check if user has liked this manual
  const hasLiked =
    userId && item && item.likedBy
      ? item.likedBy.includes(String(userId))
      : false;

  // Check if user has bookmarked this manual
  const isBookmarked = userId ? isManualBookmarked(userId, manual.id) : false;

  return {
    ...manual,
    views: stats.views,
    likes: stats.likes,
    downloads: stats.downloads,
    hasLiked,
    isBookmarked,
  };
}

/**
 * Notify all users who bookmarked a manual when it's updated
 */
export function notifyBookmarkedUsers(manualId, manualTitle, newVersion) {
  const userIds = getUsersWhoBookmarkedManual(manualId);
  if (!userIds.length) return;

  const title = manualTitle || "Manual";
  const versionText = newVersion ? ` (v${newVersion})` : "";

  userIds.forEach((uid) => {
    addNotification({
      userId: uid,
      message: `Manual "${title}"${versionText} has been updated`,
      type: "info",
      link: `/manual/${manualId}`,
    });
  });
}
