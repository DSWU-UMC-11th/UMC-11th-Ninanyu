import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/me")({
  component: () => <main>내 정보</main>,
});