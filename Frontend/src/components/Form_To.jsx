import React, { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { inputStyles } from "../styles/inputStyles";
import { country } from "../utils/countryList";

const Form_To = ({ data, setData }) => {
  // Prepare country options
  const countryOptions = Object.entries(country).map(
    ([name, c]) => ({
      label: `${name} ${c.flag}`,
      code: c.code,
    })
  );

  const [countryInput, setCountryInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      to: { ...data.to, [name]: value },
    });
  };

  return (
    <div className="p-2 m-4">
      <h1 className="text-3xl font-bold">Client Details (To)</h1>

      <form className="flex flex-col gap-7 mt-6">
        {/* EMAIL */}
        <TextField
          label="Email"
          name="email"
          value={data.to.email}
          onChange={handleChange}
          error={
            data.to.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.to.email)
          }
          helperText={
            data.to.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.to.email)
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
          value={data.to.name}
          onChange={handleChange}
          error={
            (data.to.name.length > 0 && data.to.name.length < 2) ||
            data.to.name.length > 48
          }
          helperText={
            data.to.name.length > 48
              ? "Maximum 48 characters"
              : data.to.name.length > 0 && data.to.name.length < 2
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
          value={data.to.phNo}
          onChange={(e) => {
            if (/^\d{0,10}$/.test(e.target.value)) handleChange(e);
          }}
          error={data.to.phNo && data.to.phNo.length !== 10}
          helperText={
            data.to.phNo && data.to.phNo.length !== 10
              ? "Must be exactly 10 digits"
              : ""
          }
          sx={inputStyles}
        />

        {/* ADDRESS */}
        <TextField
          label="Address"
          name="address"
          value={data.to.address}
          onChange={handleChange}
          error={data.to.address.length > 0 && data.to.address.length < 5}
          helperText={
            data.to.address.length > 0 && data.to.address.length < 5
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
          value={data.to.city}
          onChange={handleChange}
          error={data.to.city.length > 0 && data.to.city.length < 2}
          helperText={
            data.to.city.length > 0 && data.to.city.length < 2
              ? "Minimum 2 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 24 } }}
          sx={inputStyles}
        />

        {/* STATE */}
        <TextField
          label="State"
          name="state"
          value={data.to.state}
          onChange={handleChange}
          error={data.to.state.length > 0 && data.to.state.length < 2}
          helperText={
            data.to.state.length > 0 && data.to.state.length < 2
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
          value={data.to.zipcode}
          onChange={(e) => {
            if (/^\d{0,6}$/.test(e.target.value)) handleChange(e);
          }}
          error={data.to.zipcode && data.to.zipcode.length !== 6}
          helperText={
            data.to.zipcode && data.to.zipcode.length !== 6
              ? "Must be 6 digits"
              : ""
          }
          sx={inputStyles}
        />

        {/* COUNTRY (SEARCHABLE) */}
        <Autocomplete
          options={countryOptions}
          value={
            countryOptions.find(
              (c) => c.code === data.to.country
            ) || null
          }
          inputValue={countryInput}
          onInputChange={(e, newInput) => setCountryInput(newInput)}
          onChange={(e, newValue) => {
            setData({
              ...data,
              to: {
                ...data.to,
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
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              placeholder="Select country"
              sx={inputStyles}
            />
          )}
        />

        {/* GST */}
        <TextField
          label="Tax ID"
          name="gstId"
          value={data.to.gstId}
          onChange={handleChange}
          error={data.to.gstId.length > 0 && data.to.gstId.length < 8}
          helperText={
            data.to.gstId.length > 0 && data.to.gstId.length < 8
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

export default Form_To;
