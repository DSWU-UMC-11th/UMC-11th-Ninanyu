import "./pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination_arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <span
          className="pagination_arrow_icon"
          style={{
            WebkitMaskImage: "url(/icons/chevron-left.svg)",
            maskImage: "url(/icons/chevron-left.svg)",
          }}
          aria-hidden="true"
        />
      </button>

      <ul className="pagination_list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={
                page === currentPage ? "pagination_page is_current" : "pagination_page"
              }
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
        className="pagination_arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <span
          className="pagination_arrow_icon"
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