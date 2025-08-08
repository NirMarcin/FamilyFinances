import React from "react";
import UniversalList from "../common/UniversalList";
import Button from "../buttons/Button";


export default function ReceiptsProductsList({ products, onDelete }) {
  const totalSum = products.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <>
      {products.length > 0 ? (
        <>
          <UniversalList
            data={products}
            columns={[
              {
                key: "name",
                label: "Nazwa",
                cellClass: "dark:text-orange-400",
              },
              {
                key: "category",
                label: "Kategoria",
                cellClass: "dark:text-orange-400",
              },
              {
                key: "quantity",
                label: "Ilość",
                cellClass: "dark:text-orange-400",
              },
              {
                key: "unitPrice",
                label: "Cena jednostkowa",
                render: (item) => Number(item.unitPrice).toFixed(2),
                cellClass: "dark:text-orange-400",
              },
              {
                key: "total",
                label: "Suma",
                render: (item) => Number(item.total).toFixed(2),
                cellClass: "dark:text-orange-400",
              },
              {
                key: "actions",
                label: "Akcje",
                cellClass: "text-center",
                render: (item) => (
                  <Button onClick={() => onDelete(item.id)}>Usuń</Button>
                ),
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
