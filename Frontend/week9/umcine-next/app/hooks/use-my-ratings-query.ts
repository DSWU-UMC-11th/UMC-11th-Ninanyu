import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "@/api/ratings/ratings";
import { useMemberId } from "@/hooks/use-member-id";

export function useMyRatingsQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
    retry: false,
  });
}