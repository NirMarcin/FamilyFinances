import React from "react";
import UniversalList from "../common/UniversalList";

export default function ReceiptsProductsList({ products, onDelete }) {
  const totalSum = products.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <>
      {products.length > 0 ? (
        <>
          <UniversalList
            data={products}
            columns={[
              { key: "name", label: "Nazwa" },
              { key: "category", label: "Kategoria" },
              { key: "quantity", label: "Ilość" },
              {
                key: "unitPrice",
                label: "Cena jednostkowa",
                render: (item) => Number(item.unitPrice).toFixed(2),
              },
              {
                key: "total",
                label: "Suma",
                render: (item) => Number(item.total).toFixed(2),
              },
            ]}
            onDelete={onDelete}
          />
          <div className="text-right font-bold mt-2 mb-6 text-orange-700 dark:text-orange-300">
            Suma paragonu:{" "}
            <span className="text-orange-700 dark:text-orange-400">
              {totalSum.toFixed(2)} zł
            </span>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 dark:text-orange-300 my-4">
          Brak dodanych produktów.
        </div>
      )}
    </>
  );
}
