const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Fetches the active mentors directory from the backend CMS.
 * Uses native fetch with automatic error handling.
 *
 * @returns {Promise<Array>} List of published mentor objects
 */
export const getPublicMentors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mentors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'success' && Array.isArray(data.mentors)) {
      return data.mentors;
    }

    return [];
  } catch (error) {
    console.error('Failed to retrieve mentors from API:', error.message);
    return [];
  }
};

export default getPublicMentors;