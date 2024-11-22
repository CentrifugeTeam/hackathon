import { useState, useEffect } from "react";
import styles from "./choosedateinput.module.scss";

export const ChooseDateInput = ({
  label,
  date,
  setDate,
}: {
  label: string;
  date: string;
  setDate: (value: string) => void;
}) => {
  const [localDate, setLocalDate] = useState<string>(date);

  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  useEffect(() => {
    setDate(localDate);
  }, [localDate, setDate]);

  return (
    <div className={styles.dropdown}>
      <label className={styles.label}>{label}</label>
      <input
        type="date"
        placeholder="чч.мм.гггг"
        className={styles.select}
        value={localDate}
        onChange={(e) => setLocalDate(e.target.value)}
      />
    </div>
  );
};

export default ChooseDateInput;
