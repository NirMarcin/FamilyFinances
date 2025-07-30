import React, { useContext, useState } from "react";
import { ReceiptForm } from "./ReceiptForm";
import { CurrentProductsPreview } from "./CurrentProductsPreview";
import { ReceiptsList } from "./ReceiptsList";
import ReceiptModal from "./ReceiptsModal";
import ReceiptsContext from "../../contexts/ReceiptsContext";
import calcTotal from "../../utils/calcTotal";

export default function ReceiptManager() {
  const {
    currentProduct,
    currentProducts,
    shops,
    storeName,
    receipts,
    saveReceiptToDB,
    selectedReceipt,
    setSelectedReceipt,
    deleteReceipt,
    removeProduct,
    setStoreName,
    setCurrentProductField,
    addCurrentProduct,
    setCurrentProducts,
    updateReceipt,
  } = useContext(ReceiptsContext);

  const [editedReceiptId, setEditedReceiptId] = useState(null);

  const handleStoreChange = (e) => setStoreName(e.target.value);
  const handleCustomNameChange = (e) => setStoreName(e.target.value);

  function handleDeleteReceipt(id) {
    deleteReceipt(id);
    if (editedReceiptId === id) {
      setEditedReceiptId(null);
      setCurrentProducts([]);
      setStoreName("");
    }
  }

  function handleEditReceipt(id) {
    const receipt = receipts.find((r) => r.id === id);
    if (receipt) {
      setCurrentProducts(receipt.products);
      setStoreName(receipt.storeName);
      setEditedReceiptId(id);
    }
  }

  function handleAddProduct(e) {
    e.preventDefault();
    addCurrentProduct();
  }

  function handleSaveReceipt() {
    if (editedReceiptId) {
      updateReceipt({
        id: editedReceiptId,
        products: currentProducts,
        storeName,
      });
      setEditedReceiptId(null);
    } else {
      saveReceiptToDB();
    }
 
    setCurrentProducts([]);
    setStoreName("");
  }

  // Warunek blokady zapisu paragonu
  const disableSave =
    (!storeName && !shops.includes(storeName)) ||
    (storeName === "Inny" && !storeName) ||
    currentProducts.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
        {editedReceiptId ? "Edytuj paragon" : "Dodaj paragon"}
      </h1>

      <ReceiptForm
        currentProduct={currentProduct}
        onProductChange={(e) =>
          setCurrentProductField(e.target.name, e.target.value)
        }
        onAddProduct={handleAddProduct}
        shops={shops || []}
        selectedStore={shops.includes(storeName) ? storeName : "Inny"}
        customStoreName={!shops.includes(storeName) ? storeName : ""}
        onStoreChange={handleStoreChange}
        onCustomNameChange={handleCustomNameChange}
        onSaveReceipt={handleSaveReceipt}
        disableSave={disableSave}
      />

      <section className="mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <h3 className="text-xl font-semibold mb-4 text-orange-800">
          Podgląd paragonu (produkty przed zapisem)
        </h3>
        <CurrentProductsPreview
          products={currentProducts}
          onRemoveProduct={removeProduct}
        />
      </section>

      <section>
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700">
          Lista paragonów
        </h2>
        <ReceiptsList
          onEdit={handleEditReceipt}
          receipts={receipts}
          onOpenModal={setSelectedReceipt}
          calcTotal={calcTotal}
          onDelete={handleDeleteReceipt}
        />
      </section>

      <ReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        calcTotal={calcTotal}
      />
    </div>
  );
}
