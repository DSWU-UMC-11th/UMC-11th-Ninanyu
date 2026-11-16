import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation"; // 실제 파일명에 맞게 조정
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 모든 카드가 같은 queryKey(["favorites"])를 써서 요청은 한 번만 나가요.
  const favoritesQuery = useFavoritesQuery();
  const isBookmarked =
    favoritesQuery.data?.some((item) => item.movieId === movie.id) ?? false;

  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const handleToggleBookmark = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }
    toggleFavoriteMutation.mutate({
      movieId: movie.id,
      isFavorite: isBookmarked,
    });
  };

  const bookmarkIconUrl = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <li className="w-[242px]">
      <div className="relative h-[272px] w-[242px] overflow-hidden rounded-lg bg-[#e4e6ea]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          {posterUrl && (
            <img
              className="block size-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              loading="lazy"
            />
          )}
        </Link>
        <button
          type="button"
          disabled={toggleFavoriteMutation.isPending}
          className={cn(
            "absolute right-3.5 top-3.5 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60",
            isBookmarked
              ? "border-[#2f5bea] bg-[#2f5bea]"
              : "border-white bg-black hover:bg-[#1a1a1a]",
          )}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={handleToggleBookmark}
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
        <p className="mt-1 text-[13px] text-[#8a8f98]">{movie.release_date}</p>
      </div>
    </li>
  );
}