import React from 'react';
import styles from "./CartSportEvent.module.scss";
import { ICartSportEvent, IAges, ILocation, ICompetitions } from "../../../interfaces";
import { ages, locations, competitions } from '../../../api/getSportEvents';

interface CartSportEventProps {
    data: ICartSportEvent;
    statusColor: string;
    // status: string;
}

export const CartSportEvent: React.FC<CartSportEventProps> = ({ data, statusColor}) => {
    const location: ILocation | undefined = locations.find(loc => loc.id === data.location_id);
    const ageGroup: IAges | undefined = ages.find(age => age.id === data.age_group_id);
    const competition: ICompetitions | undefined = competitions.find(com => com.id === data.type_event_id);

    return (
        <div className={styles.card}>

            <div className={styles.headerCard}>
							<h2 className={styles.eventName}>{data.name}</h2>

							<h4 className={styles.id} style={{ color: statusColor }}>{data.id}</h4>
            </div>

						<div>
							<h3 className={`${styles.eventText} ${styles.eventSubTitle}`}>
								{data.name} МЕРОПРИЯТИЕ
							</h3>

						</div>

						<div>
							<h3 className={styles.ageGroup}>
								{ageGroup ? `${ageGroup.name} ${ageGroup.start}-${ageGroup.end}` : "Возрастная группа недоступна"}
							</h3>
							<h3 className={`${styles.discipline} ${styles.eventText}`}>
								{competition?.type}, {data?.participants_count} УЧАСТНИКОВ
							</h3>
						</div>

						<div className={styles.footerCard}>
							<div>
								<h3 className={styles.location}>
									{location ? `${location.country}, ${location.region} ` : "Локация недоступна"}
								</h3>
								<h3>
									{location ? `Г. ${location.city}` : ""}
								</h3>
							</div>

							<div>
								<h4 className={styles.dateEvent} style={{ background: statusColor }}>{data.start_date} по {data.end_date}</h4>
							</div>
						</div>
        </div>
    );
};
