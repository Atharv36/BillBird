import { downloadInvoicePdfAPI } from "../api/index.js";
import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteInvoice } from "../store/reducers/invoiceSlice";
import { currency } from "../utils/currencyList";
import ConfirmDialogue from "./ConfirmDialogue";

const InvoiceCard = ({ invoice, onDeleteSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const parsedInvoice = invoice?.invoiceJson;

  if (!parsedInvoice) {
    return (
      <div className="w-full bg-red-100 mb-6 rounded-2xl p-4 shadow-lg">
        Invalid invoice data
      </div>
    );
  }

  const { from, to, invoicing, invoiceTerms } = parsedInvoice;

  // Get currency symbol for this invoice
  const currencySymbol = useMemo(() => {
    const selectedCurrency = invoicing?.currency || "INR";
    return currency[selectedCurrency]?.symbol || "₹";
  }, [invoicing?.currency]);

  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    try {
      const res = await downloadInvoicePdfAPI(invoice.id);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err.response || err);
      const backend = err.response?.data;
      const message =
        (backend && typeof backend === "object" && (backend.message || backend.error)) ||
        (typeof backend === "string" ? backend : null) ||
        "Failed to generate PDF. Please try again.";
      alert(message);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/edit/${invoice.id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(deleteInvoice(invoice.id)).unwrap();
      setShowDeleteConfirm(false);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (err) {
      alert(err || "Failed to delete invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full bg-white mb-6 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold">{from.name}</h2>
          <p className="text-sm text-gray-500">{from.email}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold">Invoice</p>
          <p className="text-sm text-gray-600">
            #{invoice.invoiceNumber}
          </p>
        </div>
      </div>

      {/* BILL TO + DATES */}
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">Bill To</p>
          <p>{to.name}</p>
          <p className="text-sm text-gray-600">{to.email}</p>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Issue Date:{" "}
            {invoiceTerms.issueDate.split("-").reverse().join("-")}
          </p>
          <p>
            Due Date:{" "}
            {invoiceTerms.dueDate.split("-").reverse().join("-")}
          </p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="border rounded-lg overflow-hidden mt-4">
        <div className="grid grid-cols-4 bg-gray-100 text-sm font-semibold p-2">
          <span>Description</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Price</span>
          <span className="text-right">Total</span>
        </div>

       {invoicing.items.map((item, index) => {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const total = qty * price;

  return (
    <div key={index} className="grid grid-cols-4 text-sm p-2 border-t">
      <span>{item.description}</span>
      <span className="text-center">{qty}</span>
      <span className="text-right">{currencySymbol}{price}</span>
      <span className="text-right">{currencySymbol}{total.toFixed(2)}</span>
    </div>
  );
})}

      </div>

      {/* TOTALS */}
      <div className="ml-auto w-64 text-sm mt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currencySymbol}{invoicing.subTotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Taxes</span>
          <span>{invoicing.additional.taxes}%</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t mt-2 pt-2">
          <span>Total</span>
          <span>{currencySymbol}{invoicing.total}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end mt-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="cursor-pointer px-4 py-2 rounded-lg border-2 border-blue-400 text-blue-600 hover:bg-blue-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          disabled={loading}
          className="cursor-pointer px-4 py-2 rounded-lg border-2 border-red-400 text-red-600 hover:bg-red-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleGeneratePdf();
          }}
          disabled={pdfLoading}
          className="cursor-pointer px-4 py-2 rounded-lg border-2 border-green-400 text-green-600 hover:bg-green-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? "Loading..." : "Generate PDF"}
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialogue
          message="Are you sure you want to delete this invoice? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default InvoiceCard;
