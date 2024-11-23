import styles from "./news.module.scss";
import { useEffect, useState } from "react";
import FirstImage from "../../../../assets/Rectangle 43.png";
import SecondImage from "../../../../assets/Rectangle 44.png";

export const News = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className={styles.news}>
			<div className={styles.first}>
					<img src={FirstImage} alt="Первая новость" className={styles.firstImage} />
			</div>
			<div className={styles.second_new}>
				{isMobile ? (
					<div className={styles.mobileContainer}>
							<img src={SecondImage} alt="Вторая новость" className={styles.secondImageMobile} />
							<h1>
								<span>Рекорд Мёрфи</span>, Сборная мира КХЛ на Кубке Первого канала
							</h1>
						</div>
					) : (
						<>
							<div className={styles.second}>
								<img src={SecondImage} alt="Вторая новость" />
							</div>
							<h1 className={styles.name}>
								<span>Рекорд Мёрфи</span>, Сборная мира КХЛ на Кубке Первого канала
							</h1>
						</>
				)}
			</div>
		</div>
	);
};

export default News;
