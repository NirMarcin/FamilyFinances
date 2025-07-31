import React from "react";
import UniversalList from "../common/UniversalList";

export default function InvoiceList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <p className="text-gray-600 italic text-center">
        Brak dodanych transakcji.
      </p>
    );
  }

  return (
    <UniversalList
      data={transactions}
      columns={[
        { key: "date", label: "Data" },
        { key: "category", label: "Kategoria" },
        {
          key: "amount",
          label: "Kwota (zł)",
          align: "text-right",
          render: (item) => Number(item.amount).toFixed(2),
        },
        { key: "description", label: "Opis" },
      ]}
      onEdit={onEdit}
      onDelete={onDelete}
      deleteConfirmTitle="Potwierdź usunięcie"
      deleteConfirmMessage="Czy na pewno chcesz usunąć ten rachunek?"
    />
  );
}
