import { TextField, IconButton, Autocomplete } from "@mui/material";
import { inputStyles } from "../styles/inputStyles";
import { currency } from "../utils/currencyList";
import { MdDelete } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useEffect, useState } from "react";

const Form_Invoicing = ({ data, setData }) => {
  const items = data.invoicing.items || [];
  const [currencyInput, setCurrencyInput] = useState("");

  // Prepare currency options
  const currencyOptions = Object.entries(currency).map(
    ([code, data]) => ({
      label: `${code} - ${data.name} ${data.symbol}`,
      code: code,
      symbol: data.symbol,
      name: data.name,
    })
  );

  /* ---------- UPDATE ITEM (STRICT CONTROL) ---------- */
  const updateItem = (index, field, value) => {
    const updated = [...items];

    if (field === "quantity") {
      if (!/^\d{0,3}$/.test(value)) return;
      updated[index].quantity = value === "" ? "" : Number(value);
    }

    if (field === "price") {
      if (!/^\d{0,7}(\.\d{0,2})?$/.test(value)) return;
      updated[index].price = value === "" ? "" : Number(value);
    }

    if (field === "description") {
      updated[index].description = value;
    }

    setData({
      ...data,
      invoicing: { ...data.invoicing, items: updated },
    });
  };

  /* ---------- AUTO CALC ---------- */
  useEffect(() => {
    const subtotal = items.reduce((sum, i) => {
      const qty = Number(i.quantity) || 0;
      const price = Number(i.price) || 0;
      return sum + qty * price;
    }, 0);

    const discountPct = Number(data.invoicing.additional.discount) || 0;
    const taxPct = Number(data.invoicing.additional.taxes) || 0;

    const afterDiscount = subtotal - subtotal * (discountPct / 100);
    const total = afterDiscount + afterDiscount * (taxPct / 100);

    setData((prev) => ({
      ...prev,
      invoicing: {
        ...prev.invoicing,
        subTotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      },
    }));
  }, [
    items,
    data.invoicing.additional.discount,
    data.invoicing.additional.taxes,
  ]);

  /* ---------- ADD / REMOVE ---------- */
  const addItem = () => {
    setData({
      ...data,
      invoicing: {
        ...data.invoicing,
        items: [
          ...items,
          { description: "", quantity: 1, price: 0 },
        ],
      },
    });
  };

  const removeItem = (index) => {
    setData({
      ...data,
      invoicing: {
        ...data.invoicing,
        items: items.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="p-2 m-4">
      <h1 className="text-3xl font-bold">Invoice Details</h1>

      <div className="flex flex-col gap-7 mt-6">
        {/* ---------- CURRENCY ---------- */}
        <Autocomplete
          options={currencyOptions}
          value={
            currencyOptions.find(
              (c) => c.code === data.invoicing.currency
            ) || null
          }
          inputValue={currencyInput}
          onInputChange={(event, newInputValue) => {
            setCurrencyInput(newInputValue);
          }}
          onChange={(event, newValue) => {
            setData({
              ...data,
              invoicing: {
                ...data.invoicing,
                currency: newValue ? newValue.code : "",
              },
            });
            // Reset input when selection is made
            if (newValue) {
              setCurrencyInput("");
            }
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) =>
            option.code === value.code
          }
          clearOnEscape
          renderInput={(params) => (
            <TextField
              {...params}
              label="Currency"
              placeholder="Select currency"
              sx={inputStyles}
            />
          )}
        />

        {/* ---------- ITEMS ---------- */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Items</h2>

          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="border rounded p-3 bg-white/5"
              >
                {/* DESCRIPTION */}
                <TextField
                  value={item.description}
                  label="Description"
                  placeholder="Item description"
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  error={
                    item.description?.length > 0 &&
                    item.description.length < 2
                  }
                  helperText={
                    item.description?.length > 0 &&
                    item.description.length < 2
                      ? "Min 2 characters"
                      : ""
                  }
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                  fullWidth
                  sx={inputStyles}
                />

                {/* QTY / RATE / DELETE */}
                <div className="grid grid-cols-[1fr_2fr_40px] gap-3 mt-3 items-center">
                  <TextField
                    label="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    error={item.quantity < 1 || item.quantity > 999}
                    sx={{
                      ...inputStyles,
                      "& input": { textAlign: "center" },
                    }}
                  />

                  <TextField
                    label="Rate"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(index, "price", e.target.value)
                    }
                    error={item.price < 0}
                    sx={{
                      ...inputStyles,
                      "& input": { textAlign: "right" },
                    }}
                    onFocus={(e) => {
                      if (e.target.value === "0" || e.target.value === 0) {
                        e.target.select();
                      }
                    }}
                  />

                  <IconButton onClick={() => removeItem(index)}>
                    <MdDelete className="text-red-500" />
                  </IconButton>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 w-fit bg-amber-500 px-4 py-2 rounded font-semibold mt-2"
            >
              <IoIosAdd /> Add Item
            </button>
          </div>
        </div>

        {/* ---------- NOTES ---------- */}
        <TextField
          label="Notes"
          multiline
          rows={3}
          value={data.invoicing.note}
          onChange={(e) =>
            setData({
              ...data,
              invoicing: {
                ...data.invoicing,
                note: e.target.value,
              },
            })
          }
          slotProps={{ htmlInput: { maxLength: 300 } }}
          sx={inputStyles}
        />

        {/* ---------- DISCOUNT ---------- */}
        <TextField
          label="Discount (%)"
          value={data.invoicing.additional.discount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setData({
                ...data,
                invoicing: {
                  ...data.invoicing,
                  additional: {
                    ...data.invoicing.additional,
                    discount: "",
                  },
                },
              });
              return;
            }
            if (!/^\d{0,3}$/.test(value)) return;
            if (Number(value) > 100) return;

            setData({
              ...data,
              invoicing: {
                ...data.invoicing,
                additional: {
                  ...data.invoicing.additional,
                  discount: Number(value),
                },
              },
            });
          }}
          inputProps={{ inputMode: "numeric" }}
          sx={inputStyles}
        />

        {/* ---------- TAXES ---------- */}
        <TextField
          label="Taxes (%)"
          value={data.invoicing.additional.taxes}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setData({
                ...data,
                invoicing: {
                  ...data.invoicing,
                  additional: {
                    ...data.invoicing.additional,
                    taxes: "",
                  },
                },
              });
              return;
            }
            if (!/^\d{0,3}$/.test(value)) return;
            if (Number(value) > 100) return;

            setData({
              ...data,
              invoicing: {
                ...data.invoicing,
                additional: {
                  ...data.invoicing.additional,
                  taxes: Number(value),
                },
              },
            });
          }}
          inputProps={{ inputMode: "numeric" }}
          sx={inputStyles}
        />
      </div>
    </div>
  );
};

export default Form_Invoicing;
