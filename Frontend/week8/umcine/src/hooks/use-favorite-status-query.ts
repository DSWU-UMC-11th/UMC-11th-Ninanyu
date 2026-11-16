import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "@/api/favorites/favorites";
import { useAuthStore } from "@/stores/auth-store";

export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && Number.isInteger(movieId) && movieId > 0,
    retry: false,
  });
}