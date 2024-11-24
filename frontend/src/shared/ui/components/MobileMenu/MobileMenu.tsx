import styles from './mobileMenu.module.scss';

export const MobileMenu = ({  }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
				<h2 className={styles.text}>ВФСК ГТО</h2>
				<h2 className={styles.text}>Наш GitHub</h2>
				<h2 className={styles.text}>Презентация</h2>
				<h2 className={styles.text}>ФГИС “Спорт”</h2>
				<h2 className={styles.text}>Минспорта России</h2>
				<h2 className={styles.text}>“Спорт - норма жизни”</h2>
      </div>
    </div>
  );
};
