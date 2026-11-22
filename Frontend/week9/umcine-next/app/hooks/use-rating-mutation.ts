import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  updateRating,
  type RatingBody,
} from "@/api/ratings/ratings";

function useInvalidateRatings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["ratings"] });
}

export function useSaveRatingMutation() {
  const invalidateRatings = useInvalidateRatings();

  return useMutation({
    mutationFn: async (variables: {
      movieId: number;
      ratingId?: number;
      body: RatingBody;
    }) => {
      if (variables.ratingId) {
        await updateRating(variables.ratingId, variables.body);
      } else {
        await createRating({
          movieId: variables.movieId,
          ...variables.body,
        });
      }
    },
    onSuccess: () => invalidateRatings(),
    onError: (error) => {
      console.error("평점 저장 실패", error);
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation() {
  const invalidateRatings = useInvalidateRatings();

  return useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: () => invalidateRatings(),
    onError: (error) => {
      console.error("평점 삭제 실패", error);
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}