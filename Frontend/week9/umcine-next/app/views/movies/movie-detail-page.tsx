"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMemberRatings } from "../../api/ratings/ratings";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { useFavoriteStatusQuery } from "../../hooks/use-favorite-status-query"; // 실제 파일명에 맞게 조정
import { useMemberId } from "../../hooks/use-member-id";
import {
  useDeleteRatingMutation,
  useSaveRatingMutation,
} from "../../hooks/use-rating-mutation";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation"; // 실제 파일명에 맞게 조정
import { useAuthStore } from "../../stores/auth-store";
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
  const params = useParams<{ movieId: string }>();
  const movieId = Number(params.movieId);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // 훅은 모두 early return보다 위에서 호출해야 해요.
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = useMemberId();
  const saveRatingMutation = useSaveRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  // 즐겨찾기: 서버 상태를 기준으로 해요.
  const favoriteStatusQuery = useFavoriteStatusQuery(movieId);
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const isBookmarked = favoriteStatusQuery.data?.isFavorite ?? false;

  // 내 평점 목록에서 이 영화의 평점을 찾아요. 있으면 저장 시 수정으로 보내요.
  const ratingsQuery = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
  });
  const myRating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  // 기존 평점이 있으면 입력값을 채워요.
  useEffect(() => {
    if (myRating) {
      setRating(myRating.score);
      setReview(myRating.comment ?? "");
    }
  }, [myRating?.ratingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSaving = saveRatingMutation.isPending;
  const isDeleting = deleteRatingMutation.isPending;

  const handleToggleFavorite = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }
    toggleFavoriteMutation.mutate({ movieId, isFavorite: isBookmarked });
  };

  const handleSaveRating = () => {
    if (rating === 0) return;

    saveRatingMutation.mutate(
      {
        movieId,
        ratingId: myRating?.ratingId,
        body: { score: rating, comment: review },
      },
      {
        onSuccess: () => alert("평점을 저장했어요."),
      },
    );
  };

  const handleDeleteRating = () => {
    if (!myRating) return;
    if (!window.confirm("평점을 삭제할까요?")) return;

    deleteRatingMutation.mutate(myRating.ratingId, {
      onSuccess: () => {
        setRating(0);
        setReview("");
        alert("평점을 삭제했어요.");
      },
    });
  };

  if (!isValidMovieId) {
    return <StatusMessage>올바르지 않은 영화 번호예요.</StatusMessage>;
  }

  if (movieDetailQuery.isPending) {
    return <StatusMessage>불러오는 중...</StatusMessage>;
  }

  if (movieDetailQuery.isError) {
    return (
      <StatusMessage>
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </StatusMessage>
    );
  }

  const movie = movieDetailQuery.data;
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
            href="/"
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
            disabled={toggleFavoriteMutation.isPending}
            onClick={handleToggleFavorite}
            className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white bg-[#2563eb] px-4 text-sm font-extrabold text-white transition-colors hover:bg-[#1d4fd0] disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={rating === 0 || isSaving || isDeleting}
            onClick={handleSaveRating}
            className="h-[42px] w-full cursor-pointer rounded-lg border border-white bg-[#17191e] px-4 text-sm font-extrabold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? "저장 중..." : myRating ? "평점 수정" : "평점 저장"}
          </button>

          {myRating && (
            <button
              type="button"
              disabled={isSaving || isDeleting}
              onClick={handleDeleteRating}
              className="h-[42px] w-full cursor-pointer rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm font-extrabold text-[#17191e] hover:bg-[#f6f7f9] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isDeleting ? "삭제 중..." : "평점 삭제"}
            </button>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
