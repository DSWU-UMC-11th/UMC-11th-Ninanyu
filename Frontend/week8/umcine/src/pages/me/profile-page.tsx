import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { useFavoritesQuery } from "@/hooks/use-favorites-query";
import { useMeQuery } from "@/hooks/use-me-query";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

const sectionTitleClass = "text-[17px] leading-5 font-bold text-[#17191E]";
const PAGE_SIZE = 10;

export function ProfilePage() {
  const meQuery = useMeQuery();
  const profile = meQuery.data;

  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = favorites.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // 서버는 movieId만 주기 때문에 제목/포스터는 TMDB 상세로 채워요.
  // 상세 페이지와 같은 queryKey라 캐시를 같이 써요.
  const movieQueries = useQueries({
    queries: pageItems.map((item) => ({
      queryKey: ["movies", "detail", item.movieId],
      queryFn: () => getMovieDetail(item.movieId),
    })),
  });

  return (
    <main className="min-h-[calc(100vh-91px)] w-full bg-[#F6F7F9] font-['Pretendard']">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-20 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[31px] leading-[37px] font-bold tracking-[-1.24px] text-[#17191E]">
            내 정보
          </h1>
          <Link
            to="/me/edit"
            style={{ color: "#ffffff" }}
            className="inline-flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8]"
          >
            정보 수정
          </Link>
        </div>

        <section className="flex flex-col gap-4 border-y border-[#E3E6EB] py-3">
          <h2 className={sectionTitleClass}>기본 정보</h2>

          {meQuery.isError && (
            <p className="text-[12px] leading-[14px] text-[#DC2626]">
              내 정보를 불러오지 못했어요.
            </p>
          )}

          <div className="flex items-center gap-7">
            <span className="flex size-[82px] shrink-0 items-center justify-center rounded-full bg-[#E3E6EB]">
              <img
                className="size-12"
                src="/icons/person.svg"
                alt=""
                aria-hidden="true"
              />
            </span>

            <div className="flex w-full max-w-[760px] items-start gap-7">
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-[11px] leading-[13px] text-[#969DA8]">
                  닉네임
                </span>
                <strong className="text-[14px] leading-[17px] font-bold text-[#17191E]">
                  {meQuery.isLoading
                    ? "불러오는 중..."
                    : (profile?.nickname ?? "-")}
                </strong>
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-[11px] leading-[13px] text-[#969DA8]">
                  이메일
                </span>
                <strong className="text-[14px] leading-[17px] font-bold text-[#17191E]">
                  {meQuery.isLoading
                    ? "불러오는 중..."
                    : (profile?.email ?? "-")}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="flex flex-col gap-4">
          <h2 className={sectionTitleClass}>내 즐겨찾기</h2>

          {favoritesQuery.isError && (
            <p className="text-[12px] leading-[14px] text-[#DC2626]">
              즐겨찾기를 불러오지 못했어요.
            </p>
          )}

          {favoritesQuery.isLoading && (
            <p className="text-sm text-[#606774]">불러오는 중...</p>
          )}

          {favoritesQuery.isSuccess && favorites.length === 0 && (
            <p className="text-sm text-[#606774]">
              아직 즐겨찾기한 영화가 없어요.
            </p>
          )}

          <div className="grid grid-cols-5 gap-x-[18px] gap-y-4">
            {pageItems.map((item, index) => {
              const movieQuery = movieQueries[index];
              const movie = movieQuery?.data;
              const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

              return (
                <Link
                  key={item.favoriteId}
                  to="/movies/$movieId"
                  params={{ movieId: String(item.movieId) }}
                  className="flex flex-col gap-1"
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
                  <div className="pt-[5px] text-[14px] leading-[17px] font-extrabold text-[#17191E]">
                    {movieQuery?.isError
                      ? "영화 정보를 불러오지 못했어요."
                      : (movie?.title ?? "불러오는 중...")}
                  </div>
                  <div className="text-[12px] leading-[14px] text-[#969DA8]">
                    {movie?.release_date?.replaceAll("-", ".") ?? ""}
                  </div>
                </Link>
              );
            })}
          </div>

          <nav
            aria-label="즐겨찾기 페이지"
            className="mt-3 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              aria-label="이전 페이지"
              className="disabled:opacity-40"
            >
              <img
                className="size-6"
                src="/icons/chevron-left.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              aria-current="page"
              style={{ color: "#ffffff" }}
              className="size-9 rounded-[7px] bg-[#17191E] text-[13px] leading-4 font-bold"
            >
              {currentPage}
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              aria-label="다음 페이지"
              className="disabled:opacity-40"
            >
              <img
                className="size-6"
                src="/icons/chevron-right.svg"
                alt=""
                aria-hidden="true"
              />
            </button>
          </nav>
        </section>
      </div>
    </main>
  );
}