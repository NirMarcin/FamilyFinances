import Button from "../buttons/Button";
import calcTotal from "../../utils/calcTotal";

export function CurrentProductsPreview({ products, onRemoveProduct }) {
  

  if (products.length === 0) {
    return <p className="text-gray-600 italic">Brak dodanych produktów.</p>;
  }

  return (
    <table className="w-full border border-orange-300 rounded-md shadow">
      <thead className="bg-orange-200 text-orange-900 font-semibold">
        <tr>
          <th className="border border-orange-300 p-3 text-left">Produkt</th>
          <th className="border border-orange-300 p-3 text-left">Kategoria</th>
          <th className="border border-orange-300 p-3 text-right">Cena (zł)</th>
          <th className="border border-orange-300 p-3 text-center">Akcje</th>
        </tr>
      </thead>
      <tbody>
        {products.map(({ name, category, price }, i) => (
          <tr key={i} className={i % 2 === 1 ? "bg-orange-100" : ""}>
            <td className="border border-orange-300 p-3">{name}</td>
            <td className="border border-orange-300 p-3">{category}</td>
            <td className="border border-orange-300 p-3 text-right">
              {price.toFixed(2)}
            </td>
            <td className="border border-orange-300 p-3 text-center">
              <Button
                color="red"
                onClick={() => onRemoveProduct(i)}
                aria-label={`Usuń produkt ${name}`}
                className="py-1 px-3 text-sm"
              >
                Usuń
              </Button>
            </td>
          </tr>
        ))}
        <tr className="font-semibold bg-orange-300 text-orange-900">
          <td colSpan={2} className="border border-orange-300 p-3 text-right">
            Suma:
          </td>
          <td className="border border-orange-300 p-3 text-right">
            {-Math.abs(calcTotal(products)).toFixed(2)}
          </td>
          <td className="border border-orange-300 p-3"></td>
        </tr>
      </tbody>
    </table>
  );
}
