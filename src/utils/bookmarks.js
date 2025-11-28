const KEY = "quickhelp_bookmarks";

// Load bookmarks from localStorage
function loadBookmarks() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load bookmarks:", e);
    return [];
  }
}

// Save bookmarks to localStorage
function saveBookmarks(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save bookmarks:", e);
  }
}

/**
 * Check if a user has bookmarked a manual
 */
export function isManualBookmarked(userId, manualId) {
  if (!userId || manualId == null) return false;
  const idStr = String(manualId);
  const bookmarks = loadBookmarks();
  return bookmarks.some(
    (b) => String(b.userId) === String(userId) && String(b.manualId) === idStr
  );
}

/**
 * Toggle bookmark status for a manual
 * @returns {boolean} true if bookmarked, false if unbookmarked
 */
export function toggleBookmark(userId, manual) {
  if (!userId || !manual || manual.id == null) {
    console.warn("toggleBookmark: missing user or manual", { userId, manual });
    return false;
  }

  const idStr = String(manual.id);
  const bookmarks = loadBookmarks();
  const index = bookmarks.findIndex(
    (b) => String(b.userId) === String(userId) && String(b.manualId) === idStr
  );

  let isBookmarkedNow = false;

  if (index === -1) {
    // Add bookmark
    bookmarks.push({
      userId: String(userId),
      manualId: idStr,
      manualTitle: manual.title || "",
      createdAt: new Date().toISOString(),
    });
    isBookmarkedNow = true;
  } else {
    // Remove bookmark
    bookmarks.splice(index, 1);
    isBookmarkedNow = false;
  }

  saveBookmarks(bookmarks);
  // Dispatch event for other components to listen
  window.dispatchEvent(new Event("bookmarksChanged"));

  return isBookmarkedNow;
}

/**
 * Get list of user IDs who bookmarked a manual (for notifications)
 */
export function getUsersWhoBookmarkedManual(manualId) {
  if (manualId == null) return [];
  const idStr = String(manualId);
  const bookmarks = loadBookmarks();
  const users = bookmarks
    .filter((b) => String(b.manualId) === idStr)
    .map((b) => String(b.userId));
  // Remove duplicates
  return Array.from(new Set(users));
}

/**
 * Get all bookmarks for a specific user
 */
export function getUserBookmarks(userId) {
  if (!userId) return [];
  const bookmarks = loadBookmarks();
  return bookmarks.filter((b) => String(b.userId) === String(userId));
}
