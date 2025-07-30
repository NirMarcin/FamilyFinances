import Button from "../Buttons/Button";
import InputField from "../Fields/InputField";

export function ReceiptForm({
  currentProduct,
  onProductChange,
  onAddProduct,
  shops = [],
  selectedStore,
  customStoreName,
  onStoreChange,
  onCustomNameChange,
  onSaveReceipt,
  disableSave,
}) {
  // Walidacja produktu (prosty UX: blokuj dodanie pustego produktu)
  const disableAdd =
    !currentProduct.name ||
    !currentProduct.category ||
    !currentProduct.price ||
    Number(currentProduct.price) <= 0;
  const classInput =
    "w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  return (
    <form
      onSubmit={onAddProduct}
      noValidate
      className="mb-8 border border-gray-300 p-5 rounded-lg bg-orange-50 shadow-inner"
      autoComplete="off"
    >
      {/* Sekcja produktu */}
      <fieldset className="mb-8">
        <legend className="text-2xl font-semibold mb-4 text-orange-800">
          Dodaj produkt
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InputField
            label="Nazwa produktu"
            type="text"
            name="name"
            placeholder="np. Chleb"
            value={currentProduct.name}
            onChange={onProductChange}
            className={classInput}
            required
            aria-label="Nazwa produktu"
          />
          <InputField
            label="Kategoria"
            type="text"
            name="category"
            placeholder="np. Pieczywo"
            value={currentProduct.category}
            onChange={onProductChange}
            className={classInput}
            required
            aria-label="Kategoria produktu"
          />
          <InputField
            label="Cena"
            type="number"
            name="price"
            placeholder="np. 4.99"
            value={currentProduct.price}
            onChange={onProductChange}
            min="0.01"
            step="0.01"
            className={classInput}
            required
            aria-label="Cena produktu"
          />
        </div>
        <Button
          type="submit"
          disabled={disableAdd}
          className={`mt-5 w-full sm:w-auto ${
            disableAdd
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          } transition-colors text-white font-semibold py-2 px-6 rounded-md shadow-sm`}
          aria-label="Dodaj produkt"
        >
          Dodaj produkt
        </Button>
      </fieldset>

      {/* Sekcja sklep + zapis */}
      <fieldset>
        <legend className="text-2xl font-semibold mb-4 text-orange-800">
          Sklep i zapis paragonu
        </legend>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2">
            <select
              id="store-select"
              value={selectedStore || ""}
              onChange={onStoreChange}
              className="w-full px-4 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              aria-label="Wybierz sklep"
            >
              {shops.map((shop, index) => (
                <option key={`${shop}-${index}`} value={shop}>
                  {shop}
                </option>
              ))}
              <option value="Inny">Inny</option>
            </select>
            {selectedStore === "Inny" && (
              <InputField
                label="Nazwa sklepu"
                type="text"
                placeholder="Wpisz nazwę sklepu"
                value={customStoreName}
                onChange={onCustomNameChange}
                className={classInput}
                aria-label="Nazwa sklepu"
                required
              />
            )}
          </div>
          {/* Kontener na pole tekstowe i przycisk */}
          <div className="w-full sm:w-1/2 flex flex-col gap-2">
            <Button
              variant="primary"
              type="button"
              onClick={onSaveReceipt}
              disabled={disableSave}
              className={`w-full ${
                disableSave
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors text-white font-semibold py-2 px-8 rounded-md shadow-md min-h-[44px]`}
              aria-label="Zapisz paragon"
              style={{ minHeight: "44px" }} // zapewnia stałą wysokość
            >
              Zapisz paragon
            </Button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
