export const getEventStatus = (start_date: string, end_date: string) => {
	const today = new Date();
	const startDate = new Date(start_date);
	const endDate = new Date(end_date);

	if (today >= startDate && today <= endDate) {
			return "ТЕКУЩЕЕ СОБЫТИЕ";
	}

	if (today.toDateString() === startDate.toDateString() || today.toDateString() === endDate.toDateString()) {
			return "СЕГОДНЯ";
	}

	const startOfWeek = new Date(today);
	startOfWeek.setDate(today.getDate() - today.getDay());
	const endOfWeek = new Date(today);
	endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

	if (startDate <= endOfWeek && endDate >= startOfWeek) {
			return "НА ЭТОЙ НЕДЕЛЕ";
	}

	if (startDate.getMonth() === today.getMonth() && startDate.getFullYear() === today.getFullYear()) {
			return "В ЭТОМ МЕСЯЦЕ";
	}

	const currentQuarter = Math.floor(today.getMonth() / 3);
	const startQuarter = Math.floor(startDate.getMonth() / 3);
	const endQuarter = Math.floor(endDate.getMonth() / 3);

	if (startDate.getFullYear() === today.getFullYear() && (startQuarter === currentQuarter || endQuarter === currentQuarter)) {
			return "В КВАРТАЛЕ";
	}

	const currentHalfYear = today.getMonth() < 6 ? 0 : 1;
	const startHalfYear = startDate.getMonth() < 6 ? 0 : 1;
	const endHalfYear = endDate.getMonth() < 6 ? 0 : 1;

	if (startDate.getFullYear() === today.getFullYear() && (startHalfYear === currentHalfYear || endHalfYear === currentHalfYear)) {
			return "В ПОЛУГОДИИ";
	}

	return "НЕ В СРОК";
}
