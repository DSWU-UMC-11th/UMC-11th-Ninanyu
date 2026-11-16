const BOOKMARK_STORAGE_KEY = "umcine-bookmark-store";

export function readBookmarkIds(): number[] {
  try {
    const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === "number" &&
        Number.isInteger(movieId) &&
        movieId > 0,
    );
  } catch {
    return [];
  }
}

export function saveBookmarkIds(movieIds: number[]) {
  try {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
  } catch {
  }
}