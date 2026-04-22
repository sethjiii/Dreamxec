const AppError = require("../../utils/AppError");

const INDIAN_COLLEGES_API_BASE = "https://indian-colleges-list.vercel.app";

/**
 * Fetch institutions/colleges by state and search query
 * Proxies the request to avoid CORS issues on frontend
 */
exports.searchColleges = async (req, res, next) => {
  try {
    const { state, q, limit = 15 } = req.query;

    // Validate input
    if (!state || typeof state !== "string") {
      return next(new AppError("State parameter is required", 400));
    }
    if (!q || typeof q !== "string" || q.trim().length < 3) {
      return next(
        new AppError("Search query must be at least 3 characters", 400),
      );
    }

    const params = new URLSearchParams({
      state: state.trim(),
      q: q.trim(),
      limit: String(limit),
    });

    // Fetch from external API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(
      `${INDIAN_COLLEGES_API_BASE}/api/institutions/search?${params.toString()}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Dreamxec/1.0 (+http://dreamxec.com; +http://dreamxec.com/contact)",
        },
      },
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const payload = await response.json();

    // Normalize response format (could be array, {data: array}, or {results: array})
    let rawResults = [];
    if (Array.isArray(payload)) {
      rawResults = payload;
    } else if (payload && typeof payload === "object") {
      if (Array.isArray(payload.results)) {
        rawResults = payload.results;
      } else if (Array.isArray(payload.data)) {
        rawResults = payload.data;
      } else if (Array.isArray(payload.institutions)) {
        rawResults = payload.institutions;
      }
    }

    console.log(`[Colleges API] Search for "${q}" in "${state}":`, {
      rawCount: rawResults.length,
      responseKeys: Object.keys(payload || {}),
    });

    // Filter and normalize results (handle both 'name' and 'institution_name' fields)
    const normalizedResults = rawResults
      .filter((item) => item.name || item.institution_name)
      .map((item) => ({
        institution_name: item.name || item.institution_name,
        aicte_id:
          item.id || item.aicte_id
            ? String(item.id || item.aicte_id)
            : undefined,
      }));

    res.json({
      success: true,
      count: normalizedResults.length,
      data: normalizedResults,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      return next(
        new AppError("Request timeout: Colleges search took too long", 504),
      );
    }

    console.error("Colleges search error:", err.message);
    next(
      new AppError(
        err instanceof Error ? err.message : "Failed to fetch colleges",
        500,
      ),
    );
  }
};

/**
 * Fetch states list
 * Proxies the request to avoid CORS issues on frontend
 */
exports.getStates = async (req, res, next) => {
  try {
    // Fetch from external API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(
      `${INDIAN_COLLEGES_API_BASE}/api/institutions/states`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Dreamxec/1.0 (+http://dreamxec.com; +http://dreamxec.com/contact)",
        },
      },
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const payload = await response.json();

    // Normalize response format (could be array or {states: array})
    const states = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && Array.isArray(payload.states)
        ? payload.states
        : [];

    res.json({
      success: true,
      count: states.length,
      data: states,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      return next(
        new AppError("Request timeout: States fetch took too long", 504),
      );
    }

    console.error("States fetch error:", err.message);
    next(
      new AppError(
        err instanceof Error ? err.message : "Failed to fetch states",
        500,
      ),
    );
  }
};
