import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="app">
      <main className="app__content">
        <div className="app__content_inner">
          <h1 className="app__title">영화 목록</h1>

          <MovieGrid movies={movies} />

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