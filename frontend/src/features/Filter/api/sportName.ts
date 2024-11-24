import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

export interface ISportEvent {
  id: number;
  sport: string;
}

export interface ISportEventResponse {
  items: ISportEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const fetchSportEvents = async (
  page: number | undefined,
  size: number | undefined,
  name?: string
): Promise<ISportEventResponse> => {
  const params: { page?: number; size?: number; name?: string } = {};
  if (name) {
    params.name = name;
  } else {
    params.page = page;
    params.size = size;
  }

  const response = await api.get(`/event_of_types/search`, { params });

  return {
    items: response.data.items.map((item: any) => ({
      id: item.id, // Add the `id` field here
      sport: item.sport,
    })),
    total: response.data.total,
    page: response.data.page,
    size: response.data.size,
    pages: response.data.pages,
  };
};

export const useSportEvents = (
  initialPage: number = 1,
  size: number = 10,
  name?: string
) => {
  return useInfiniteQuery<ISportEventResponse>({
    queryKey: ["sportEvents", name],
    queryFn: ({ pageParam = initialPage }) =>
      fetchSportEvents(
        name ? undefined : (pageParam as number),
        name ? undefined : size,
        name
      ), // Передаем undefined для page и size если есть name
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: initialPage,
    staleTime: 60 * 1000,
  });
};
