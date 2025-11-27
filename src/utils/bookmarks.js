// Bookmark management utility
// Stores user bookmarks in localStorage with user-specific tracking

const STORAGE_KEY = "quickhelp_bookmarks";

/**
 * Load all bookmarks from localStorage
 * Returns array of bookmark objects: { userId, manualId, createdAt, manualTitle }
 */
function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load bookmarks", err);
    return [];
  }
}

/**
 * Save bookmarks array to localStorage
 */
function saveBookmarks(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("bookmarksChanged"));
  } catch (err) {
    console.error("Failed to save bookmarks", err);
  }
}

/**
 * Check if a specific user has bookmarked a specific manual
 * @param {number|string} userId - The user's ID
 * @param {number|string} manualId - The manual's ID
 * @returns {boolean}
 */
export function isManualBookmarked(userId, manualId) {
  if (!userId || !manualId) return false;
  const bookmarks = loadBookmarks();
  return bookmarks.some(
    (b) =>
      String(b.userId) === String(userId) &&
      String(b.manualId) === String(manualId)
  );
}

/**
 * Toggle bookmark for a user and manual
 * @param {number|string} userId - The user's ID
 * @param {object} manual - The manual object (must have id and title)
 * @returns {boolean} - true if bookmarked, false if unbookmarked
 */
export function toggleBookmark(userId, manual) {
  if (!userId || !manual || !manual.id) {
    console.warn("Invalid userId or manual for bookmark toggle");
    return false;
  }

  const bookmarks = loadBookmarks();
  const existingIndex = bookmarks.findIndex(
    (b) =>
      String(b.userId) === String(userId) &&
      String(b.manualId) === String(manual.id)
  );

  if (existingIndex !== -1) {
    // Remove bookmark
    bookmarks.splice(existingIndex, 1);
    saveBookmarks(bookmarks);
    return false;
  } else {
    // Add bookmark
    bookmarks.push({
      userId: String(userId),
      manualId: String(manual.id),
      manualTitle: manual.title || "Untitled Manual",
      createdAt: new Date().toISOString(),
    });
    saveBookmarks(bookmarks);
    return true;
  }
}

/**
 * Get all user IDs who have bookmarked a specific manual
 * @param {number|string} manualId - The manual's ID
 * @returns {string[]} - Array of user IDs
 */
export function getUsersWhoBookmarkedManual(manualId) {
  if (!manualId) return [];
  const bookmarks = loadBookmarks();
  return bookmarks
    .filter((b) => String(b.manualId) === String(manualId))
    .map((b) => b.userId);
}

/**
 * Get all bookmarks for a specific user
 * @param {number|string} userId - The user's ID
 * @returns {array} - Array of bookmark objects
 */
export function getUserBookmarks(userId) {
  if (!userId) return [];
  const bookmarks = loadBookmarks();
  return bookmarks.filter((b) => String(b.userId) === String(userId));
}

/**
 * Clear all bookmarks (for testing/admin purposes)
 */
export function clearAllBookmarks() {
  saveBookmarks([]);
}
