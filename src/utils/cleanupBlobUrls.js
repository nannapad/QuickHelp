// Utility to clean up invalid blob URLs from localStorage
// This runs on app initialization to prevent ERR_FILE_NOT_FOUND errors

/**
 * Checks if a URL is a blob URL
 */
export const isBlobUrl = (url) => {
  return typeof url === "string" && url.startsWith("blob:");
};

/**
 * Checks if a URL is valid (not a stale blob URL)
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;

  // Valid URLs: data URIs, http/https URLs
  return (
    url.startsWith("data:") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/") // relative paths
  );
};

/**
 * Clean blob URLs from an object (recursively)
 */
export const cleanBlobUrlsFromObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanBlobUrlsFromObject(item));
  }

  const cleaned = { ...obj };

  for (const key in cleaned) {
    const value = cleaned[key];

    if (typeof value === "string" && isBlobUrl(value)) {
      // Remove blob URLs - set to null or empty string
      cleaned[key] = null;
      console.log(`Cleaned stale blob URL from ${key}`);
    } else if (typeof value === "object" && value !== null) {
      // Recursively clean nested objects
      cleaned[key] = cleanBlobUrlsFromObject(value);
    }
  }

  return cleaned;
};

/**
 * Clean up blob URLs from localStorage
 * Run this on app initialization
 */
export const cleanupLocalStorageBlobUrls = () => {
  try {
    console.log("🧹 Cleaning up stale blob URLs from localStorage...");

    // Keys that might contain blob URLs
    const keysToClean = ["customManuals", "userData", "quickhelp_users"];

    let totalCleaned = 0;

    keysToClean.forEach((key) => {
      const data = localStorage.getItem(key);
      if (!data) return;

      try {
        const parsed = JSON.parse(data);
        const cleaned = cleanBlobUrlsFromObject(parsed);

        // Only update if something changed
        if (JSON.stringify(parsed) !== JSON.stringify(cleaned)) {
          localStorage.setItem(key, JSON.stringify(cleaned));
          totalCleaned++;
          console.log(`✅ Cleaned blob URLs from ${key}`);
        }
      } catch (e) {
        console.warn(`Failed to clean ${key}:`, e);
      }
    });

    if (totalCleaned > 0) {
      console.log(`✅ Cleaned ${totalCleaned} localStorage keys`);
    } else {
      console.log("✅ No stale blob URLs found");
    }
  } catch (error) {
    console.error("Error cleaning up blob URLs:", error);
  }
};

/**
 * Validate and clean an image URL before rendering
 */
export const getSafeImageUrl = (url, fallback = null) => {
  if (!url) return fallback;

  if (isBlobUrl(url)) {
    console.warn("Attempted to use stale blob URL:", url);
    return fallback;
  }

  if (!isValidImageUrl(url)) {
    console.warn("Invalid image URL:", url);
    return fallback;
  }

  return url;
};

export default {
  isBlobUrl,
  isValidImageUrl,
  cleanBlobUrlsFromObject,
  cleanupLocalStorageBlobUrls,
  getSafeImageUrl,
};
