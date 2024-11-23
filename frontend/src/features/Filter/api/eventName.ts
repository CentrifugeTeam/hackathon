import { useQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

export interface IEvent {
  name: string;
}

export interface IEventResponse {
  items: IEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const fetchEvents = async (
  page: number,
  size: number
): Promise<IEventResponse> => {
  const response = await api.get(`/events/search`, {
    params: { page, size }, // параметры для пагинации
  });

  // Возвращаем данные в нужной структуре
  return {
    items: response.data.items.map((item: any) => ({
      name: item.name, // Здесь предполагаем, что нам нужно только поле 'name'
    })),
    total: response.data.total,
    page: response.data.page,
    size: response.data.size,
    pages: response.data.pages,
  };
};

// Хук для получения данных о событиях
export const useEvents = (page: number = 1, size: number = 5) => {
  return useQuery<IEventResponse>({
    queryKey: ["events", page, size], // Ключ для кеширования данных
    queryFn: () => fetchEvents(page, size), // Функция запроса
    staleTime: 60 * 1000, // Время, через которое данные считаются устаревшими (1 минута)
  });
};
