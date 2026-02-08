import { TextField } from "@mui/material";
import { inputStyles } from "../styles/inputStyles";

const Form_PaymentDetails = ({ data, setData }) => {
  const updateField = (field, value) => {
    setData({
      ...data,
      paymentDetails: {
        ...data.paymentDetails,
        [field]: value,
      },
    });
  };

  return (
    <div className="p-4 m-4 min-h-[60vh]">
      <h1 className="text-3xl font-bold">Payment Information</h1>

      <form className="flex flex-col gap-7 mt-6">
        {/* ---------- BANK NAME ---------- */}
        <TextField
          label="Bank Name"
          value={data.paymentDetails.bankName}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^[a-zA-Z\s]{0,50}$/.test(value)) return;
            updateField("bankName", value);
          }}
          error={
            data.paymentDetails.bankName.length > 0 &&
            data.paymentDetails.bankName.length < 2
          }
          helperText={
            data.paymentDetails.bankName.length > 0 &&
            data.paymentDetails.bankName.length < 2
              ? "Minimum 2 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 50 } }}
          sx={inputStyles}
        />

        {/* ---------- ACCOUNT NAME ---------- */}
        <TextField
          label="Account Name"
          value={data.paymentDetails.accountName}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^[a-zA-Z\s]{0,50}$/.test(value)) return;
            updateField("accountName", value);
          }}
          error={
            data.paymentDetails.accountName.length > 0 &&
            data.paymentDetails.accountName.length < 2
          }
          helperText={
            data.paymentDetails.accountName.length > 0 &&
            data.paymentDetails.accountName.length < 2
              ? "Minimum 2 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 50 } }}
          sx={inputStyles}
        />

        {/* ---------- ACCOUNT NUMBER ---------- */}
        <TextField
          label="Account Number"
          value={data.paymentDetails.accountNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^\d{0,20}$/.test(value)) return;
            updateField("accountNumber", value);
          }}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "."].includes(e.key)) {
              e.preventDefault();
            }
          }}
          error={
            data.paymentDetails.accountNumber.length > 0 &&
            data.paymentDetails.accountNumber.length < 8
          }
          helperText={
            data.paymentDetails.accountNumber.length > 0 &&
            data.paymentDetails.accountNumber.length < 8
              ? "Minimum 8 digits"
              : ""
          }
          inputProps={{ inputMode: "numeric" }}
          sx={inputStyles}
        />

        {/* ---------- IFSC CODE ---------- */}
        <TextField
          label="IFSC Code"
          value={data.paymentDetails.ifscCode}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (!/^[A-Z0-9]{0,11}$/.test(value)) return;
            updateField("ifscCode", value);
          }}
          error={
            data.paymentDetails.ifscCode.length > 0 &&
            data.paymentDetails.ifscCode.length !== 11
          }
          helperText={
            data.paymentDetails.ifscCode.length > 0 &&
            data.paymentDetails.ifscCode.length !== 11
              ? "Must be exactly 11 characters"
              : ""
          }
          slotProps={{ htmlInput: { maxLength: 11 } }}
          sx={inputStyles}
        />
      </form>
    </div>
  );
};

export default Form_PaymentDetails;
