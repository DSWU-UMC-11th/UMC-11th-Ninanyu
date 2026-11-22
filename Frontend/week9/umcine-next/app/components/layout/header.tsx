"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

const navLinkClass =
  "pb-1 text-[14px] leading-[17px] font-bold text-[#606774] " +
  "data-[status=active]:text-[#17191E] " +
  "data-[status=active]:underline data-[status=active]:underline-offset-[6px]";

const actionButtonClass =
  "inline-flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-[14px] leading-[17px] font-extrabold hover:bg-[#1d4ed8]";

function NavLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={navLinkClass}
      data-status={isActive ? "active" : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const skeleton = (
    <span className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200" />
  );

  return (
    <header className="h-[91px] w-full border-b border-[#E3E6EB] bg-white font-['Pretendard']">
      <div className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-20">
        <div className="flex items-center gap-[42px]">
          <Link href="/" className="flex items-center gap-2.5 text-[#17191E]">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border-2 border-[#17191E]">
              <img className="size-5" src="/icons/movie.svg" alt="" aria-hidden="true" />
            </span>
            <span className="text-[20px] leading-6 font-black tracking-[-0.7px]">
              UMCine
            </span>
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-[30px]">
              <li><NavLink href="/" exact>영화</NavLink></li>
              <li><NavLink href="/search">검색</NavLink></li>
              <li><NavLink href="/me">내 정보</NavLink></li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            aria-label="검색"
            className="inline-flex size-[42px] cursor-pointer items-center justify-center rounded-lg border border-[#E3E6EB] bg-white text-[#606774] hover:bg-[#F6F7F9]"
          >
            <img className="size-6" src="/icons/search.svg" alt="" aria-hidden="true" />
          </Link>

          {!hasHydrated ? (
            skeleton
          ) : !accessToken ? (
            <Link href="/login" style={{ color: "#ffffff" }} className={actionButtonClass}>
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            skeleton
          ) : (
            <Link href="/me" style={{ color: "#ffffff" }} className={actionButtonClass}>
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}