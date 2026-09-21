import type { Movie } from "../../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  const bookmarkIconUrl = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <li className="movie_card">
      <div className="movie_card_poster_wrap">
        <img
          className="movie_card_poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          loading="lazy"
        />
        <button
          type="button"
          className={
            isBookmarked ? "movie_card_bookmark is_bookmarked" : "movie_card_bookmark"
          }
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <span
            className="movie_card_bookmark_icon"
            style={{
              WebkitMaskImage: `url(${bookmarkIconUrl})`,
              maskImage: `url(${bookmarkIconUrl})`,
            }}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="movie_card_info">
        <p className="movie_card_title">{movie.title}</p>
        <p className="movie_card_date">{movie.releaseDate}</p>
      </div>
    </li>
  );
}