export const getEventStatus = (start_date: string, end_date: string) => {
  const today = new Date();

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Сбрасываем время для чистоты расчетов
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Проверяем разницу в днях
  const timeDiff = startDate.getTime() - today.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  // Начальные значения
  let status = "НЕ В СРОК";
  let statusColor = "#969696";

  // Проверка на статус "ЗАВТРА"
  if (daysDiff === 1) {
    status = "ЗАВТРА";
    statusColor = "#3169F2";
  }
  // Проверка на статус "НА ЭТОЙ НЕДЕЛЕ" (в пределах 7 дней)
  else if (daysDiff > 1 && daysDiff <= 7) {
    status = "НА ЭТОЙ НЕДЕЛЕ";
    statusColor = "#c8ff00a9";
  }
  // Проверка на статус "В ЭТОМ МЕСЯЦЕ" (в пределах 30 дней)
  else if (daysDiff > 7 && daysDiff <= 30) {
    status = "В ЭТОМ МЕСЯЦЕ";
    statusColor = "#c8ff00a9";
  }
  // Проверка на статус "В КВАРТАЛЕ" (в пределах текущего квартала)
  else if (daysDiff > 30 && daysDiff <= 90) {
    status = "В КВАРТАЛЕ";
    statusColor = "#969696";
  }
  // Проверка на статус "В ПОЛУГОДИИ" (в пределах 6 месяцев)
  else if (daysDiff > 90 && daysDiff <= 180) {
    status = "В ПОЛУГОДИИ";
    statusColor = "#969696";
  }

  return { status, statusColor };
};
