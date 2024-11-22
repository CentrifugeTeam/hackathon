import CartSportEvent from "../../shared/ui/components/CardSportEvent/CartSportEvent";
import { FilterForm } from "../../features/Filter/ui/FilterForm";
import { data } from "../../shared/api/getMainSportEvents";
import styles from "./mainpage.module.scss";
import { getEventStatus } from "../../shared/utils/getEventStatus";

export const MainPage = () => {
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
      <FilterForm />
      <CartSportEvent data={data} statusColor={statusColor} status={status} />
    </>
  );
};

export default MainPage;
