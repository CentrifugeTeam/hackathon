import { useQuery } from "@tanstack/react-query";
import api from "../base";

export interface ISportEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  city: string;
  sport: string;
}

export const fetchSportEvents = async (
  page: number,
  size: number
): Promise<{ items: ISportEvent[]; total: number }> => {
  const response = await api.get(`/events/`, { params: { page, size } });

  // Преобразование данных
  const transformedItems = response.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    start_date: item.start_date,
    end_date: item.end_date,
    participants_count: item.participants_count,
    city: item.location.city, // Извлечение города
    sport: item.type_event.sport, // Извлечение спорта
  }));

  return {
    items: transformedItems,
    total: response.data.total,
  };
};

export const useSportEvents = (page: number, size: number) => {
  return useQuery({
    queryKey: ["sportEvents", page, size],
    queryFn: () => fetchSportEvents(page, size),
    staleTime: 60 * 1000,
  });
};
