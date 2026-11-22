/**
 * Admin listing status from stock + availability flag.
 * stock 0 always wins so out-of-stock is visible in the dashboard.
 */
export function getListingStatus({ stock, isAvailable }) {
  if (Number(stock) <= 0) return "out of stock"
  return isAvailable ? "active" : "inactive"
}

export function getListingBadgeVariant(status) {
  if (status === "active") return "default"
  if (status === "out of stock") return "destructive"
  return "secondary"
}
