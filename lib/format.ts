export function formatDuration(days: string): string {
  const n = parseInt(days, 10);
  if (isNaN(n)) return days;
  return `${n} Days`;
}

export function formatPrice(amount: string): string {
  const n = parseInt(amount.replace(/[^\d]/g, ""), 10);
  if (isNaN(n)) return amount;
  return `₹${n.toLocaleString("en-IN")}`;
}
