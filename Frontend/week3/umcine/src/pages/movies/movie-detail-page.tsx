import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

const STARS = [1, 2, 3, 4, 5];

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

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <main className="mx-auto max-w-[1440px] px-20 py-24 text-center text-sm text-[#606774]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main>
      {/* 상단 backdrop */}
      <section className="relative h-[360px] overflow-hidden bg-[#17191e]">
        <img
          className="absolute inset-0 size-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

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
            <p className="text-sm leading-[17px]">{movie.originalTitle}</p>
            <p className="flex gap-2 text-[13px] font-bold leading-4">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto flex max-w-[1440px] items-start gap-8 px-20 py-6">
        <img
          className="h-[286px] w-[200px] shrink-0 rounded-[10px] bg-[#f6f7f9] object-cover shadow-[0_12px_30px_rgba(12,15,20,0.12)]"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          <h2 className="text-[21px] font-bold leading-[25px] tracking-[-0.63px] text-[#17191e]">
            {movie.tagline}
          </h2>
          <p className="whitespace-pre-line text-sm leading-6 text-[#606774]">
            {movie.overview}
          </p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((prev) => !prev)}
            className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-white bg-[#2563eb] px-4 text-sm font-extrabold text-white transition-colors hover:bg-[#1d4fd0]"
          >
            <MaskIcon
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
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
                <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
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
    </main>
  );
}