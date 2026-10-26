const currencyFormatter = new Intl.NumberFormat("en-BO", {
  style: "currency",
  currency: "BOB",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}
