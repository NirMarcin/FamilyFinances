import React, { useReducer, useState } from "react";

const shops = [
  "Lidl",
  "Biedronka",
  "Auchan",
  "Carrefour",
  "Tesco",
  "Inny", // opcja do wpisania własnej nazwy
];

const initialState = {
  storeName: "",
  currentProduct: { name: "", category: "", price: "" },
  currentProducts: [],
  receipts: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_STORE_NAME":
      return { ...state, storeName: action.payload };

    case "SET_CURRENT_PRODUCT_FIELD":
      return {
        ...state,
        currentProduct: {
          ...state.currentProduct,
          [action.field]: action.value,
        },
      };

    case "ADD_CURRENT_PRODUCT": {
      const { name, category, price } = state.currentProduct;
      if (!name.trim() || !category.trim() || !price.trim()) {
        alert("Proszę wypełnić wszystkie pola produktu.");
        return state;
      }
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        alert("Cena musi być liczbą większą od 0.");
        return state;
      }
      const newProduct = {
        name: name.trim(),
        category: category.trim(),
        price: priceNum,
      };
      return {
        ...state,
        currentProducts: [...state.currentProducts, newProduct],
        currentProduct: { name: "", category: "", price: "" },
      };
    }

    case "SAVE_RECEIPT": {
      if (!state.storeName.trim()) {
        alert("Podaj nazwę sklepu.");
        return state;
      }
      if (state.currentProducts.length === 0) {
        alert("Dodaj przynajmniej jeden produkt.");
        return state;
      }
      const newReceipt = {
        id: Date.now(),
        storeName: state.storeName.trim(),
        date: new Date(),
        products: state.currentProducts,
      };
      return {
        ...state,
        receipts: [newReceipt, ...state.receipts],
        storeName: "",
        currentProducts: [],
      };
    }

    default:
      return state;
  }
}

