import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

type FavoriteMovieCardProps = {
  movieId: number;
};

export function FavoriteMovieCard({ movieId }: FavoriteMovieCardProps) {
  // 영화 상세 페이지와 같은 query key라서 캐시를 공유해요
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
  });

  const movie = movieQuery.data;
  const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

  return (
    <article className="flex flex-col gap-1">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movieId) }}
        className="group flex flex-col gap-1"
      >
        <div className="h-[274px] w-full overflow-hidden rounded-[10px] bg-[#E3E6EB]">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={`${movie?.title} 포스터`}
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="pt-[5px] text-[14px] leading-[17px] font-extrabold text-[#17191E] group-hover:underline">
          {movieQuery.isPending ? "불러오는 중..." : (movie?.title ?? "-")}
        </div>
        <div className="text-[12px] leading-[14px] text-[#969DA8]">
          {movie?.release_date.replaceAll("-", ".") ?? ""}
        </div>
      </Link>
    </article>
  );
}