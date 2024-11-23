import { useQuery } from "@tanstack/react-query";
import api from "../base";

export interface ICartSportEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  location_id: number;
  age_group_id: number;
  type_event_id: number;
}

export const fetchSportEvents = async (
  page: number,
  size: number
): Promise<{ items: ICartSportEvent[]; total: number }> => {
  const response = await api.get(`/events/`, { params: { page, size } });
  return response.data;
};

export const useSportEvents = (page: number, size: number) => {
  return useQuery({
    queryKey: ["sportEvents", page, size],
    queryFn: () => fetchSportEvents(page, size),
    staleTime: 60 * 1000,
  });
};
