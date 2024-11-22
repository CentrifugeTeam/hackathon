export const getEventStatus = (start_date: string, end_date: string) => {
	const today = new Date();
	const startDate = new Date(start_date);
	const endDate = new Date(end_date);

	// Определяем статус и цвет
	let status = "НЕ В СРОК";
	let statusColor = "#969696";

	// Проверка на "ТЕКУЩЕЕ СОБЫТИЕ"
	if (today >= startDate && today <= endDate) {
		status = "ТЕКУЩЕЕ СОБЫТИЕ";
		statusColor = "#3169F2";
	}
	// Проверка на "СЕГОДНЯ"
	else if (today.toDateString() === startDate.toDateString() || today.toDateString() === endDate.toDateString()) {
		status = "СЕГОДНЯ";
		statusColor = "#3169F2";
	}
	// Проверка на "НА ЭТОЙ НЕДЕЛЕ"
	else {
		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - today.getDay()); // начало недели
		const endOfWeek = new Date(today);
		endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // конец недели

		if (startDate <= endOfWeek && endDate >= startOfWeek) {
			status = "НА ЭТОЙ НЕДЕЛЕ";
			statusColor = "#C9FF00";
		}
		// Проверка на "В ЭТОМ МЕСЯЦЕ"
		else if (startDate.getMonth() === today.getMonth() && startDate.getFullYear() === today.getFullYear()) {
			status = "В ЭТОМ МЕСЯЦЕ";
			statusColor = "#C9FF00";
		}
		// Проверка на "В КВАРТАЛЕ"
		else {
			const currentQuarter = Math.floor(today.getMonth() / 3);
			const startQuarter = Math.floor(startDate.getMonth() / 3);
			const endQuarter = Math.floor(endDate.getMonth() / 3);

			if (startDate.getFullYear() === today.getFullYear() && (startQuarter === currentQuarter || endQuarter === currentQuarter)) {
				status = "В КВАРТАЛЕ";
				statusColor = "#969696"; // Можно поменять цвет по своему усмотрению
			}
		}
		// Проверка на "В ПОЛУГОДИИ"
		const currentHalfYear = today.getMonth() < 6 ? 0 : 1;
		const startHalfYear = startDate.getMonth() < 6 ? 0 : 1;
		const endHalfYear = endDate.getMonth() < 6 ? 0 : 1;

		if (startDate.getFullYear() === today.getFullYear() && (startHalfYear === currentHalfYear || endHalfYear === currentHalfYear)) {
			status = "В ПОЛУГОДИИ";
			statusColor = "#969696"; // Цвет для полугодия
		}
	}

	return { status, statusColor };
}
