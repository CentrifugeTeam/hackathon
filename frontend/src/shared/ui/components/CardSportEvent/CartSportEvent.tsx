import React from 'react';
import styles from "./cartSportEvent.module.scss";
import { ICartSportEvent } from "../../../interfaces";
import { formatDateRange } from '../../../utils/formatDateRange';

interface CartSportEventProps {
	data: ICartSportEvent;
	statusColor: string;
	status: string;
}

const CartSportEvent: React.FC<CartSportEventProps> = ({ data, statusColor, status }) => {

	return (
		<div className={styles.card}>
				<div className={styles.headerCard}>
					<p className={styles.eventStatus} style={{ background: statusColor }}>
						{status}
					</p>
					<p>спортивные</p>
				</div>
				<h4>{data.name_event}</h4>
				<h5 className={styles.eventText}>{data.name_event} МЕРОПРИЯТИЕ</h5>
				<h4 className={styles.typeEvent}>
					<span className={styles.eventText}>ВИД СПОРТА: </span>{data.discipline}
				</h4>
				<h4>Женщины, Мужчины</h4>
				<hr className={styles.hr} style={{ color: statusColor }} />
				<h4 className={styles.location}>{data.location.city},<span> {formatDateRange(data.event_date.start_date, data.event_date.end_date)}</span></h4>
				<h4>№ ЕКП {data.no_sm_ekp}</h4>
		</div>
	);
};

export default CartSportEvent;
