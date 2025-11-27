// Utility functions for manual interactions (views, likes, downloads, bookmarks)

const MANUAL_INTERACTIONS_KEY = "manualInteractions";
const BOOKMARKS_KEY = "manualBookmarks";

/**
 * Get all manual interactions from localStorage
 */
export const getManualInteractions = () => {
  try {
    const data = localStorage.getItem(MANUAL_INTERACTIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading manual interactions:", error);
    return {};
  }
};

/**
 * Track which users have viewed which manuals to prevent duplicate view counts
 */
const VIEW_TRACKING_KEY = "manualViewTracking";

const getViewTracking = () => {
  try {
    const data = localStorage.getItem(VIEW_TRACKING_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading view tracking:", error);
    return {};
  }
};

const saveViewTracking = (tracking) => {
  try {
    localStorage.setItem(VIEW_TRACKING_KEY, JSON.stringify(tracking));
  } catch (error) {
    console.error("Error saving view tracking:", error);
  }
};

const hasUserViewedManual = (manualId, userId) => {
  if (!userId) return false;
  const tracking = getViewTracking();
  const key = `${manualId}_${userId}`;
  return tracking[key] === true;
};

const markManualAsViewed = (manualId, userId) => {
  if (!userId) return;
  const tracking = getViewTracking();
  const key = `${manualId}_${userId}`;
  tracking[key] = true;
  saveViewTracking(tracking);
};

/**
 * Save manual interactions to localStorage
 */
const saveManualInteractions = (interactions) => {
  try {
    localStorage.setItem(MANUAL_INTERACTIONS_KEY, JSON.stringify(interactions));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("manualInteractionsUpdated"));
  } catch (error) {
    console.error("Error saving manual interactions:", error);
  }
};

/**
 * Get interaction data for a specific manual
 */
export const getManualStats = (manualId) => {
  const interactions = getManualInteractions();
  return (
    interactions[manualId] || {
      views: 0,
      likes: 0,
      downloads: 0,
      hasLiked: false,
    }
  );
};

/**
 * Increment view count for a manual (only once per user)
 */
export const incrementViews = (manualId, userId = null) => {
  // If userId is provided, check if user has already viewed this manual
  if (userId && hasUserViewedManual(manualId, userId)) {
    // User has already viewed this manual, return current count without incrementing
    const stats = getManualStats(manualId);
    return stats.views;
  }

  const interactions = getManualInteractions();
  const manualData = interactions[manualId] || {
    views: 0,
    likes: 0,
    downloads: 0,
    likedBy: [],
  };

  manualData.views = (manualData.views || 0) + 1;
  interactions[manualId] = manualData;
  saveManualInteractions(interactions);

  // Mark this manual as viewed by this user
  if (userId) {
    markManualAsViewed(manualId, userId);
  }

  return manualData.views;
};

/**
 * Toggle like for a manual (user-specific)
 */
export const toggleLike = (manualId, userId) => {
  if (!userId) return { likes: 0, isLiked: false };

  const interactions = getManualInteractions();
  const manualData = interactions[manualId] || {
    views: 0,
    likes: 0,
    downloads: 0,
    likedBy: [],
  };

  // Ensure likedBy is an array
  if (!manualData.likedBy) {
    manualData.likedBy = [];
  }

  const userIdNum = parseInt(userId);
  const isLiked = manualData.likedBy.includes(userIdNum);

  if (isLiked) {
    // Unlike
    manualData.likedBy = manualData.likedBy.filter((id) => id !== userIdNum);
    manualData.likes = Math.max(0, (manualData.likes || 0) - 1);
  } else {
    // Like
    manualData.likedBy.push(userIdNum);
    manualData.likes = (manualData.likes || 0) + 1;
  }

  interactions[manualId] = manualData;
  saveManualInteractions(interactions);

  return {
    likes: manualData.likes,
    isLiked: !isLiked,
  };
};

/**
 * Increment download count for a manual
 */
export const incrementDownloads = (manualId) => {
  const interactions = getManualInteractions();
  const manualData = interactions[manualId] || {
    views: 0,
    likes: 0,
    downloads: 0,
    hasLiked: false,
  };

  manualData.downloads = (manualData.downloads || 0) + 1;
  interactions[manualId] = manualData;
  saveManualInteractions(interactions);

  return manualData.downloads;
};

/**
 * Get all bookmarks (user-specific bookmarks with metadata)
 */
export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return {};
  }
};

