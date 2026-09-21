import "./header.css";

const NAV_ITEMS = [
  { label: "영화", href: "#", active: true },
  { label: "검색", href: "#", active: false },
  { label: "내 정보", href: "#", active: false },
];

export function Header() {
  return (
    <header className="header">
      <div className="header_inner">
        <div className="header_left">
          <a className="header_brand" href="#">
            <span className="header_logo_wrap">
              <img
                className="header_logo"
                src="/icons/movie.svg"
                alt=""
                aria-hidden="true"
              />
            </span>

            <span className="header_brand-name">UMCine</span>
          </a>

          <nav className="header_nav" aria-label="주요 메뉴">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={
                      item.active
                        ? "header_nav-link is-active"
                        : "header_nav-link"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header_right">
          <button
            type="button"
            className="header_icon-button"
            aria-label="검색"
          >
            <img
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </button>

          <button type="button" className="header_login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}