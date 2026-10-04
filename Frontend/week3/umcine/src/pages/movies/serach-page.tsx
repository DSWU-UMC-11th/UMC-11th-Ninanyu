import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { Pagination } from "../../components/movies/pagination";
import { cn } from "../../utils/cn";

const PAGE_SIZE = 20;

interface SearchFormProps {
  variant: "hero" | "compact";
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

function SearchForm({ variant, value, onChange, onSubmit }: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isHero = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex items-center gap-3 bg-white",
        isHero
          ? "h-[74px] rounded-[14px] border-2 border-[#16181d] pl-5 pr-4 shadow-[0_8px_24px_rgba(22,24,29,0.08)]"
          : "h-[54px] rounded-xl border border-[#e4e6ea] pl-5 pr-1.5 shadow-sm focus-within:border-[#16181d]",
      )}
    >
      <img
        className="size-5 shrink-0"
        src="/icons/search.svg"
        alt=""
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-[#16181d] outline-none placeholder:font-normal placeholder:text-[#8a8f98]",
          isHero ? "text-base" : "text-sm font-semibold",
        )}
      />

      {!isHero && value && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#4b4f58] hover:bg-[#f5f6f8]"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      <button
        type="submit"
        className={cn(
          "h-[42px] shrink-0 cursor-pointer rounded-lg bg-[#16181d] text-sm font-bold text-white hover:bg-black",
          isHero ? "px-[18px]" : "px-4",
        )}
      >
        {isHero ? "검색" : "다시 검색"}
      </button>
    </form>
  );
}

export function SearchPage() {
  const { query, page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const hasQuery = normalizedQuery !== "";

  const searchResults = hasQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedResults = searchResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handlePageChange(nextPage: number) {
    navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage > 1 ? nextPage : undefined,
      }),
    });
    window.scrollTo({ top: 0 });
  }

  if (!hasQuery) {
    return (
      <main className="mx-auto w-full max-w-[1000px] px-[72px] pt-32">
        <h1 className="mb-9 text-center text-[46px] font-bold leading-[52px] tracking-[-0.05em] text-[#17191e]">
          어떤 영화를 찾고 있나요?
        </h1>
        <SearchForm
          variant="hero"
          value={searchText}
          onChange={setSearchText}
          onSubmit={handleSubmit}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-20 pb-16 pt-6">
      <h1 className="mb-5 text-[40px] font-extrabold leading-tight tracking-[-0.04em] text-[#16181d]">
        영화 검색
      </h1>

      <SearchForm
        variant="compact"
        value={searchText}
        onChange={setSearchText}
        onSubmit={handleSubmit}
      />

      <div className="mt-5 flex items-center justify-between border-b border-[#e4e6ea] pb-4">
        <h2 className="text-lg font-bold tracking-[-0.02em] text-[#16181d]">
          ‘{query}’ 검색 결과
        </h2>
        <p className="text-xs text-[#8a8f98]">
          영화 {searchResults.length}편 · {currentPage}페이지
        </p>
      </div>

      {searchResults.length === 0 ? (
        <p className="py-24 text-center text-sm text-[#6b7078]">
          영화를 찾을 수 없어요.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
            {pagedResults.map((movie) => (
              <li
                key={movie.id}
                className="flex gap-[18px] border-b border-[#e4e6ea] pb-7 pt-5"
              >
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="block shrink-0"
                >
                  <img
                    className="block h-[190px] w-[126px] rounded-lg bg-[#e4e6ea] object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    loading="lazy"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col pt-2">
                  <h3 className="truncate text-xl font-bold tracking-[-0.02em] text-[#16181d]">
                    {movie.title}
                  </h3>
                  <p className="mt-2 flex gap-2 text-[13px] text-[#8a8f98]">
                    <span className="truncate">{movie.originalTitle}</span>
                    <span className="shrink-0">{movie.releaseDate}</span>
                  </p>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-[1.6] text-[#6b7078]">
                    {movie.overview}
                  </p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-auto inline-flex items-center gap-1.5 self-start pb-1 text-[13px] font-bold text-[#2f5bea] hover:underline"
                  >
                    상세 보기
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}
