export function TmdbFooter() {
  return (
    <footer className="flex h-[49px] shrink-0 items-center justify-end gap-2 border-t border-[#e4e6ea] bg-white px-20 text-xs text-[#8a8f98]">
      <img className="h-3.5" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      <span>
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          TMDB
        </a>
        .
      </span>
    </footer>
  );
}