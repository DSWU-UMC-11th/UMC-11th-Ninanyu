import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

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
    <li className="w-[242px]">
      <div className="relative h-[272px] w-[242px] overflow-hidden rounded-lg bg-[#e4e6ea]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block"
        >
          <img
            className="block size-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            loading="lazy"
          />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute right-3.5 top-3.5 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-150",
            isBookmarked
              ? "border-[#2f5bea] bg-[#2f5bea]"
              : "border-white bg-black hover:bg-[#1a1a1a]",
          )}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <span
            className="block size-4 bg-white mask-contain mask-center mask-no-repeat"
            style={{
              WebkitMaskImage: `url(${bookmarkIconUrl})`,
              maskImage: `url(${bookmarkIconUrl})`,
            }}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-3">
        <p className="m-0 truncate text-[15px] font-bold leading-[1.4] text-[#16181d]">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            className="hover:underline"
          >
            {movie.title}
          </Link>
        </p>
        <p className="mt-1 text-[13px] text-[#8a8f98]">{movie.releaseDate}</p>
      </div>
    </li>
  );
}