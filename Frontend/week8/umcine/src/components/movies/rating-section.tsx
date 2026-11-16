import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMyRatingsQuery } from "@/hooks/use-my-ratings-query";
import {
  useDeleteRatingMutation,
  useSaveRatingMutation,
} from "@/hooks/use-rating-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

const STARS = [1, 2, 3, 4, 5];

type RatingSectionProps = {
  movieId: number;
};

export function RatingSection({ movieId }: RatingSectionProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const ratingsQuery = useMyRatingsQuery();
  const saveMutation = useSaveRatingMutation();
  const deleteMutation = useDeleteRatingMutation();

  // 내 평점 목록에서 이 영화의 평점을 찾아요
  const myRating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // 서버 값이 바뀌면(불러오기, 저장, 삭제 후) 입력값을 맞춰요
  useEffect(() => {
    setRating(myRating?.score ?? 0);
    setReview(myRating?.comment ?? "");
  }, [myRating?.ratingId, myRating?.score, myRating?.comment]);

  const isBusy = saveMutation.isPending || deleteMutation.isPending;

  const handleSave = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (rating === 0 || isBusy) return;

    saveMutation.mutate({
      movieId,
      ratingId: myRating?.ratingId,
      body: { score: rating, comment: review.trim() },
    });
  };

  const handleDelete = () => {
    if (!myRating || isBusy) return;
    if (!confirm("내 평점을 삭제할까요?")) return;
    deleteMutation.mutate(myRating.ratingId);
  };

  return (
    <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-[41px] pl-[30px]">
      <h2 className="text-[21px] font-bold leading-[25px] tracking-[-0.63px] text-[#17191e]">
        내 평점
      </h2>
      <p className="text-xs leading-[14px] text-[#969da8]">
        별점은 필수, 후기는 선택이에요.
      </p>

      <div className="flex gap-1" role="radiogroup" aria-label="영화 별점">
        {STARS.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value}점`}
            onClick={() => {
              saveMutation.reset();
              setRating(value);
            }}
            className={cn(
              "inline-flex size-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white transition-colors hover:bg-[#f6f7f9]",
              value <= rating ? "text-[#17191e]" : "text-[#606774]",
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6 fill-current"
              aria-hidden="true"
            >
              <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>

      <textarea
        aria-label="후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={review}
        onChange={(event) => {
          saveMutation.reset();
          setReview(event.target.value);
        }}
        className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-5 text-[#17191e] outline-none placeholder:text-[#969da8] focus:border-[#17191e]"
      />

      <button
        type="button"
        disabled={rating === 0 || isBusy}
        onClick={handleSave}
        className="h-[42px] w-full cursor-pointer rounded-lg border border-white bg-[#17191e] px-4 text-sm font-extrabold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saveMutation.isPending
          ? "저장 중"
          : myRating
            ? "평점 수정"
            : "평점 저장"}
      </button>

      {saveMutation.isSuccess && (
        <p className="text-xs leading-[14px] text-[#2563EB]">
          평점을 저장했어요.
        </p>
      )}
      {saveMutation.isError && (
        <p className="text-xs leading-[14px] text-[#DC2626]">
          저장에 실패했어요. 다시 시도해 주세요.
        </p>
      )}

      {myRating && (
        <button
          type="button"
          disabled={isBusy}
          onClick={handleDelete}
          className="h-[42px] w-full cursor-pointer rounded-lg border border-[#e3e6eb] bg-white px-4 text-sm font-extrabold text-[#D92D20] hover:bg-[#fdf1f0] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      )}
    </aside>
  );
}