import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

const navLinkClass =
  "pb-1 text-[14px] leading-[17px] font-bold text-[#606774] " +
  "data-[status=active]:text-[#17191E] " +
  "data-[status=active]:underline data-[status=active]:underline-offset-[6px]";

const actionButtonClass =
  "inline-flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8]";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="h-[91px] w-full border-b border-[#E3E6EB] bg-white font-['Pretendard']">
      <div className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-20">
        <div className="flex items-center gap-[42px]">
          <Link to="/" className="flex items-center gap-2.5 text-[#17191E]">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border-2 border-[#17191E]">
              <img
                className="size-5"
                src="/icons/movie.svg"
                alt=""
                aria-hidden="true"
              />
            </span>

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

          {!accessToken ? (
            <Link
              to="/login"
              style={{ color: "#ffffff" }}
              className={actionButtonClass}
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              to="/me"
              style={{ color: "#ffffff" }}
              className={actionButtonClass}
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}