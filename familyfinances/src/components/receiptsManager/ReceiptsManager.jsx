import React, { useContext, useState } from "react";
import ReceiptsForm from "./ReceiptsForm";
import ReceiptsList from "./ReceiptsList";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import ModalDetails from "../modals/ModalDetails";

export default function ReceiptsManager() {
  const {
    receipts,
    addReceipt,
    editReceipt,
  } = useContext(ReceiptsContext);

  const [editedReceiptId, setEditedReceiptId] = useState(null);

  const editedReceipt = receipts.find((r) => r.id === editedReceiptId) || null;

  const handleEdit = (id) => setEditedReceiptId(id);
  const handleCancelEdit = () => setEditedReceiptId(null);

  const handleSubmit = (data) => {
    if (editedReceiptId) {
      editReceipt(data);
    } else {
      addReceipt(data);
    }
    setEditedReceiptId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
        Dodaj/Usuń paragon
      </h1>

      <ReceiptsForm
        initialData={editedReceipt}
        onCancel={editedReceiptId ? handleCancelEdit : undefined}
        onSubmit={handleSubmit}
      />

      <ReceiptsList onEdit={handleEdit} />
    </div>
  );
}
