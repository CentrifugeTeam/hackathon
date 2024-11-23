import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

export interface IAgeEvent {
  name: string;
  start: number;
  end: number;
  id: number;
}

export interface IAgeEventResponse {
  items: IAgeEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const fetchAgeEvents = async (
  page: number | undefined,
  size: number | undefined,
  name?: string
): Promise<IAgeEventResponse> => {
  const params: { page?: number; size?: number; name?: string } = {};
  if (name) {
    params.name = name;
  } else {
    params.page = page;
    params.size = size;
  }

  const response = await api.get(`/ages/search`, { params });

  return {
    items: response.data.items.map((item: any) => ({
      name: item.name,
      start: item.start,
      end: item.end,
      id: item.id,
    })),
    total: response.data.total,
    page: response.data.page,
    size: response.data.size,
    pages: response.data.pages,
  };
};

export const useAgeEvents = (
  initialPage: number = 1,
  size: number = 10,
  name?: string
) => {
  return useInfiniteQuery<IAgeEventResponse>({
    queryKey: ["ageEvents", name],
    queryFn: ({ pageParam = initialPage }) =>
      fetchAgeEvents(
        name ? undefined : (pageParam as number),
        name ? undefined : size,
        name
      ), // Передаем undefined для page и size, если есть name
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
