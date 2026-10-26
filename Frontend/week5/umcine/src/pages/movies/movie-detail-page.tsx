import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

const STARS = [1, 2, 3, 4, 5];

function formatRuntime(runtime: number | null) {
  if (typeof runtime !== "number" || runtime <= 0) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

function MaskIcon({ src, className }: { src: string; className?: string }) {
  const url = `url(${src})`;

  return (
    <span
      className={cn("block shrink-0 bg-current", className)}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      aria-hidden="true"
    />
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col">
      <main className="flex-1">{children}</main>
      <TmdbFooter />
    </div>
  );
}

function StatusMessage({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <p className="mx-auto max-w-[1440px] px-20 py-24 text-center text-sm text-[#606774]">
        {children}
      </p>
    </PageShell>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!isValidMovieId) {
    return <StatusMessage>올바르지 않은 영화 번호예요.</StatusMessage>;
  }

  if (isLoading) {
    return <StatusMessage>불러오는 중...</StatusMessage>;
  }

  if (errorMessage || !movie) {
    return (
      <StatusMessage>
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </StatusMessage>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <PageShell>
      {/* 상단 backdrop */}
      <section className="relative h-[360px] overflow-hidden bg-[#17191e]">
        {backdropUrl && (
          <img
            className="absolute inset-0 size-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        )}

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-20 py-6">
          <Link
            to="/"
            style={{ color: "#ffffff" }}
            className="inline-flex items-center gap-1 self-start text-[13px] font-bold"
          >
            <MaskIcon src="/icons/chevron-left.svg" className="size-6" />
            영화 목록
          </Link>

          <div className="flex max-w-[800px] flex-col gap-2 text-white">
            <h1 className="text-[46px] font-bold leading-[50px] tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm leading-[17px]">{movie.original_title}</p>
            <p className="flex gap-2 text-[13px] font-bold leading-4">
              <span>{movie.release_date}</span>
              {genreText && <span>{genreText}</span>}
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto flex max-w-[1440px] items-start gap-8 px-20 py-6">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-[#e4e6ea] shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
          {posterUrl && (
            <img
              className="size-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          )}
        </div>

        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          {movie.tagline && (
            <h2 className="text-[21px] font-bold leading-[25px] tracking-[-0.63px] text-[#17191e]">
              {movie.tagline}
            </h2>
          )}
          <p className="whitespace-pre-line text-sm leading-6 text-[#606774]">
            {movie.overview}
          </p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white bg-[#2563eb] px-4 text-sm font-extrabold text-white transition-colors hover:bg-[#1d4fd0]"
          >
            <MaskIcon
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              className="size-4"
            />
            즐겨찾기
          </button>
        </section>

        {/* 내 평점 */}
        <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-[41px] pl-[30px]">
          <h2 className="text-[21px] font-bold leading-[25px] tracking-[-0.63px] text-[#17191e]">
            내 평점
          </h2>
          <p className="text-xs leading-[14px] text-[#969da8]">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="flex gap-1" role="radiogroup" aria-label="영화 별점">
            {STARS.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value}점`}
                onClick={() => setRating(value)}
                className={cn(
                  "inline-flex size-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white transition-colors hover:bg-[#f6f7f9]",
                  value <= rating ? "text-[#17191e]" : "text-[#606774]",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z" />
                </svg>
              </button>
            ))}
          </div>

          <textarea
            aria-label="후기"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            value={review}
            onChange={(event) => setReview(event.target.value)}
            className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-5 text-[#17191e] outline-none placeholder:text-[#969da8] focus:border-[#17191e]"
          />

          <button
            type="button"
            disabled={rating === 0}
            className="h-[42px] w-full cursor-pointer rounded-lg border border-white bg-[#17191e] px-4 text-sm font-extrabold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </PageShell>
  );
}