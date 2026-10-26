import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/serach-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search): { query?: string; page?: number } => ({
    query: typeof search.query === "string" ? search.query : undefined,
    page:
      typeof search.page === "number" && search.page > 1
        ? Math.floor(search.page)
        : undefined,
  }),
  component: SearchPage,
});