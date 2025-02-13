export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    }).format(amount)
  }
  