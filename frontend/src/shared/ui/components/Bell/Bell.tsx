import React from "react";
import BellSvg from "../../../../assets/proicons_bell.svg";
import BellSvgMenu from "../../../../assets/proicons_bell_menu.svg";
import styles from "./Bell.module.scss";

interface BellProps {
    isMenu: boolean;
}

export const Bell: React.FC<BellProps> = ({ isMenu }) => {
	return (
		<div className={`${styles.bell_block} ${isMenu ? styles.menu : styles.notMenu}`}>
			<img
				src={isMenu ? BellSvgMenu : BellSvg}
				alt="Уведомление"
			/>
		</div>
	);
}
