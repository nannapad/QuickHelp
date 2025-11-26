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
 * Increment view count for a manual
 */
export const incrementViews = (manualId) => {
  const interactions = getManualInteractions();
  const manualData = interactions[manualId] || {
    views: 0,
    likes: 0,
    downloads: 0,
    hasLiked: false,
  };

  manualData.views = (manualData.views || 0) + 1;
  interactions[manualId] = manualData;
  saveManualInteractions(interactions);

  return manualData.views;
};

/**
 * Toggle like for a manual
 */
export const toggleLike = (manualId) => {
  const interactions = getManualInteractions();
  const manualData = interactions[manualId] || {
    views: 0,
    likes: 0,
    downloads: 0,
    hasLiked: false,
  };

  if (manualData.hasLiked) {
    manualData.likes = Math.max(0, (manualData.likes || 0) - 1);
    manualData.hasLiked = false;
  } else {
    manualData.likes = (manualData.likes || 0) + 1;
    manualData.hasLiked = true;
  }

  interactions[manualId] = manualData;
  saveManualInteractions(interactions);

  return {
    likes: manualData.likes,
    hasLiked: manualData.hasLiked,
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
 * Get all bookmarked manual IDs
 */
export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return [];
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
 * Check if a manual is bookmarked
 */
export const isBookmarked = (manualId) => {
  const bookmarks = getBookmarks();
  return bookmarks.includes(manualId);
};

/**
 * Toggle bookmark for a manual
 */
export const toggleBookmark = (manualId) => {
  let bookmarks = getBookmarks();

  if (bookmarks.includes(manualId)) {
    bookmarks = bookmarks.filter((id) => id !== manualId);
  } else {
    bookmarks.push(manualId);
  }

  saveBookmarks(bookmarks);
  return bookmarks.includes(manualId);
};

/**
 * Get enhanced manual data with interaction stats
 * Merges base manual data with user interaction data
 */
export const getEnhancedManual = (manual) => {
  if (!manual) return null;

  const stats = getManualStats(manual.id);
  const bookmarked = isBookmarked(manual.id);

  return {
    ...manual,
    views: (manual.views || 0) + (stats.views || 0),
    likes: (manual.likes || 0) + (stats.likes || 0),
    downloads: (manual.downloads || 0) + (stats.downloads || 0),
    hasLiked: stats.hasLiked || false,
    isBookmarked: bookmarked,
  };
};

/**
 * Get enhanced manuals array with interaction stats
 */
export const getEnhancedManuals = (manuals) => {
  if (!Array.isArray(manuals)) return [];
  return manuals.map((manual) => getEnhancedManual(manual));
};
