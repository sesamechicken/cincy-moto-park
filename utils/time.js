// "5 min", "2 hr 10 min", "1 d 3 hr"
export function formatElapsed(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} d ${hours} hr`;
  if (hours === 0) return `${minutes} min`;
  return `${hours} hr ${minutes} min`;
}
