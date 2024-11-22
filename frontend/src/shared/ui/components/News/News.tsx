import styles from "./news.module.scss";
import FirstImage from "../../../../assets/Rectangle 43.png";
import SecondImage from "../../../../assets/Rectangle 44.png";

export const News = () => {
  return (
    <div className={styles.news}>
      <div className={styles.first}>
        <img src={FirstImage} alt="" />
      </div>
      <div className={styles.second_new}>
        <div className={styles.second}>
          <img src={SecondImage} alt="" />
        </div>
        <h1>ffsdfasf</h1>
      </div>
    </div>
  );
};

export default News;
