export interface IAges {
	id: number;
	name: string;
	start: number;
	end: number;
}

export interface ILocation {
	id: number;
	country: string;
	region: string;
	city: string;
}

export interface ICompetitions {
	id: number;
	name: string;
	type: string;
	event_id: number;
}

export interface ICartSportEvent {
	id: number;
	name: string;
	start_date: string;
	end_date: string;
	type_event_id: number;
	location_id: number;
	age_group_id: number;
	participants_count: number;
}

