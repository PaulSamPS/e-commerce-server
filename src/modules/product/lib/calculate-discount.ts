export function calculateDiscount(oldPrice: number, price: number): number {
  if (oldPrice > 0) {
    // Вычисляем процент скидки
    return Math.floor(((oldPrice - price) / oldPrice) * 100);
  } else {
    // Если нет старой цены, скидка равна 0
    return 0;
  }
}
