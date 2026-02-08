import { TextField,Autocomplete } from "@mui/material";
import React from "react";
import { country } from "../utils/countryList.js";

const Form_From = ({ data, setData }) => {
const [countryInput, setCountryInput] = React.useState("");



  const countryOptions = Object.entries(country).map(
  ([name, data]) => ({
    label: `${name} ${data.flag} `,
    code: data.code,
  })
);

  const inputStyles = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#374151",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#374151",
    },
    "& .MuiInputBase-input": {
      color: "#111827",
    },
    "& .MuiInputLabel-root": {
      color: "#9CA3AF",
    },
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      from: { ...data.from, [name]: value },
    });
  };

  return (
    <div className="p-2 m-4">
      <h1 className="font-bold text-3xl">Your Details (From)</h1>

      <form className="flex flex-col gap-7 mt-6">
        {/* EMAIL */}
        <TextField
          label="Email"
          name="email"
          value={data.from.email}
          onChange={handleFormChange}
          error={
            data.from.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from.email)
          }
          helperText={
            data.from.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from.email)
              ? "Invalid email format"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 48 } }}
          sx={inputStyles}
        />

        {/* NAME */}
        <TextField
          label="Name"
          name="name"
          value={data.from.name}
          onChange={handleFormChange}
          error={
            (data.from.name.length > 0 && data.from.name.length < 2) ||
            data.from.name.length > 48
          }
          helperText={
            data.from.name.length > 48
              ? "Maximum 48 characters"
              : data.from.name.length > 0 && data.from.name.length < 2
              ? "Minimum 2 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 48 } }}
          sx={inputStyles}
        />

        {/* PHONE */}
        <TextField
          label="Phone Number"
          name="phNo"
          value={data.from.phNo}
          onChange={(e) => {
            if (/^\d{0,10}$/.test(e.target.value)) {
              handleFormChange(e);
            }
          }}
          error={data.from.phNo && data.from.phNo.length !== 10}
          helperText={
            data.from.phNo && data.from.phNo.length !== 10
              ? "Must be exactly 10 digits"
              : ""
          }
          sx={inputStyles}
        />

        {/* ADDRESS */}
        <TextField
          label="Address"
          name="address"
          value={data.from.address}
          onChange={handleFormChange}
          error={
            data.from.address.length > 0 && data.from.address.length < 5
          }
          helperText={
            data.from.address.length > 0 && data.from.address.length < 5
              ? "Minimum 5 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 64 } }}
          sx={inputStyles}
        />

        {/* CITY */}
        <TextField
          label="City"
          name="city"
          value={data.from.city}
          onChange={handleFormChange}
          error={data.from.city.length > 0 && data.from.city.length < 2}
          helperText={
            data.from.city.length > 0 && data.from.city.length < 2
              ? "Minimum 2 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 24} }}
          sx={inputStyles}
        />

        {/* STATE */}
        <TextField
          label="State"
          name="state"
          value={data.from.state}
          onChange={handleFormChange}
          error={data.from.state.length > 0 && data.from.state.length < 2}
          helperText={
            data.from.state.length > 0 && data.from.state.length < 2
              ? "Minimum 2 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 24 } }}
          sx={inputStyles}
        />

        {/* ZIPCODE */}
        <TextField
          label="Zipcode"
          name="zipcode"
          value={data.from.zipcode}
          onChange={(e) => {
            if (/^\d{0,6}$/.test(e.target.value)) {
              handleFormChange(e);
            }
          }}
          error={data.from.zipcode && data.from.zipcode.length !== 6}
          helperText={
            data.from.zipcode && data.from.zipcode.length !== 6
              ? "Must be 6 digits"
              : ""
          }
          sx={inputStyles}
        />

       {/* COUNTRY */}
<div>
  <Autocomplete
    options={countryOptions}
    value={
      countryOptions.find(
        (c) => c.code === data.from.country
      ) || null
    }
    inputValue={countryInput}
    onInputChange={(event, newInputValue) => {
      setCountryInput(newInputValue);
    }}
    onChange={(event, newValue) => {
      setData({
        ...data,
        from: {
          ...data.from,
          country: newValue ? newValue.code : "",
        },
      });
      // Reset input when selection is made
      if (newValue) {
        setCountryInput("");
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
        label="Country"
        placeholder="Select country"
        sx={inputStyles}
      />
    )}
  />
</div>








        {/* GST */}
        <TextField
          label="Tax ID"
          name="gstId"
          value={data.from.gstId}
          onChange={handleFormChange}
          error={data.from.gstId.length > 0 && data.from.gstId.length < 8}
          helperText={
            data.from.gstId.length > 0 && data.from.gstId.length < 8
              ? "Minimum 8 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 15 } }}
          sx={inputStyles}
        />
      </form>
    </div>
  );
};

export default Form_From;





// import { TextField } from "@mui/material";
// import React from "react";
// import { country } from "../utils/countryList.js";

// const Form_From = ({ data, setData }) => {
//   const inputStyles = {
//     "& .MuiOutlinedInput-root.Mui-focused fieldset": {
//       borderColor: "#374151",
//     },
//     "& .MuiInputLabel-root.Mui-focused": {
//       color: "#374151",
//     },
//     "& .MuiInputBase-input": {
//       color: "#111827",
//     },
//     "& .MuiInputLabel-root": {
//       color: "#9CA3AF",
//     },
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setData({
//       ...data,
//       from: { ...data.from, [name]: value },
//     });
//   };

//   return (
//     <div className="p-2 m-4">
//       <h1 className="font-bold text-3xl">Your Details (From)</h1>

//       <form className="flex flex-col gap-7 mt-6">
//         {/* EMAIL */}
//         <TextField
//           label="Email"
//           name="email"
//           value={data.from.email}
//           onChange={handleFormChange}
//           error={
//             data.from.email &&
//             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from.email)
//           }
//           helperText={
//             data.from.email &&
//             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.from.email)
//               ? "Invalid email format"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 48 } }}
//           sx={inputStyles}
//         />

//         {/* NAME */}
//         <TextField
//           label="Name"
//           name="name"
//           value={data.from.name}
//           onChange={handleFormChange}
//           error={
//             (data.from.name.length > 0 && data.from.name.length < 2) ||
//             data.from.name.length > 48
//           }
//           helperText={
//             data.from.name.length > 48
//               ? "Maximum 48 characters"
//               : data.from.name.length > 0 && data.from.name.length < 2
//               ? "Minimum 2 characters"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 48 } }}
//           sx={inputStyles}
//         />

//         {/* PHONE */}
//         <TextField
//           label="Phone Number"
//           name="phNo"
//           value={data.from.phNo}
//           onChange={(e) => {
//             if (/^\d{0,10}$/.test(e.target.value)) {
//               handleFormChange(e);
//             }
//           }}
//           error={data.from.phNo && data.from.phNo.length !== 10}
//           helperText={
//             data.from.phNo && data.from.phNo.length !== 10
//               ? "Must be exactly 10 digits"
//               : ""
//           }
//           sx={inputStyles}
//         />

//         {/* ADDRESS */}
//         <TextField
//           label="Address"
//           name="address"
//           value={data.from.address}
//           onChange={handleFormChange}
//           error={
//             data.from.address.length > 0 && data.from.address.length < 5
//           }
//           helperText={
//             data.from.address.length > 0 && data.from.address.length < 5
//               ? "Minimum 5 characters"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 64 } }}
//           sx={inputStyles}
//         />

//         {/* CITY */}
//         <TextField
//           label="City"
//           name="city"
//           value={data.from.city}
//           onChange={handleFormChange}
//           error={data.from.city.length > 0 && data.from.city.length < 2}
//           helperText={
//             data.from.city.length > 0 && data.from.city.length < 2
//               ? "Minimum 2 characters"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 24} }}
//           sx={inputStyles}
//         />

//         {/* STATE */}
//         <TextField
//           label="State"
//           name="state"
//           value={data.from.state}
//           onChange={handleFormChange}
//           error={data.from.state.length > 0 && data.from.state.length < 2}
//           helperText={
//             data.from.state.length > 0 && data.from.state.length < 2
//               ? "Minimum 2 characters"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 24 } }}
//           sx={inputStyles}
//         />

//         {/* ZIPCODE */}
//         <TextField
//           label="Zipcode"
//           name="zipcode"
//           value={data.from.zipcode}
//           onChange={(e) => {
//             if (/^\d{0,6}$/.test(e.target.value)) {
//               handleFormChange(e);
//             }
//           }}
//           error={data.from.zipcode && data.from.zipcode.length !== 6}
//           helperText={
//             data.from.zipcode && data.from.zipcode.length !== 6
//               ? "Must be 6 digits"
//               : ""
//           }
//           sx={inputStyles}
//         />

//         {/* COUNTRY */}
//         <TextField
//           label="Country"
//           name="country"
//           value={data.from.country}
//           onChange={handleFormChange}
//           error={
//             data.from.country.length > 0 && data.from.country.length < 2
//           }
//           helperText={
//             data.from.country.length > 0 && data.from.country.length < 2
//               ? "Minimum 2 characters"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 24 } }}
//           sx={inputStyles}
//         />

//         {/* GST */}
//         <TextField
//           label="GST ID"
//           name="gstId"
//           value={data.from.gstId}
//           onChange={handleFormChange}
//           error={data.from.gstId.length > 0 && data.from.gstId.length < 8}
//           helperText={
//             data.from.gstId.length > 0 && data.from.gstId.length < 8
//               ? "Minimum 8 characters"
//               : ""
//           }
//           slotProps={{ htmlInput: { maxLength: 15 } }}
//           sx={inputStyles}
//         />
//       </form>
//     </div>
//   );
// };

// export default Form_From;
