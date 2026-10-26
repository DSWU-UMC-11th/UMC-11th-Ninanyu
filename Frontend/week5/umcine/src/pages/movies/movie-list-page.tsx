import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { TmdbFooter } from "../../components/layout/tmdb-footer";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="app">
      <main className="app__content">
        <div className="app__content_inner">
          <h1 className="app__title">영화 목록</h1>

          {isLoading && <p>영화 목록을 불러오는 중이에요.</p>}
          {errorMessage && <p>{errorMessage}</p>}
          {!isLoading && !errorMessage && <MovieGrid movies={movies} />}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <TmdbFooter />
    </div>
  );
}