/**
 * Save bookmarks to localStorage
 */
const saveBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    window.dispatchEvent(new Event("bookmarksUpdated"));
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
};

/**
 * Check if a manual is bookmarked by a specific user
 */
export const isBookmarked = (manualId, userId) => {
  if (!userId) return false;
  const bookmarks = getBookmarks();
  const key = `${manualId}_${userId}`;
  return bookmarks[key] !== undefined;
};

/**
 * Get all users who bookmarked a specific manual
 */
export const getUsersWhoBookmarked = (manualId) => {
  const bookmarks = getBookmarks();
  const users = [];

  Object.keys(bookmarks).forEach((key) => {
    const [mId, uId] = key.split("_");
    if (mId === String(manualId)) {
      users.push(parseInt(uId));
    }
  });

  return users;
};

/**
 * Toggle bookmark for a manual (user-specific with notification support)
 */
export const toggleBookmark = (manualId, userId) => {
  if (!userId) return false;

  const bookmarks = getBookmarks();
  const key = `${manualId}_${userId}`;
  const isCurrentlyBookmarked = bookmarks[key] !== undefined;

  if (isCurrentlyBookmarked) {
    // Remove bookmark
    delete bookmarks[key];
  } else {
    // Add bookmark
    bookmarks[key] = {
      manualId,
      userId: parseInt(userId),
      bookmarkedAt: new Date().toISOString(),
    };
  }

  saveBookmarks(bookmarks);
  return !isCurrentlyBookmarked;
};

/**
 * Get enhanced manual data with interaction stats for a specific user
 * Merges base manual data with user interaction data
 */
export const getEnhancedManual = (manual, userId = null) => {
  if (!manual) return null;

  const stats = getManualStats(manual.id);
  const bookmarked = userId ? isBookmarked(manual.id, userId) : false;

  // Check if user has liked this manual
  const interactions = getManualInteractions();
  const manualData = interactions[manual.id] || { likedBy: [] };
  const hasLiked =
    userId && manualData.likedBy
      ? manualData.likedBy.includes(parseInt(userId))
      : false;

  return {
    ...manual,
    views: stats.views || 0,
    likes: stats.likes || 0,
    downloads: stats.downloads || 0,
    hasLiked,
    isBookmarked: bookmarked,
  };
};

/**
 * Get enhanced manuals array with interaction stats
 */
export const getEnhancedManuals = (manuals, userId = null) => {
  if (!Array.isArray(manuals)) return [];
  return manuals.map((manual) => getEnhancedManual(manual, userId));
};

/**
 * Notify all users who bookmarked a manual that it has been updated
 * Call this when a manual is edited/updated
 */
export const notifyBookmarkedUsers = (manualId, manualTitle) => {
  try {
    const usersToNotify = getUsersWhoBookmarked(manualId);

    if (usersToNotify.length === 0) {
      return;
    }

    // Import addNotification dynamically to avoid circular dependency
    const { addNotification } = require("./notifications");

    usersToNotify.forEach((userId) => {
      addNotification({
        userId,
        message: `Manual "${manualTitle}" that you bookmarked has been updated!`,
        type: "info",
        link: `/manual/${manualId}`,
      });
    });

    console.log(
      `Notified ${usersToNotify.length} users about update to "${manualTitle}"`
    );
  } catch (error) {
    console.error("Error notifying bookmarked users:", error);
  }
};
