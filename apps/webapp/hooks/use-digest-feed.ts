import {
  useInfiniteQuery,
  useQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queries";
import { Section } from "@/types/daily-digest";
import {
  fetchDigestDetails,
  fetchDigestIds,
} from "@/app/dashboard/daily/actions";

const PAGE_SIZE = 3;

interface DigestPage {
  items: Section[];
  nextPage: number | undefined;
}

interface UseDigestFeedResult {
  digestPages: InfiniteData<DigestPage> | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}

export function useDigestFeed(): UseDigestFeedResult {
  const { data: digestIds, isLoading: isLoadingIds } = useQuery({
    queryKey: [QUERY_KEYS.DIGEST_IDS],
    queryFn: fetchDigestIds,
  });

  const infiniteQuery = useInfiniteQuery<
    DigestPage,
    Error,
    InfiniteData<DigestPage>,
    [typeof QUERY_KEYS.DIGEST_DETAILS, string[] | undefined],
    number
  >({
    queryKey: [QUERY_KEYS.DIGEST_DETAILS, digestIds],
    queryFn: async ({ pageParam = 0 }) => {
      if (!digestIds) return { items: [], nextPage: undefined };

      const pageIds = digestIds.slice(pageParam, pageParam + PAGE_SIZE);
      if (pageIds.length === 0) return { items: [], nextPage: undefined };

      const response = await fetchDigestDetails(pageIds);
      return {
        items: response.items,
        nextPage:
          digestIds.length > pageParam + PAGE_SIZE
            ? pageParam + PAGE_SIZE
            : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!digestIds,
  });

  return {
    digestPages: infiniteQuery.data,
    isLoading: isLoadingIds || infiniteQuery.isLoading,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    fetchNextPage: infiniteQuery.fetchNextPage,
  };
}
