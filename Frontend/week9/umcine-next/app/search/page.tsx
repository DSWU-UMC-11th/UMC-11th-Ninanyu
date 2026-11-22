import { Suspense } from "react";
import { SearchPage } from "@/views/movies/serach-page";

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}