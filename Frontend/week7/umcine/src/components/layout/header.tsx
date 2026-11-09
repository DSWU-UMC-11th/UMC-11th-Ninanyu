import { Link } from "@tanstack/react-router";

// 메뉴 링크: 14px / 700 / #606774, 현재 페이지는 #17191E + 밑줄
const navLinkClass =
  "pb-1 text-[14px] leading-[17px] font-bold text-[#606774] " +
  "data-[status=active]:text-[#17191E] " +
  "data-[status=active]:underline data-[status=active]:underline-offset-[6px]";

// 우측 파란 버튼 공통 스타일: 높이 42px, radius 8px, 14px / 800
const actionButtonClass =
  "inline-flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8]";

type HeaderProps = {
  // 로그인 여부 (인증 상태 연결 전까지는 기본값 false)
  isLoggedIn?: boolean;
};

export function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header className="h-[91px] w-full border-b border-[#E3E6EB] bg-white font-['Pretendard']">
      <div className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-20">
        <div className="flex items-center gap-[42px]">
          {/* div.brand: gap 10px */}
          <Link to="/" className="flex items-center gap-2.5 text-[#17191E]">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border-2 border-[#17191E]">
              <img
                className="size-5"
                src="/icons/movie.svg"
                alt=""
                aria-hidden="true"
              />
            </span>

            {/* 20px / 900 / -0.7px */}
            <span className="text-[20px] leading-6 font-black tracking-[-0.7px]">
              UMCine
            </span>
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-[30px]">
              <li>
                <Link
                  to="/"
                  className={navLinkClass}
                  activeOptions={{ exact: true }}
                >
                  영화
                </Link>
              </li>
              <li>
                <Link to="/search" className={navLinkClass}>
                  검색
                </Link>
              </li>
              <li>
                <Link to="/me" className={navLinkClass}>
                  내 정보
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* div.top-actions: gap 10px */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/search"
            aria-label="검색"
            className="inline-flex size-[42px] cursor-pointer items-center justify-center rounded-lg border border-[#E3E6EB] bg-white text-[#606774] hover:bg-[#F6F7F9]"
          >
            <img
              className="size-6"
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </Link>

          {isLoggedIn ? (
            <Link
              to="/me"
              style={{ color: "#ffffff" }}
              className={actionButtonClass}
            >
              마이페이지
            </Link>
          ) : (
            <Link
              to="/login"
              style={{ color: "#ffffff" }}
              className={actionButtonClass}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}