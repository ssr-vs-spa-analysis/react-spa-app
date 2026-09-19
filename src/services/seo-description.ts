export const truncateSeoText = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
