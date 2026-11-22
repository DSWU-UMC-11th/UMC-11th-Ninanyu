import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/api/favorites/favorites";

type ToggleFavoriteVariables = {
  movieId: number;
  isFavorite: boolean; // 현재 상태 (true면 해제, false면 등록)
};

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, isFavorite }: ToggleFavoriteVariables) =>
      isFavorite ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: (_response, { movieId, isFavorite }) => {
      queryClient.setQueryData(["favorites", movieId], {
        isFavorite: !isFavorite,
      });
      return queryClient.invalidateQueries({
        queryKey: ["favorites"],
        exact: true,
      });
    },
    onError: () => {
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}