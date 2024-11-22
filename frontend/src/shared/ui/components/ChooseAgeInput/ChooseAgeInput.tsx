import { useState, useEffect } from "react";
import styles from "./chooseageinput.module.scss";

export const ChooseAgeInput = ({
  minAge,
  setMinAge,
  maxAge,
  setMaxAge,
}: {
  minAge: string;
  setMinAge: (value: string) => void;
  maxAge: string;
  setMaxAge: (value: string) => void;
}) => {
  const [localMinAge, setLocalMinAge] = useState<string>(minAge);
  const [localMaxAge, setLocalMaxAge] = useState<string>(maxAge);

  useEffect(() => {
    setLocalMinAge(minAge);
    setLocalMaxAge(maxAge);
  }, [minAge, maxAge]);

  useEffect(() => {
    setMinAge(localMinAge);
    setMaxAge(localMaxAge);
  }, [localMinAge, localMaxAge, setMinAge, setMaxAge]);

  return (
    <div className={styles.age_input}>
      <label className={styles.label}>Возраст</label>
      <div className={styles.inputs}>
        <input
          type="number"
          className={styles.select}
          placeholder="От"
          value={localMinAge}
          onChange={(e) => setLocalMinAge(e.target.value)}
        />
        <input
          type="number"
          className={styles.select}
          placeholder="До"
          value={localMaxAge}
          onChange={(e) => setLocalMaxAge(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChooseAgeInput;
