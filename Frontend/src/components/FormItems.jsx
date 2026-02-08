import { TextField, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { inputStyles } from "../styles/inputStyles";

const Form_Items = ({ data, setData }) => {
  const items = data.invoicing.items || [];

  const updateItem = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: key === "qty" || key === "price" ? Number(value) : value
    };

    setData({
      ...data,
      invoicing: { ...data.invoicing, items: updatedItems }
    });
  };

  const addItem = () => {
    setData({
      ...data,
      invoicing: {
        ...data.invoicing,
        items: [...items, { name: "", qty: 1, price: 0 }]
      }
    });
  };

  const removeItem = (index) => {
    setData({
      ...data,
      invoicing: {
        ...data.invoicing,
        items: items.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="mt-6 p-2">
      <h2 className="text-2xl font-bold text-amber-200">Invoice Items</h2>

      <div className="flex flex-col gap-4 mt-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap gap-3 items-center w-full"
          >
            {/* Item name (full width, handles long text) */}
            <TextField
              label="Item"
              placeholder="Item name"
              value={item.name}
              sx={inputStyles}
              onChange={(e) =>
                updateItem(index, "name", e.target.value)
              }
              className="flex-1 min-w-[250px]"
            />

            {/* Qty */}
            <TextField
              label="Qty"
              type="number"
              sx={inputStyles}
              value={item.qty}
              onChange={(e) =>
                updateItem(index, "qty", e.target.value)
              }
              slotProps={{
              input: {
                min: 1,
                max: 999,
                step: 1,
              },
              }}
              className="w-24"
            />

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              sx={inputStyles}
              value={item.price}
              onChange={(e) =>
                updateItem(index, "price", e.target.value)
              }
              className="w-32"
              inputProps={{ min: 0, step: "0.01" }}
            />

            <IconButton onClick={() => removeItem(index)}>
              <Delete sx={{ color: "#ff6363" }} />
            </IconButton>
          </div>
        ))}

        <button
          onClick={addItem}
          type="button"
          className="flex items-center gap-2 w-fit bg-amber-500 hover:bg-amber-400 px-4 py-2 text-gray-900 rounded font-semibold"
        >
          <Add /> Add Item
        </button>
      </div>
    </div>
  );
};

export default Form_Items;
