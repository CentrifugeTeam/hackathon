import { useQuery } from "@tanstack/react-query";
import qs from "qs";
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

export interface FilterParams {
  sports?: string | string[];
  categories?: string | string[];
  competitions?: string | string[];
  cities?: string | string[];
  participant_type?: string;
  participant_from?: number;
  participant_to?: number;
  participants_count?: number;
  start_date?: string;
  end_date?: string;
  page: number;
  size: number;
}

export const fetchSportEvents = async (
  filters: FilterParams
): Promise<{ items: ISportEvent[]; total: number }> => {
  // Удаляем параметры с пустыми значениями
  const cleanedParams = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => {
      return (
        value !== null && // Убираем `null`
        value !== undefined && // Убираем `undefined`
        value !== "" && // Убираем пустую строку
        (!Array.isArray(value) || value.length > 0) // Убираем пустые массивы
      );
    })
  );

  // Преобразуем массивы в строку, разделяя элементы `;`
  const formattedParams = Object.fromEntries(
    Object.entries(cleanedParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(";") : value,
    ])
  );

  // Формируем строку запроса
  const queryString = qs.stringify(formattedParams, { addQueryPrefix: true });

  // Выполняем запрос
  const response = await api.get(`/events/${queryString}`);

  // Преобразование данных
  const transformedItems = response.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    start_date: item.start_date,
    end_date: item.end_date,
    participants_count: item.participants_count,
    city: item.location.city,
    sport: item.type_event.sport,
  }));

  return {
    items: transformedItems,
    total: response.data.total,
  };
};

export const useSportEvents = (filters: FilterParams) => {
  return useQuery({
    queryKey: ["sportEvents", filters],
    queryFn: () => fetchSportEvents(filters),
    staleTime: 60 * 1000, // Данные считаются актуальными в течение 1 минуты
  });
};
