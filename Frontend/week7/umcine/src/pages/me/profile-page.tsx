import { Link } from "@tanstack/react-router";

// 임시 데이터 (API 연동 전까지 화면 확인용)
const PROFILE = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

const FAVORITE_MOVIES = [
  { id: 1, title: "스파이더맨: 브랜드 뉴 데이", date: "2026.07.29", posterUrl: "" },
  { id: 2, title: "오디세이", date: "2026.08.05", posterUrl: "" },
  { id: 3, title: "미니언즈 & 몬스터즈", date: "2026.07.15", posterUrl: "" },
];

// 섹션 제목: 17px / 700 / 20px
const sectionTitleClass = "text-[17px] leading-5 font-bold text-[#17191E]";

export function ProfilePage() {
  return (
    // 배경은 화면 전체, 내용은 최대 1440px로 가운데 정렬
    <main className="min-h-[calc(100vh-91px)] w-full bg-[#F6F7F9] font-['Pretendard']">
      {/* main.container: 패딩 24px 80px, 섹션 간격 28px */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-20 py-6">
      {/* div.profile-overview-head */}
      <div className="flex items-center justify-between">
        {/* 31px / 700 / 37px / -1.24px */}
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

      {/* section.profile-info-block: 위아래 1px 선, 패딩 12px 0, 간격 16px */}
      <section className="flex flex-col gap-4 border-y border-[#E3E6EB] py-3">
        <h2 className={sectionTitleClass}>기본 정보</h2>

        {/* div.profile-info-content: 간격 28px */}
        <div className="flex items-center gap-7">
          <span className="flex size-[82px] shrink-0 items-center justify-center rounded-full bg-[#E3E6EB]">
            <img
              className="size-12"
              src="/icons/person.svg"
              alt=""
              aria-hidden="true"
            />
          </span>

          {/* div.info-grid: 최대 760px, 두 칸, 간격 28px */}
          <div className="flex w-full max-w-[760px] items-start gap-7">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] leading-[13px] text-[#969DA8]">
                닉네임
              </span>
              <strong className="text-[14px] leading-[17px] font-bold text-[#17191E]">
                {PROFILE.nickname}
              </strong>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] leading-[13px] text-[#969DA8]">
                이메일
              </span>
              <strong className="text-[14px] leading-[17px] font-bold text-[#17191E]">
                {PROFILE.email}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* 내 즐겨찾기 */}
      <section className="flex flex-col gap-4">
        <h2 className={sectionTitleClass}>내 즐겨찾기</h2>

        {/* div.movie-grid: 5열, 간격 18px */}
        <div className="grid grid-cols-5 gap-x-[18px] gap-y-4">
          {FAVORITE_MOVIES.map((movie) => (
            <article key={movie.id} className="flex flex-col gap-1">
              {/* div.poster: 높이 274px, radius 10px */}
              <div className="h-[274px] w-full overflow-hidden rounded-[10px] bg-[#E3E6EB]">
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} 포스터`}
                    className="size-full object-cover"
                  />
                )}
              </div>
              {/* div.movie-title: 14px / 800 / 17px, 위 패딩 5px */}
              <div className="pt-[5px] text-[14px] leading-[17px] font-extrabold text-[#17191E]">
                {movie.title}
              </div>
              {/* div.movie-meta: 12px / 400 / 14px */}
              <div className="text-[12px] leading-[14px] text-[#969DA8]">
                {movie.date}
              </div>
            </article>
          ))}
        </div>

        {/* 페이지네이션: 간격 12px, 버튼 36px */}
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