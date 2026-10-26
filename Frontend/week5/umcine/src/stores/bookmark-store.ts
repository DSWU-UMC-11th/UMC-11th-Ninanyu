import { create } from "zustand";
import { readBookmarkIds, saveBookmarkIds } from "../utils/bookmark-storage";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()((set) => ({
  bookmarkedMovieIds: readBookmarkIds(),
  toggleBookmark: (movieId) =>
    set((state) => ({
      bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
        ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
        : [...state.bookmarkedMovieIds, movieId],
    })),
}));

useBookmarkStore.subscribe((state, prevState) => {
  if (state.bookmarkedMovieIds !== prevState.bookmarkedMovieIds) {
    saveBookmarkIds(state.bookmarkedMovieIds);
  }
});