function ReceiptManager() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [customStoreName, setCustomStoreName] = useState("");
  const [selectedStore, setSelectedStore] = useState(""); // do kontroli selecta

  const calcTotal = (products) =>
    products.reduce((sum, p) => sum + p.price, 0).toFixed(2);

  const handleProductChange = (e) => {
    dispatch({
      type: "SET_CURRENT_PRODUCT_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const addProduct = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_CURRENT_PRODUCT" });
  };

  const saveReceipt = () => {
    dispatch({ type: "SAVE_RECEIPT" });
  };

  const openModal = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const closeModal = () => {
    setSelectedReceipt(null);
  };
    // obsługa zmiany wyboru sklepu
  const handleStoreSelectChange = (e) => {
    const val = e.target.value;
    setSelectedStore(val);
    if (val === "Inny") {
      // czyszczymy nazwę sklepu w stanie gdy wybierzemy „Inny” i pokażemy pole tekstowe
      dispatch({ type: "SET_STORE_NAME", payload: "" });
    } else {
      // ustawiamy wybrany sklep w stanie
      dispatch({ type: "SET_STORE_NAME", payload: val });
      setCustomStoreName(""); // jeśli było cokolwiek w polu tekstowym to czyścimy
    }
  };

  // obsługa zmiany pola własnej nazwy sklepu
  const handleCustomStoreNameChange = (e) => {
    setCustomStoreName(e.target.value);
    dispatch({ type: "SET_STORE_NAME", payload: e.target.value });
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-700">
        Tworzenie paragonów
      </h1>

      {/* Formularz dodawania produktów */}
      <form
        onSubmit={addProduct}
        className="mb-8 border border-gray-300 p-5 rounded-lg bg-orange-50 shadow-inner"
        noValidate
      >
        <h2 className="text-2xl font-semibold mb-4 text-orange-800">
          Dodaj produkt
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Nazwa produktu"
            value={state.currentProduct.name}
            onChange={handleProductChange}
            className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Kategoria"
            value={state.currentProduct.category}
            onChange={handleProductChange}
            className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Cena"
            value={state.currentProduct.price}
            onChange={handleProductChange}
            min="0.01"
            step="0.01"
            className="border border-orange-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-5 bg-orange-600 hover:bg-orange-700 transition-colors text-white font-semibold py-2 px-6 rounded-md shadow-sm"
        >
          Dodaj produkt
        </button>
      </form>

      {/* Podgląd bieżącego paragonu */}
      <section className="mb-10 p-5 border border-gray-300 rounded-lg bg-orange-50 shadow-inner">
        <h3 className="text-xl font-semibold mb-4 text-orange-800">
          Podgląd paragonu (produkty przed zapisem)
        </h3>
        {state.currentProducts.length === 0 ? (
          <p className="text-gray-600 italic">Brak dodanych produktów.</p>
        ) : (
          <table className="w-full border border-orange-300 rounded-md shadow">
            <thead className="bg-orange-200 text-orange-900 font-semibold">
              <tr>
                <th className="border border-orange-300 p-3 text-left">Produkt</th>
                <th className="border border-orange-300 p-3 text-left">Kategoria</th>
                <th className="border border-orange-300 p-3 text-right">Cena (zł)</th>
              </tr>
            </thead>
            <tbody>
              {state.currentProducts.map(({ name, category, price }, i) => (
                <tr key={i} className="even:bg-orange-100">
                  <td className="border border-orange-300 p-3">{name}</td>
                  <td className="border border-orange-300 p-3">{category}</td>
                  <td className="border border-orange-300 p-3 text-right">
                    {price.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-orange-300 text-orange-900">
                <td colSpan={2} className="border border-orange-300 p-3 text-right">
                  Suma:
                </td>
                <td className="border border-orange-300 p-3 text-right">
                  {calcTotal(state.currentProducts)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      {/* Nazwa sklepu i zapis */}
      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 border border-gray-300 rounded-lg p-5 bg-orange-50 shadow-inner">
        <select
          value={selectedStore || state.storeName || ""}
          onChange={handleStoreSelectChange}
          className="border border-orange-300 rounded-md p-3 flex-shrink-0 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="" disabled>
            Wybierz sklep
          </option>
          {shops.map((shop) => (
            <option key={shop} value={shop}>
              {shop}
            </option>
          ))}
        </select>

        {/* Jeśli wybierzemy „Inny”, pokazujemy pole tekstowe */}
        {selectedStore === "Inny" && (
          <input
            type="text"
            placeholder="Wpisz nazwę sklepu"
            value={customStoreName}
            onChange={handleCustomStoreNameChange}
            className="border border-orange-300 rounded-md p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        )}

        {/* Jeśli wybrano sklep z listy (oprócz „Inny”), można nie pokazywać pola tekstowego */}

        <button
          onClick={saveReceipt}
          className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-2 px-8 rounded-md shadow-md"
          aria-label="Zapisz paragon"
        >
          Zapisz paragon
        </button>
      </div>

      {/* Tabela paragonów */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 text-orange-700">
          Lista paragonów
        </h2>
        {state.receipts.length === 0 ? (
          <p className="text-gray-600 italic text-center">Brak zapisanych paragonów</p>
        ) : (
          <table className="w-full border border-orange-300 rounded-lg shadow-md">
            <thead className="bg-orange-200 text-orange-900 font-semibold">
              <tr>
                <th className="border border-orange-300 p-3 text-left">Data</th>
                <th className="border border-orange-300 p-3 text-left">Sklep</th>
                <th className="border border-orange-300 p-3 text-right">Suma (zł)</th>
              </tr>
            </thead>
            <tbody>
              {state.receipts.map(({ id, date, storeName, products }) => (
                <tr
                  key={id}
                  className="cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => openModal({ id, date, storeName, products })}
                >
                  <td className="border border-orange-300 p-3">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </td>
                  <td className="border border-orange-300 p-3">{storeName}</td>
                  <td className="border border-orange-300 p-3 text-right">
                    {calcTotal(products)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Modal z paragonem */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl p-8 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold leading-none focus:outline-none"
              aria-label="Zamknij modal"
            >
              &times;
            </button>
            <h3
              id="modal-title"
              className="text-2xl font-bold mb-6 text-orange-700"
            >
              Paragon ze sklepu: {selectedReceipt.storeName}
            </h3>
            <p className="mb-6 text-gray-700">
              Data: {selectedReceipt.date.toLocaleDateString()}{" "}
              {selectedReceipt.date.toLocaleTimeString()}
            </p>

            <table className="w-full border border-orange-300 rounded-lg shadow">
              <thead className="bg-orange-200 text-orange-900 font-semibold">
                <tr>
                  <th className="border border-orange-300 p-3 text-left">Produkt</th>
                  <th className="border border-orange-300 p-3 text-left">Kategoria</th>
                  <th className="border border-orange-300 p-3 text-right">Cena (zł)</th>
                </tr>
              </thead>
              <tbody>
                {selectedReceipt.products.map(({ name, category, price }, i) => (
                  <tr key={i} className="even:bg-orange-100 hover:bg-orange-50">
                    <td className="border border-orange-300 p-3">{name}</td>
                    <td className="border border-orange-300 p-3">{category}</td>
                    <td className="border border-orange-300 p-3 text-right">
                      {price.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-orange-300 text-orange-900">
                  <td colSpan={2} className="border border-orange-300 p-3 text-right">
                    Suma:
                  </td>
                  <td className="border border-orange-300 p-3 text-right">
                    {calcTotal(selectedReceipt.products)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptManager;
