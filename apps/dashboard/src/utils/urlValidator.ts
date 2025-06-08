export const urlValidator = (url: string, fallback?: string): URL => {
  try {
    return new URL(url);
  } catch (error) {
    console.warn(`URL ${url} is invalid.`, error);
    if (fallback) {
      try {
        return new URL(fallback);
      } catch (e) {
        console.warn(`Fallback URL ${fallback} is also invalid.`, e);
      }
    }
    throw error;
  }
};
