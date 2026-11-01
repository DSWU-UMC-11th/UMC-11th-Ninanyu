import { Link } from "@tanstack/react-router";

const navLinkClass =
  "pb-1 text-[15px] font-medium text-[#6b7078] " +
  "data-[status=active]:font-bold data-[status=active]:text-[#16181d] " +
  "data-[status=active]:underline data-[status=active]:underline-offset-[6px]";

export function Header() {
  return (
    <header className="w-full border-b border-[#eceef1] bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-20">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2.5 text-[#16181d]">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e4e6ea]">
              <img
                className="size-[18px]"
                src="/icons/movie.svg"
                alt=""
                aria-hidden="true"
              />
            </span>

            <span className="text-[19px] font-bold tracking-[-0.01em]">
              UMCine
            </span>
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-7">
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

        <div className="flex items-center gap-3.5">
          <Link
            to="/search"
            aria-label="검색"
            className="inline-flex size-[38px] cursor-pointer items-center justify-center rounded-[10px] border border-[#e4e6ea] bg-white text-[#16181d] hover:bg-[#f5f6f8]"
          >
            <img
              className="size-[18px]"
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </Link>

          <button
            type="button"
            className="h-[38px] cursor-pointer rounded-[10px] bg-[#2f5bea] px-[18px] text-sm font-semibold text-white hover:bg-[#2549c4]"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}