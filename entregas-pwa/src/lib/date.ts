export function getTodayTomorrow() {
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const toDateString = (date: Date) => date.toISOString().split('T')[0];

  return {
    today: toDateString(today),
    tomorrow: toDateString(tomorrow)
  };
}
