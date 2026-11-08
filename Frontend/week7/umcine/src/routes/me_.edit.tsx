import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../pages/me/profile-edit-page";

export const Route = createFileRoute("/me_/edit")({
  component: ProfileEditPage,
});
