import { useQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

export interface ISexEvent {
  name: string;
}

export interface ISexEventResponse {
  items: ISexEvent[];
}

export const fetchSexEvents = async (
  name?: string
): Promise<ISexEventResponse> => {
  const params: { name?: string } = {};
  if (name) params.name = name;

  const response = await api.get(`/sex/search`, { params });

  return {
    items: response.data.map((item: any) => ({ name: item.name })),
  };
};

export const useSexEvents = (name?: string) => {
  return useQuery<ISexEventResponse, Error>({
    queryKey: ["sexEvents", name],
    queryFn: () => fetchSexEvents(name),
    staleTime: 60 * 1000,
  });
};
