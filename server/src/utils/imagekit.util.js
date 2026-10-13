import ImageKit from 'imagekit';
import 'dotenv/config';

let imagekitInstance = null;

/**
 * Returns a singleton ImageKit instance, initializing on first invocation
 * to avoid top-level ESM module hoisting issues with process.env.
 */
export const getImageKitInstance = () => {
  if (!imagekitInstance) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error(
        '[ImageKit Error] Missing credentials in environment variables. ' +
          'Ensure IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT are configured in your backend .env file.'
      );
    }

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }

  return imagekitInstance;
};

/**
 * Generates authentication parameters for secure frontend direct uploads
 * (signature, token, expire)
 */
export const getAuthParameters = () => {
  return getImageKitInstance().getAuthenticationParameters();
};

/**
 * Purges an asset from ImageKit by its unique fileId
 * @param {string} fileId - The ImageKit file identifier
 */
export const deleteImageKitFile = async (fileId) => {
  if (!fileId) return;

  try {
    const ik = getImageKitInstance();
    await ik.deleteFile(fileId);
  } catch (error) {
    console.error(
      `[ImageKit Purge Warning] Could not remove file (${fileId}):`,
      error.message
    );
  }
};

// Proxies default calls to the lazily initialized client
const imagekit = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getImageKitInstance();
      const value = instance[prop];
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  }
);

export default imagekit;