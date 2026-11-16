import { Link } from "@tanstack/react-router";
import { useMeQuery } from "@/hooks/use-me-query";

const FAVORITE_MOVIES = [
  { id: 1, title: "스파이더맨: 브랜드 뉴 데이", date: "2026.07.29", posterUrl: "" },
  { id: 2, title: "오디세이", date: "2026.08.05", posterUrl: "" },
  { id: 3, title: "미니언즈 & 몬스터즈", date: "2026.07.15", posterUrl: "" },
];
const sectionTitleClass = "text-[17px] leading-5 font-bold text-[#17191E]";

export function ProfilePage() {
  const meQuery = useMeQuery();
  const profile = meQuery.data;

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

        {/* 내 즐겨찾기 (임시 데이터: 즐겨찾기 API 연동 전까지 유지) */}
        <section className="flex flex-col gap-4">
          <h2 className={sectionTitleClass}>내 즐겨찾기</h2>

          <div className="grid grid-cols-5 gap-x-[18px] gap-y-4">
            {FAVORITE_MOVIES.map((movie) => (
              <article key={movie.id} className="flex flex-col gap-1">
                <div className="h-[274px] w-full overflow-hidden rounded-[10px] bg-[#E3E6EB]">
                  {movie.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={`${movie.title} 포스터`}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="pt-[5px] text-[14px] leading-[17px] font-extrabold text-[#17191E]">
                  {movie.title}
                </div>
                <div className="text-[12px] leading-[14px] text-[#969DA8]">
                  {movie.date}
                </div>
              </article>
            ))}
          </div>

          <nav
            aria-label="즐겨찾기 페이지"
            className="mt-3 flex items-center justify-center gap-3"
          >
            <button type="button" disabled aria-label="이전 페이지">
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
              1
            </button>
            <button type="button" disabled aria-label="다음 페이지">
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