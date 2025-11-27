// Search analytics utility for tracking and analyzing user searches

const SEARCH_LOGS_KEY = "quickhelp_search_logs";

/**
 * Log a search query with results count and user information
 * @param {string} query - The search query
 * @param {number} resultsCount - Number of results returned
 * @param {object} user - User object (optional)
 */
export const logSearch = (query, resultsCount, user = null) => {
  try {
    // Normalize the query
    const cleanQuery = query?.trim();

    // Ignore empty strings
    if (!cleanQuery) {
      return;
    }

    // Read existing logs
    const existingLogs = JSON.parse(
      localStorage.getItem(SEARCH_LOGS_KEY) || "[]"
    );

    // Create new log entry
    const logEntry = {
      query: cleanQuery,
      timestamp: Date.now(),
      resultsCount: resultsCount || 0,
      userId: user?.id ?? null,
      role: user?.role ?? null,
    };

    // Add to logs array
    existingLogs.push(logEntry);

    // Write back to localStorage
    localStorage.setItem(SEARCH_LOGS_KEY, JSON.stringify(existingLogs));
  } catch (error) {
    console.error("Error logging search:", error);
  }
};

/**
 * Get search statistics for a given time period
 * @param {object} options - Configuration options
 * @param {number} options.days - Number of days to look back (default: 7)
 * @param {number} options.limit - Maximum number of results to return (default: 5)
 * @returns {array} Array of search statistics sorted by count
 */
export const getSearchStats = ({ days = 7, limit = 5 } = {}) => {
  try {
    // Read all logs
    const allLogs = JSON.parse(localStorage.getItem(SEARCH_LOGS_KEY) || "[]");

    // Calculate time threshold
    const now = Date.now();
    const timeThreshold = now - days * 24 * 60 * 60 * 1000;

    // Filter logs within the time period
    const recentLogs = allLogs.filter((log) => log.timestamp >= timeThreshold);

    // Aggregate by lowercased query
    const aggregated = {};

    recentLogs.forEach((log) => {
      const queryKey = log.query.toLowerCase();

      if (!aggregated[queryKey]) {
        aggregated[queryKey] = {
          query: log.query, // Keep original case for display
          count: 0,
          noResultCount: 0,
        };
      }

      aggregated[queryKey].count += 1;

      if (log.resultsCount === 0) {
        aggregated[queryKey].noResultCount += 1;
      }
    });

    // Convert to array and sort by count (descending)
    const statsArray = Object.values(aggregated).sort(
      (a, b) => b.count - a.count
    );

    // Limit results
    return statsArray.slice(0, limit);
  } catch (error) {
    console.error("Error getting search stats:", error);
    return [];
  }
};

/**
 * Get total number of searches
 * @param {number} days - Number of days to look back (optional)
 * @returns {number} Total search count
 */
export const getTotalSearches = (days = null) => {
  try {
    const allLogs = JSON.parse(localStorage.getItem(SEARCH_LOGS_KEY) || "[]");

    if (days === null) {
      return allLogs.length;
    }

    const now = Date.now();
    const timeThreshold = now - days * 24 * 60 * 60 * 1000;

    return allLogs.filter((log) => log.timestamp >= timeThreshold).length;
  } catch (error) {
    console.error("Error getting total searches:", error);
    return 0;
  }
};

/**
 * Clear old search logs (keep only recent ones)
 * @param {number} days - Number of days to keep (default: 30)
 */
export const cleanupOldLogs = (days = 30) => {
  try {
    const allLogs = JSON.parse(localStorage.getItem(SEARCH_LOGS_KEY) || "[]");

    const now = Date.now();
    const timeThreshold = now - days * 24 * 60 * 60 * 1000;

    const recentLogs = allLogs.filter((log) => log.timestamp >= timeThreshold);

    localStorage.setItem(SEARCH_LOGS_KEY, JSON.stringify(recentLogs));

    return allLogs.length - recentLogs.length; // Return number of deleted logs
  } catch (error) {
    console.error("Error cleaning up logs:", error);
    return 0;
  }
};
