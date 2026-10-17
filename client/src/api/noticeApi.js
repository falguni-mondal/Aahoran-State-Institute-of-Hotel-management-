const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Fetches active notices from the backend CMS.
 *
 * @param {string} category - Optional category filter ('all' or specific categoryId)
 * @returns {Promise<Array>} List of published notice objects
 */
export const getPublicNotices = async (category = 'all') => {
  try {
    const query =
      category && category !== 'all'
        ? `?category=${encodeURIComponent(category)}`
        : '';

    const response = await fetch(`${API_BASE_URL}/notices${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && Array.isArray(data.notices)) {
      return data.notices;
    }

    return [];
  } catch (error) {
    console.error('Failed to retrieve notices from API:', error.message);
    return null; // Returns null on network error so UI can fallback gracefully
  }
};

export default getPublicNotices;