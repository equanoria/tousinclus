export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.warn(`URL ${url} is invalid.`, e);
    return false;
  }
};
