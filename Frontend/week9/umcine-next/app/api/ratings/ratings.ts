import { apiClient } from "../api-client";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../api-response";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingBody {
  score: number;
  comment: string;
}

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

// POST /ratings 
export async function createRating(body: RatingBody & { movieId: number }) {
  const response = await authApi
    .post("ratings", { json: body })
    .json<ApiResponse<Rating>>();
  return response.result;
}

// PATCH /ratings/{ratingId}
export async function updateRating(ratingId: number, body: RatingBody) {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<Rating>>();
  return response.result;
}

// DELETE /ratings/{ratingId}
export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}