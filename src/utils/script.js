/**
 * Loads script as a Promise
 *
 * @param {string} src - Script source
 * @param {boolean} [async=true] - Loads the script asynchronously?
 * @param {string} [type="text/javascript"] - Type of script to load
 *
 * @returns {Promise<Object>}  { loaded: boolean, error: boolean }
 */
export const loadScript = (src, async = true, type = "text/javascript") => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === "undefined") {
        resolve(null);
        return;
      }

      const tag = document.createElement("script");
      const container = document.head || document.body;

      tag.type = type;
      tag.async = async;
      tag.src = src;

      tag.addEventListener("load", () => {
        resolve({ loaded: true, error: false });
      });

      tag.addEventListener("error", () => {
        reject({
          loaded: false,
          error: true,
          message: `Failed to load script with src ${src}`
        });
      });

      container.appendChild(tag);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Loads YouTube API script
 *
 * @returns {Object}
 */
export const loadYoutube = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.YT) {
    return window.YT;
  }

  const youtubePromise = await loadScript("https://www.youtube.com/iframe_api");

  if (youtubePromise.error) {
    throw new Error("Failed to load YouTube script");
  }

  return window.YT;
};
