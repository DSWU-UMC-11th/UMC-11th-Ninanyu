import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

const STARS = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1440px] px-20 py-24 text-center text-sm text-[#6b7078]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  const bookmarkIconUrl = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <main>
      {/* 상단 backdrop */}
      <section className="relative h-[360px] overflow-hidden bg-[#16181d]">
        <img
          className="absolute inset-0 size-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-20 pb-6 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 self-start text-[13px] font-medium text-white"
          >
            <span
              className="block size-4 bg-white mask-contain mask-center mask-no-repeat"
              style={{
                WebkitMaskImage: "url(/icons/chevron-left.svg)",
                maskImage: "url(/icons/chevron-left.svg)",
              }}
              aria-hidden="true"
            />
            영화 목록
          </Link>

          <div className="text-white">
            <h1 className="text-[44px] font-bold leading-tight tracking-[-0.04em]">
              {movie.title}
            </h1>
            <p className="mt-2 text-sm text-white/90">{movie.originalTitle}</p>
            <p className="mt-1.5 flex gap-3 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto flex max-w-[1440px] gap-8 px-20 py-6">
        <img
          className="h-[286px] w-[200px] shrink-0 rounded-lg bg-[#e4e6ea] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <section className="min-w-0 flex-1 pr-8">
          <h2 className="text-xl font-bold tracking-[-0.03em] text-[#16181d]">
            {movie.tagline}
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-[1.7] text-[#6b7078]">
            {movie.overview}
          </p>

          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((prev) => !prev)}
            className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#2f5bea] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2549c4]"
          >
            <span
              className="block size-4 bg-white mask-contain mask-center mask-no-repeat"
              style={{
                WebkitMaskImage: `url(${bookmarkIconUrl})`,
                maskImage: `url(${bookmarkIconUrl})`,
              }}
              aria-hidden="true"
            />
            즐겨찾기
          </button>
        </section>

        {/* 내 평점 */}
        <aside className="w-[360px] shrink-0 self-start border-l border-[#e4e6ea] pl-8">
          <h2 className="text-xl font-bold tracking-[-0.03em] text-[#16181d]">
            내 평점
          </h2>
          <p className="mt-1.5 text-xs text-[#8a8f98]">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="mt-3 flex gap-1" role="radiogroup" aria-label="별점">
            {STARS.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value}점`}
                onClick={() => setRating(value)}
                className={cn(
                  "inline-flex size-[38px] cursor-pointer items-center justify-center rounded-[10px] border border-[#e4e6ea] bg-white transition-colors hover:bg-[#f5f6f8]",
                  value <= rating ? "text-[#4b4f58]" : "text-[#c9cdd3]",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 fill-current"
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
            className="mt-2 h-[102px] w-full resize-none rounded-lg border border-[#e4e6ea] bg-white p-3 text-[13px] text-[#16181d] outline-none placeholder:text-[#8a8f98] focus:border-[#16181d]"
          />

          <button
            type="button"
            disabled={rating === 0}
            className="mt-2.5 h-10 w-full cursor-pointer rounded-lg bg-[#16181d] text-sm font-bold text-white transition-opacity hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}