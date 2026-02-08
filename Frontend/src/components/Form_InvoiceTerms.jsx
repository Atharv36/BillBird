import { TextField } from "@mui/material";
import { inputStyles } from "../styles/inputStyles";

const Form_InvoiceTerms = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      invoiceTerms: { ...data.invoiceTerms, [name]: value },
    });
  };

  return (
    <div className="p-4 m-4">
      <h1 className="text-3xl font-bold">Invoice Terms</h1>

      <form className="flex flex-col gap-7 mt-6">
        

        {/* ISSUE DATE */}
        <TextField
          type="date"
          label="Issue Date"
          name="issueDate"
          value={data.invoiceTerms.issueDate}
          onChange={handleChange}
          error={!data.invoiceTerms.issueDate}
          helperText={
            !data.invoiceTerms.issueDate ? "Required field" : ""
          }
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />

        {/* DUE DATE */}
        <TextField
          type="date"
          label="Due Date"
          name="dueDate"
          value={data.invoiceTerms.dueDate}
          onChange={handleChange}
          error={
            data.invoiceTerms.dueDate &&
            data.invoiceTerms.issueDate &&
            data.invoiceTerms.dueDate < data.invoiceTerms.issueDate
          }
          helperText={
            data.invoiceTerms.dueDate &&
            data.invoiceTerms.issueDate &&
            data.invoiceTerms.dueDate < data.invoiceTerms.issueDate
              ? "Due date must be after issue date"
              : ""
          }
          sx={inputStyles}
          InputLabelProps={{ shrink: true }}
        />
      </form>
    </div>
  );
};

export default Form_InvoiceTerms;
