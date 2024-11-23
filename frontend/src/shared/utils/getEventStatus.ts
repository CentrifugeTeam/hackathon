export const getEventStatus = (start_date: string, end_date: string) => {
	const today = new Date();
	const startDate = new Date(start_date);
	const endDate = new Date(end_date);

	let status = "НЕ В СРОК";
	let statusColor = "#969696";

	const startDateOnly = new Date(startDate.setHours(0, 0, 0, 0));
	const endDateOnly = new Date(endDate.setHours(0, 0, 0, 0));
	const todayOnly = new Date(today.setHours(0, 0, 0, 0));

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);
	if (tomorrow.toDateString() === startDateOnly.toDateString()) {
		status = "ЗАВТРА";
		statusColor = "#3169F2";
	}

	else if (todayOnly >= startDateOnly && todayOnly <= endDateOnly) {
		status = "АКТИВНО ИДЕТ";
		statusColor = "#3169F2";
	}

	else if (startDateOnly > todayOnly && startDateOnly <= new Date(today.setDate(today.getDate() + 6))) {
		status = "НА ЭТОЙ НЕДЕЛЕ";
		statusColor = "#c8ff00a9";
	}

	else if (startDateOnly > todayOnly && startDateOnly <= new Date(today.setDate(today.getDate() + 30))) {
		status = "В ЭТОМ МЕСЯЦЕ";
		statusColor = "#c8ff00a9";
	}

	else {
		const currentQuarter = Math.floor(today.getMonth() / 3);
		const startQuarter = Math.floor(startDate.getMonth() / 3);
		const endQuarter = Math.floor(endDate.getMonth() / 3);

		if (startDate.getFullYear() === today.getFullYear() && (startQuarter === currentQuarter || endQuarter === currentQuarter)) {
			status = "В КВАРТАЛЕ";
			statusColor = "#969696";
		}
	}

	const currentHalfYear = today.getMonth() < 6 ? 0 : 1;
	const startHalfYear = startDate.getMonth() < 6 ? 0 : 1;
	const endHalfYear = endDate.getMonth() < 6 ? 0 : 1;

	if (startDate.getFullYear() === today.getFullYear() && (startHalfYear === currentHalfYear || endHalfYear === currentHalfYear) && status === "НЕ В СРОК") {
		status = "В ПОЛУГОДИИ";
		statusColor = "#969696";
	}

	return { status, statusColor };
};
