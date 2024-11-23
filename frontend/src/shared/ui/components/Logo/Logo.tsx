import styles from './Logo.module.scss'

export const Logo = () => {
	return (
		<div className={styles.logo}>
			<p className={styles.sport}>SPORT</p>
			<p className={styles.calendar}>КАЛЕНДАРЬ</p>
		</div>
	)
}
