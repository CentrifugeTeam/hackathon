import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

export interface ILocationEvent {
  city: string;
}

export interface ILocationEventResponse {
  items: ILocationEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const fetchLocationEvents = async (
  page: number | undefined,
  size: number | undefined,
  name?: string
): Promise<ILocationEventResponse> => {
  const params: { page?: number; size?: number; name?: string } = {};
  if (name) {
    params.name = name;
  } else {
    params.page = page;
    params.size = size;
  }

  const response = await api.get(`/locations/search`, { params });

  return {
    items: response.data.items.map((item: any) => ({
      city: item.city,
    })),
    total: response.data.total,
    page: response.data.page,
    size: response.data.size,
    pages: response.data.pages,
  };
};

export const useLocationEvents = (
  initialPage: number = 1,
  size: number = 20,
  name?: string
) => {
  return useInfiniteQuery<ILocationEventResponse>({
    queryKey: ["locationEvents", name],
    queryFn: ({ pageParam = initialPage }) =>
      fetchLocationEvents(
        name ? undefined : (pageParam as number),
        name ? undefined : size,
        name
      ),
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
