// import axios from "axios";
// import BASE_URL from "./base";
// import { ICartSportEvent } from "../interfaces";

// export const getCartSportEvents = async () => {
// 	try {
// 		const response = await axios.get<ICartSportEvent>(`${BASE_URL}/events/`);
// 		return response.data;
// 	} catch (error) {
// 		console.error("Произошла ошибка при получении спротивных мероприятий:", error);
//     throw error;
// 	}
// }


import { IAges, ILocation, ICompetitions, ICartSportEvent } from '../interfaces';

// Примерные события
export const events: ICartSportEvent[] = [
  {
    id: 2152500017017152,
    name: "Футбольный турнир",
    start_date: "2024-11-22",
    end_date: "2024-11-24",
    type_event_id: 1,
    location_id: 1,
    age_group_id: 1,
    participants_count: 16,
  },
  {
    id: 2033230024019195,
    name: "Баскетбольный кубок",
    start_date: "2024-11-23",
    end_date: "2024-11-25",
    type_event_id: 2,
    location_id: 2,
    age_group_id: 2,
    participants_count: 8,
  },
  {
    id: 2033220022019283,
    name: "Волейбольный матч",
    start_date: "2024-11-25",
    end_date: "2024-11-28",
    type_event_id: 1,
    location_id: 1,
    age_group_id: 1,
    participants_count: 12,
  },
  {
    id: 2020540021021574,
    name: "Турнир по гимнастике",
    start_date: "2024-11-27",
    end_date: "2024-11-30",
    type_event_id: 2,
    location_id: 2,
    age_group_id: 2,
    participants_count: 10,
  },
  {
    id: 2026190021019825,
    name: "Плавательный чемпионат",
    start_date: "2024-12-28",
    end_date: "2024-12-30",
    type_event_id: 1,
    location_id: 1,
    age_group_id: 1,
    participants_count: 20,
  },
  {
    id: 2039160016027087,
    name: "Спортивные соревнования",
    start_date: "2024-12-30",
    end_date: "2024-12-31",
    type_event_id: 2,
    location_id: 2,
    age_group_id: 2,
    participants_count: 15,
  },
];

// Примерные возрастные группы
export const ages: IAges[] = [
  {
    id: 1,
    name: "18-25",
    start: 18,
    end: 25,
  },
  {
    id: 2,
    name: "26-35",
    start: 26,
    end: 35,
  },
  {
    id: 3,
    name: "36-45",
    start: 36,
    end: 45,
  },
  {
    id: 4,
    name: "46-55",
    start: 46,
    end: 55,
  },
  {
    id: 5,
    name: "56-65",
    start: 56,
    end: 65,
  },
  {
    id: 6,
    name: "65+",
    start: 66,
    end: 100,
  },
];

// Примерные локации
export const locations: ILocation[] = [
  {
    id: 1,
    country: "Россия",
    region: "Москва",
    city: "Москва",
  },
  {
    id: 2,
    country: "Россия",
    region: "Санкт-Петербург",
    city: "Санкт-Петербург",
  },
  {
    id: 3,
    country: "Россия",
    region: "Казань",
    city: "Казань",
  },
  {
    id: 4,
    country: "Россия",
    region: "Екатеринбург",
    city: "Екатеринбург",
  },
  {
    id: 5,
    country: "Россия",
    region: "Новосибирск",
    city: "Новосибирск",
  },
  {
    id: 6,
    country: "Россия",
    region: "Нижний Новгород",
    city: "Нижний Новгород",
  },
];

// Примерные соревнования
export const competitions: ICompetitions[] = [
  {
    id: 1,
    name: "Чемпионат мира по футболу",
    type: "спорт",
    event_id: 1,
  },
  {
    id: 2,
    name: "Лига чемпионов по баскетболу",
    type: "спорт",
    event_id: 2,
  },
  {
    id: 3,
    name: "Кубок мира по волейболу",
    type: "спорт",
    event_id: 3,
  },
  {
    id: 4,
    name: "Чемпионат Европы по гимнастике",
    type: "спорт",
    event_id: 4,
  },
  {
    id: 5,
    name: "Олимпийские игры по плаванию",
    type: "спорт",
    event_id: 5,
  },
  {
    id: 6,
    name: "Международные соревнования",
    type: "спорт",
    event_id: 6,
  },
];
