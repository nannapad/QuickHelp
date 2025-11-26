import { useState, useEffect, useCallback, useRef } from "react";

// Cache utility for storing data
class DataCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, data) {
    const now = Date.now();

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expires: now + this.ttl,
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

const globalCache = new DataCache();

// Hook for data fetching with caching and loading states
export const useAsyncData = (
  fetchFunction,
  dependencies = [],
  options = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    cacheKey,
    useCache = true,
    refreshInterval,
    onSuccess,
    onError,
  } = options;

  const abortControllerRef = useRef(null);

  const fetchData = useCallback(
    async (force = false) => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first if enabled and not forced refresh
        if (useCache && cacheKey && !force) {
          const cachedData = globalCache.get(cacheKey);
          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }

        // Abort previous request if still pending
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const result = await fetchFunction({
          signal: abortControllerRef.current.signal,
        });

        setData(result);

        // Cache the result if caching is enabled
        if (useCache && cacheKey) {
          globalCache.set(cacheKey, result);
        }

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
          if (onError) {
            onError(err);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, cacheKey, useCache, onSuccess, onError]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        fetchData(true); // Force refresh
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
  };
};

// Hook for debounced values (useful for search)
export const useDebounced = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
};

// Preload utility for images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch multiple async operations
export const batchAsync = async (operations, batchSize = 3) => {
  const results = [];

  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((op) => op()));
    results.push(...batchResults);
  }

  return results;
};

export { globalCache };
