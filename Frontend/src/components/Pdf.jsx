import React, { useMemo } from "react";
import GhostCard from "./GhostCard";
import { currency } from "../utils/currencyList";

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    color: "black",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
  },
  pdf: {
    width: "794px", // A4 width
    minHeight: "1123px",
    margin: "0 auto",
    backgroundColor: "#fff",
    border: "1px solid #000",
    maxWidth:"794px",
    padding: "16px"
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  row: {
    display: "flex",
    width: "100%"
  },
  box: {
    border: "1px solid #000",
    padding: "8px",
    width: "50%"
  },
  boxFull: {
    border: "1px solid #000",
    padding: "8px",
    width: "100%",
    marginTop: "8px"
  },
  right: {
    textAlign: "right"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  },
  cell: {
    border: "1px solid #000",
    padding: "6px"
  },
  th: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold"
  },
  summary: {
    width: "40%",
    marginLeft: "auto",
    marginTop: "10px",
    borderCollapse: "collapse"
  },
  footerRow: {
    display: "flex",
    marginTop: "20px"
  }
};

/* ================= COMPONENT ================= */
const Pdf = ({data}) => {
  // Ensure data is available and properly structured
  if (!data || !data.invoicing) {
    return <div>Loading PDF preview...</div>;
  }

  const json = data;

  // Calculations

    const subTotal = Number(json.invoicing.subTotal).toFixed(2);
const taxPercent = Number(json.invoicing.additional.taxes).toFixed(2);
const discountPercent = Number(json.invoicing.additional.discount).toFixed(2);

const taxAmount = ((subTotal * taxPercent) / 100).toFixed(2);
const discountAmount =  (((subTotal ) * discountPercent) / 100).toFixed(2);
// const discountAmount = ((subTotal +taxAmount) * discountPercent) / 100;

const calculatedTotal = (subTotal + taxAmount - discountAmount).toFixed(2);
const date = new Date();
const year = date.getFullYear()

// Get currency symbol - reactive to data changes
const currencySymbol = useMemo(() => {
  const selectedCurrency = json.invoicing?.currency || "INR";
  return currency[selectedCurrency]?.symbol || "₹";
}, [json.invoicing?.currency]);

  return (
    <div style={styles.body}>
      <div style={styles.pdf}>
        <div style={styles.title}>TAX INVOICE</div>

        {/* FROM + INVOICE DETAILS */}
        <div style={styles.row}>
          <div style={{...styles.box , marginRight:".9px"}}>
            <b>{json.from?.name?.trim()  || <GhostCard name="name" width="w-32" />}</b><br />
            {json.from?.address?.trim()  || <GhostCard name="address" />}<br />
            {json.from?.city?.trim()  || <GhostCard name="city" width="w-16" />}, {json.from?.state?.trim()  || <GhostCard name="state" width="w-16"/>} ,{json.from?.country?.trim()  || <GhostCard name="country" width="w-16"/>} - {json.from?.zipcode?.trim()  || <GhostCard name="zipcode" width="w-16"/>}<br />
            Ph No: {json.from?.phNo?.trim()  || <GhostCard name="phNo" />} <br />
            Tax ID: {json.from?.gstId?.trim()  || <GhostCard name="gstId" />}<br />
            Email: {json.from?.email?.trim()  || <GhostCard name="email"/>}
          </div>

          <div style={{ ...styles.box, ...styles.right }}>
            Invoice No: <b>INV-{year}-XXX</b><br />
            Issue Date: {json.invoiceTerms?.issueDate?.trim()  || <GhostCard name="issueDate" width="w-32" />}<br />
            Due Date: {json.invoiceTerms?.dueDate?.trim()  || <GhostCard name="dueDate" width="w-32" />}
          </div>
        </div>

        {/* BILL TO */}
        <div style={styles.boxFull}>
          <b>Bill To</b><br />
          <b>{json.to?.name?.trim()  || <GhostCard name="name" width="w-32" />}</b><br />
            {json.to?.address?.trim()  || <GhostCard name="address" />}<br />
            {json.to?.city?.trim()  || <GhostCard name="city" width="w-16" />}, {json.to?.state?.trim()  || <GhostCard name="state" width="w-16"/>} ,{json.to?.country?.trim()  || <GhostCard name="country" width="w-16"/>}- {json.to?.zipcode?.trim()  || <GhostCard name="zipcode" width="w-16"/>}<br />

          Ph No: {json.to?.phNo?.trim()  || <GhostCard name="phNo" />} <br />
          Tax ID: {json.to?.gstId?.trim()  || <GhostCard name="gstId" />}<br />
          Email: {json.to?.email?.trim()  || <GhostCard name="email"/>}
        </div>

        {/* ITEMS TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.cell, ...styles.th }}>Description</th>
              <th style={{ ...styles.cell, ...styles.th }}>Qty</th>
              <th style={{ ...styles.cell, ...styles.th }}>Rate</th>
              <th style={{ ...styles.cell, ...styles.th }}>Amount</th>
            </tr>
          </thead>
          <tbody>
        {/* Ghost row — ONLY when no items exist */}
        {json.invoicing.items.length === 0 && (
          <tr style={{ color: "black" }}>
            <td style={{ ...styles.cell, color: "black" }}>
              <GhostCard style="w-full min-w-54" width="" name="description"/>
            </td>
            <td style={styles.cell}>
              <GhostCard style="w-full min-w-16" name="qty"/>
            </td>
            <td style={styles.cell}>
              <GhostCard style="w-full min-w-32"  name="rate"/>
            </td>
            <td style={styles.cell}>
              <GhostCard style="w-full min-w-38" name="amount" />
            </td>
          </tr>
        )}

        {/* Real items */}
       {json.invoicing.items.map((item, i) => (
  <tr style={{ color: "black" }} key={i}>
    <td style={styles.cell}>
      {item.description || <GhostCard name="description" />}
    </td>

    <td style={{ ...styles.cell, textAlign: "center" }}>
      {item.quantity}
    </td>

    <td style={{ ...styles.cell, textAlign: "right" }}>
      {currencySymbol} {Number(item.price).toFixed(2)}
    </td>

    <td style={{ ...styles.cell, textAlign: "right" }}>
      {currencySymbol} {(item.quantity * item.price).toFixed(2)}
    </td>
  </tr>
))}
      </tbody>

        </table>

        {/* TOTALS */}
        <table style={styles.summary}>
  <tbody>
  <tr>
    <td colSpan={2} style={styles.cell}>Subtotal</td>
    <td style={styles.cell}>
      {currencySymbol} {subTotal}
    </td>
  </tr>
  <tr>
    <td style={styles.cell}>Discount</td>
    <td style={{ ...styles.cell, textAlign: "center" }}>
      {discountPercent}%
    </td>
    <td style={styles.cell}>
      {currencySymbol} {discountAmount}
    </td>
  </tr>

  <tr>
    <td style={styles.cell}>Tax</td>
    <td style={{ ...styles.cell, textAlign: "center" }}>
      {taxPercent}%
    </td>
    <td style={styles.cell}>
      {currencySymbol} {taxAmount}
    </td>
  </tr>

  

  <tr>
    <th colSpan={2} style={{...styles.cell,...styles.th}}>Grand Total</th>
    <th style={{...styles.cell,...styles.th}}>
      {currencySymbol} {json.invoicing.total ?? calculatedTotal}
    </th>
  </tr>
</tbody>

</table>


        {/* BANK + SIGNATURE */}
        <div style={{...styles.footerRow}}>
          <div style={{...styles.box,marginRight:".9px"}}>
            <b>Bank Details</b><br />
            Bank: {json.paymentDetails?.bankName?.trim()  || <GhostCard name="Bank Name" width="w-32"/> }<br />
            A/C Name: {json.paymentDetails?.accountName?.trim()  || <GhostCard name="accountName" width="w-32"/>}<br />
            A/C No: {json.paymentDetails?.accountNumber?.trim()  || <GhostCard name="accountNumber" width="w-32"/>}<br />
            IFSC: {json.paymentDetails?.ifscCode?.trim()  || <GhostCard name="ifscCode" width="w-32"/>}
          </div>

          <div style={{ ...styles.box, ...styles.right }}>
            <br /><br /><br />
            For <b>{json.from?.name?.trim()  || <GhostCard name="name" width="w-32"/>}</b><br /><br />
            Authorised Signatory
          </div>
        </div>

        {/* NOTE */}
        {json.invoicing.note && (
      <p style={{ marginTop: "10px" }}>
        <b>Note:</b> {json.invoicing.note}
      </p>
    )}
        
        
      </div>
    </div>
  );
};

export default Pdf;
