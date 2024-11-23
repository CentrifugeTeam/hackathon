import React from 'react';
import styles from "./MiniCartSportEvent.module.scss";
import { ICartSportEvent, IAges, ILocation, ICompetitions } from "../../../interfaces";
import { formatDateRange } from '../../../utils/formatDateRange';
import { ages, locations, competitions } from '../../../api/getSportEvents';

interface CartSportEventProps {
	data: ICartSportEvent;
	statusColor: string;
	status: string;
}

export const MiniCartSportEvent: React.FC<CartSportEventProps> = ({ data, statusColor, status }) => {
	// Находим соответствующую локацию, возрастную группу и соревнование по их ID
	const location: ILocation | undefined = locations.find(loc => loc.id === data.location_id);
	const ageGroup: IAges | undefined = ages.find(age => age.id === data.age_group_id);
	const competition: ICompetitions | undefined = competitions.find(com => com.id === data.type_event_id);

	return (
		<div className={styles.card}>
			<div className={styles.headerCard}>
				<p className={styles.eventStatus} style={{ background: statusColor }}>
					{status}
				</p>
				<p>СПОРТИВНЫЕ</p>
			</div>
			<h2 className={styles.eventName}>{data.name}</h2>
			<h4 className={`${styles.eventText} ${styles.eventSubTitle}`}>{data.name} МЕРОПРИЯТИЕ</h4>
			<h3 className={styles.typeEvent}>
				<span className={styles.eventText}>ВИД СПОРТА: </span>
				{competition ? competition.name : "Тип спорта недоступен"}
			</h3>
			<h3 className={styles.ageGroup}>
				{ageGroup ? `${ageGroup.name} ${ageGroup.start}-${ageGroup.end}` : "Возрастная группа недоступна"}
			</h3>
			<h5 className={`${styles.discipline} ${styles.eventText}`}>{competition?.type}</h5>
			<h3 className={styles.participantsCount}>{data.participants_count} УЧАСТНИКОВ</h3>
			<hr className={styles.hr} style={{ color: statusColor }} />
			<h3 className={styles.location}>
				{location ? `${location.city}, ${formatDateRange(data.start_date, data.end_date)}` : "Локация недоступна"}
			</h3>
			<h4 className={styles.id}>№ ЕКП {data.id}</h4>
		</div>
	);
};
