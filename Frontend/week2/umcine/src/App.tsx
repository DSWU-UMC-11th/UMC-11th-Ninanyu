import { useMemo, useState } from "react";
import { Header } from "./components/header/header";
import { MovieGrid } from "./components/movie-grid/movie-grid";
import { Pagination } from "./components/pagination/pagination";
import { movies } from "./data/movies";
import "./App.css";

export default function App() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(
    () =>
      new Set(
        movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id),
      ),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const visibleMovies = useMemo(() => movies, []);

  return (
    <div className="app">
      <Header />

      <main className="app__content">
        <div className="app__content_inner">
          <h1 className="app__title">영화 목록</h1>

          <MovieGrid
            movies={visibleMovies}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <footer className="app__footer">
        <img
          className="app__footer_logo"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          TMDB
        </a>
        .
      </footer>
    </div>
  );
}