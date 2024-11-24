import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

interface ICompetitionEvent {
  name: string;
  type: string;
}

interface ICompetitionEventResponse {
  items: ICompetitionEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Function to fetch competition events
export const fetchCompetitionEvents = async (
  page: number,
  size: number,
  type: string,
  name?: string
): Promise<ICompetitionEventResponse> => {
  const params: { type: string; page: number; size: number; name?: string } = {
    type,
    page,
    size,
  };
  if (name) {
    params.name = name;
  }

  const response = await api.get(`/competitions/search`, { params });

  return {
    items: response.data.items.map((item: any) => ({
      name: item.name,
      type: item.type,
    })),
    total: response.data.total,
    page: response.data.page,
    size: response.data.size,
    pages: response.data.pages,
  };
};

// Custom hook to use competition events
export const useCompetitionEvents = (
  type: string,
  initialPage: number = 1,
  size: number = 30,
  name?: string
) => {
  return useInfiniteQuery<ICompetitionEventResponse>({
    queryKey: ["competitionEvents", type, name],
    queryFn: ({ pageParam = initialPage }) =>
      fetchCompetitionEvents(pageParam as number, size, type, name),
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
