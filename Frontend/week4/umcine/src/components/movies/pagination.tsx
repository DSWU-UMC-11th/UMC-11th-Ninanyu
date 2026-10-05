import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonBase =
  "inline-flex size-[34px] cursor-pointer items-center justify-center rounded-lg border border-[#e4e6ea] bg-white text-sm text-[#6b7078]";

const arrowIconClass = "block size-4 bg-current mask-contain mask-center mask-no-repeat";

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1.5"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className={cn(
          buttonBase,
          "enabled:hover:bg-[#f5f6f8] disabled:cursor-not-allowed disabled:opacity-40",
        )}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <span
          className={arrowIconClass}
          style={{
            WebkitMaskImage: "url(/icons/chevron-left.svg)",
            maskImage: "url(/icons/chevron-left.svg)",
          }}
          aria-hidden="true"
        />
      </button>

      <ul className="flex items-center gap-1.5">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                buttonBase,
                page === currentPage
                  ? "border-[#2f5bea] bg-[#2f5bea] font-bold text-white"
                  : "hover:bg-[#f5f6f8]",
              )}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={cn(
          buttonBase,
          "enabled:hover:bg-[#f5f6f8] disabled:cursor-not-allowed disabled:opacity-40",
        )}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <span
          className={arrowIconClass}
          style={{
            WebkitMaskImage: "url(/icons/chevron-right.svg)",
            maskImage: "url(/icons/chevron-right.svg)",
          }}
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}