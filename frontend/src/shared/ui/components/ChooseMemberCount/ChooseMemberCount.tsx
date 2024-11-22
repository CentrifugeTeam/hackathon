import { useState, useEffect } from "react";
import styles from "./choosemembercount.module.scss";

export const ChooseMemberCount = ({
  memberCount,
  setMemberCount,
}: {
  memberCount: string;
  setMemberCount: (value: string) => void;
}) => {
  const [localMemberCount, setLocalMemberCount] = useState<string>(memberCount);

  useEffect(() => {
    setLocalMemberCount(memberCount);
  }, [memberCount]);

  useEffect(() => {
    setMemberCount(localMemberCount);
  }, [localMemberCount, setMemberCount]);

  return (
    <div className={styles.count_input}>
      <label className={styles.label}>Количество участников</label>
      <input
        type="number"
        placeholder="Введите число"
        className={styles.select}
        value={localMemberCount}
        onChange={(e) => setLocalMemberCount(e.target.value)}
      />
    </div>
  );
};

export default ChooseMemberCount;
