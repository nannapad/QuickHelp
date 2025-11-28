import { manuals as STATIC_MANUALS } from "../data/ManualData.jsx";

const CUSTOM_KEY = "customManuals";

// Load custom manuals from localStorage
function loadCustomManuals() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load custom manuals:", e);
    return [];
  }
}

// Save custom manuals to localStorage
function saveCustomManuals(list) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save custom manuals:", e);
  }
}

/**
 * Get all manuals (custom manuals override static ones with same ID)
 * @returns {Array} Combined list of all manuals
 */
export function getAllManuals() {
  const customManuals = loadCustomManuals();

  // Create a Set of custom manual IDs for efficient lookup
  const customIdSet = new Set(customManuals.map((m) => String(m.id)));

  // Filter out static manuals that have been overridden by custom ones
  const staticManualsWithoutOverride = STATIC_MANUALS.filter(
    (m) => !customIdSet.has(String(m.id))
  );

  // Return custom manuals first, then non-overridden static manuals
  return [...customManuals, ...staticManualsWithoutOverride];
}

/**
 * Get a manual by ID (checks custom first, then static)
 * @returns {Object|null} Manual object or null if not found
 */
export function getManualById(id) {
  const allCustom = loadCustomManuals();
  const idStr = String(id);

  // Check custom manuals first
  const custom = allCustom.find((m) => String(m.id) === idStr);
  if (custom) return custom;

  // Fall back to static manuals
  return STATIC_MANUALS.find((m) => String(m.id) === idStr) || null;
}

/**
 * Insert or update a manual
 * - If ID exists: replace it
 * - If ID doesn't exist: add new manual
 */
export function upsertManual(manual) {
  if (!manual || manual.id === undefined || manual.id === null) {
    console.error("Manual must have an id to upsert", manual);
    return;
  }

  const list = loadCustomManuals();
  const idStr = String(manual.id);
  const index = list.findIndex((m) => String(m.id) === idStr);

  if (index === -1) {
    // Add new manual
    list.push(manual);
  } else {
    // Update existing manual
    list[index] = manual;
  }

  saveCustomManuals(list);
  // Dispatch event for components to refresh
  window.dispatchEvent(new Event("manualUpdated"));
}

/**
 * Delete a custom manual by ID
 */
export function deleteManual(id) {
  const idStr = String(id);
  const list = loadCustomManuals();
  const filtered = list.filter((m) => String(m.id) !== idStr);
  saveCustomManuals(filtered);
  window.dispatchEvent(new Event("manualUpdated"));
}
