import styles from "./cartSportEvent.module.scss";
import { getEventStatus } from "../../../utils/getEventStatus";

const data = {
    "name_event": "УЧЕБНО - ТРЕНИРОВОЧНОЕ",
    "event_date": {
        "start_date": "2024-11-26",
        "end_date": "2024-12-12"
    },
    "no_sm_ekp": 2139780024013372,
    "location": {
        "city": "Калининград",
        "region": "Калининградская обл",
        "country": "Россия"
    },
    "discipline": "discipline",
    "participants_count": 25,
    "additional_info": "Абоба"
}


export const CartSportEvent = () => {
    const status = getEventStatus(data.event_date.start_date, data.event_date.end_date);

    return (
        <div className={styles.card}>
						<div className={styles.headerCard}>
							<p className={styles.eventStatus}>{status}</p>
							<p>спортивные</p>
						</div>
            <h4>{data.name_event}</h4>
						{/* <h5 className={styles.}>{data.name_event}</h5> */}
            <p>Местоположение: {data.location.city}, {data.location.region}, {data.location.country}</p>
            <p>Количество участников: {data.participants_count}</p>
            <p>Дополнительная информация: {data.additional_info}</p>
        </div>
    );
};

export default CartSportEvent;
