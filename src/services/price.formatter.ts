const rdsCurrencyFormatter = new Intl.NumberFormat("sr-RS", {
  style: "currency",
  currency: "RSD",
  maximumFractionDigits: 0
});

export const formatRsdPrice = (price: number) =>
  rdsCurrencyFormatter.format(price);
