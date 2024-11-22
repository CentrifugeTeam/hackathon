export const formatDateRange = (start_date: string, end_date: string) => {
	const startDate = new Date(start_date);
	const endDate = new Date(end_date);

	const startFormatted = startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

	if (startDate.toDateString() === endDate.toDateString()) {
		return `${startFormatted}`;
	} else {
		const endFormatted = endDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
		return `${startFormatted} - ${endFormatted}`;
	}
};
