export default function calcTotal(products = []) {
  return (products || []).reduce(
    (sum, p) =>
      sum +
      (p.total !== undefined && p.total !== null
        ? Number(p.total)
        : (Number(p.quantity) || 0) * (Number(p.unitPrice) || 0)),
    0
  );
}