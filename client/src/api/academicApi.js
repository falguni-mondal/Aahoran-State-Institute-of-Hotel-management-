const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const getPublicResults = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/results`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return json.status === 'success' && Array.isArray(json.data) ? json.data : null;
  } catch (error) {
    console.error('Failed to retrieve results:', error.message);
    return null;
  }
};

export const getPublicStudyMaterials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/study-materials`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return json.status === 'success' && Array.isArray(json.materials)
      ? json.materials
      : null;
  } catch (error) {
    console.error('Failed to retrieve study materials:', error.message);
    return null;
  }
};

export const getPublicSyllabi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/syllabus`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return json.status === 'success' && Array.isArray(json.syllabi)
      ? json.syllabi
      : null;
  } catch (error) {
    console.error('Failed to retrieve syllabi:', error.message);
    return null;
  }
};