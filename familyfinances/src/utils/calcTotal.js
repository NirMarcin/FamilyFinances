// Funkcja do sumowania produktów z paragonu
export default function calcTotal(products) {
  return products.reduce((sum, p) => sum + Number(p.price || 0), 0);
}