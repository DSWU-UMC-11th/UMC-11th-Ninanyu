import type { Movie } from "../../types/movie";
import { MovieCard } from "../movie-card/movie-card";
import "./movie-grid.css";

interface MovieGridProps {
  movies: Movie[];
  bookmarkedIds: Set<number>;
  onToggleBookmark: (id: number) => void;
}

export function MovieGrid({ movies, bookmarkedIds, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.has(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </ul>
  );
}
