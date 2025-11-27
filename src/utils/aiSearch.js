// AI-powered search functionality for manuals

/**
 * Score a manual based on how well it matches the search query
 * @param {string} query - The search query
 * @param {object} manual - The manual object to score
 * @returns {number} - The relevance score
 */
const scoreManual = (query, manual) => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return 0;

  let score = 0;

  // Check title (+3 points)
  const title = (manual.title || "").toLowerCase();
  if (title.includes(lowerQuery)) {
    score += 3;
  }

  // Check tags (+2 points)
  const tags = (manual.tags || []).map((tag) => tag.toLowerCase());
  if (tags.some((tag) => tag.includes(lowerQuery))) {
    score += 2;
  }

  // Check category (+1 point)
  const category = (manual.category || "").toLowerCase();
  if (category.includes(lowerQuery)) {
    score += 1;
  }

  // Check description (+1 point)
  const description = (manual.description || "").toLowerCase();
  if (description.includes(lowerQuery)) {
    score += 1;
  }

  // Check content sections (+1 point for each match)
  const sections = manual.sections || [];
  sections.forEach((section) => {
    const sectionTitle = (section.title || "").toLowerCase();
    const sectionContent = (section.content || "").toLowerCase();

    if (
      sectionTitle.includes(lowerQuery) ||
      sectionContent.includes(lowerQuery)
    ) {
      score += 1;
    }
  });

  return score;
};

/**
 * Generate Thai explanation for why a manual was recommended
 * @param {string} query - The search query
 * @param {object} manual - The recommended manual
 * @param {number} score - The relevance score
 * @returns {string} - Thai explanation text
 */
const generateExplanation = (query, manual, score) => {
  const lowerQuery = query.toLowerCase().trim();
  const reasons = [];

  // Check where the match was found
  const title = (manual.title || "").toLowerCase();
  const tags = (manual.tags || []).map((tag) => tag.toLowerCase());
  const category = (manual.category || "").toLowerCase();
  const description = (manual.description || "").toLowerCase();

  if (title.includes(lowerQuery)) {
    reasons.push("หัวข้อ");
  }

  if (tags.some((tag) => tag.includes(lowerQuery))) {
    reasons.push("แท็ก");
  }

  if (category.includes(lowerQuery)) {
    reasons.push("หมวดหมู่");
  }

  if (description.includes(lowerQuery)) {
    reasons.push("คำอธิบาย");
  }

  const sections = manual.sections || [];
  const hasContentMatch = sections.some((section) => {
    const sectionTitle = (section.title || "").toLowerCase();
    const sectionContent = (section.content || "").toLowerCase();
    return (
      sectionTitle.includes(lowerQuery) || sectionContent.includes(lowerQuery)
    );
  });

  if (hasContentMatch) {
    reasons.push("เนื้อหา");
  }

  const reasonText =
    reasons.length > 0 ? reasons.join(", ") : "เนื้อหาที่เกี่ยวข้อง";

  return `แนะนำ "${manual.title}" เพราะพบคำที่เกี่ยวข้องกับ "${query}" ใน${reasonText} (คะแนนความใกล้เคียง: ${score})`;
};

/**
 * AI-powered search for manuals
 * @param {string} query - The search query
 * @param {array} manuals - Array of manual objects
 * @returns {object} - Object containing results and explanations
 */
export const aiSearchManuals = (query, manuals) => {
  if (!query || !query.trim()) {
    return {
      results: [],
      explanations: [],
    };
  }

  if (!Array.isArray(manuals) || manuals.length === 0) {
    return {
      results: [],
      explanations: [],
    };
  }

  // Score all manuals
  const scoredManuals = manuals
    .map((manual) => ({
      manual,
      score: scoreManual(query, manual),
    }))
    .filter((item) => item.score > 0) // Only include manuals with positive scores
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 3); // Take top 3

  // Generate results and explanations
  const results = scoredManuals.map((item) => item.manual);
  const explanations = scoredManuals.map((item) =>
    generateExplanation(query, item.manual, item.score)
  );

  return {
    results,
    explanations,
  };
};
