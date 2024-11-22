export interface ILocation {
	city: string;
	region: string;
	country: string;
}

export interface IEventDate {
	start_date: string;
	end_date: string;
}

export interface ICartSportEvent {
	name_event: string;
	event_date: IEventDate;
	no_sm_ekp: number;
	location: ILocation;
	discipline: string;
	participants_count: number;
	additional_info: string;
}
