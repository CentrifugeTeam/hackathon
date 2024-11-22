import CartSportEvent from "../../shared/ui/components/CardSportEvent/CartSportEvent";
import { FilterForm } from "../../features/Filter/ui/FilterForm";
import { data } from "../../shared/api/getMainSportEvents";
import styles from "./mainpage.module.scss";
import { getEventStatus } from "../../shared/utils/getEventStatus";
import { News } from "../../shared/ui/components/News";

export const MainPage = () => {
	console.log(data.event_date.start_date, data.event_date.end_date)
  const { status, statusColor } = getEventStatus(
    data.event_date.start_date,
    data.event_date.end_date
  );

  return (
    <>
      <h1 className={styles.title}>
        <span className={styles.unique}>ЕДИНЫЙ</span> КАЛЕНДАРЬ ПЛАН
        ФИЗКУЛЬТУРНЫХ
        <br /> И СПОРТИВНЫХ МЕРОПРИЯТИЙ
      </h1>
      <News />
      <FilterForm />
      <CartSportEvent data={data} statusColor={statusColor} status={status} />
    </>
  );
};

export default MainPage;
