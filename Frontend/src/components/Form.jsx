import React, { useState } from "react";
import Form_From from "./Form_From";
import Form_To from "./Form_To";
import Form_Invoicing from "./Form_Invoicing";
import Form_PaymentDetails from "./Form_PaymentDetails";
import Form_InvoiceTerms from "./Form_InvoiceTerms";
import { validators } from "../utils/validators.js";
import { createInvoice, updateInvoiceAPI } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const Form = ({ formData, setFormData, step, setStep, editMode = false, invoiceId = null }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  /* ---------- STEP VALIDATION ---------- */
  const isStepValid = validators[step]?.(formData);

  /* ---------- NAVIGATION ---------- */
  const nextStep = () => {
    if (!isStepValid) return; // 🚫 block invalid step
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  /* ---------- FINAL SUBMIT ---------- */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editMode && invoiceId) {
        await updateInvoiceAPI(invoiceId, formData);
        toast.success("Invoice updated successfully!", {
          icon: '✅',
        });
      } else {
        const savedInvoice = await createInvoice(formData);
        const id = savedInvoice.id;

        if (!id) {
          throw new Error("Invoice ID missing from response");
        }

        toast.success("Invoice created successfully! Opening PDF...", {
          icon: '📄',
        });

        // 🔥 open PDF immediately
        setTimeout(() => {
          window.open(
            `${apiBaseUrl}/api/invoice/${id}/pdf`,
            "_blank"
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to save invoice", error);
      const errorMessage = error.response?.data?.message || "Failed to save invoice. Please try again.";
      toast.error(errorMessage, {
        icon: '❌',
      });
    } finally {
      setLoading(false);
      localStorage.removeItem("invoiceData");
      navigate("/dashboard");
    }
  };


  /* ---------- STEPS ---------- */
  const forms = [
    <Form_From key="from" data={formData} setData={setFormData} />,
    <Form_To key="to" data={formData} setData={setFormData} />,
    <Form_Invoicing key="inv" data={formData} setData={setFormData} />,
    <Form_PaymentDetails key="pay" data={formData} setData={setFormData}/>,
    <Form_InvoiceTerms key="terms" data={formData} setData={setFormData}/>,
  ];
  console.log(formData)
  return (
    <div className="flex flex-col h-full">
      {/* ---------- CURRENT STEP ---------- */}
      {forms[step - 1]}

      {/* ---------- FOOTER NAV ---------- */}
      <div className="mt-auto flex justify-between pt-4">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 text-amber-100 bg-gray-600 rounded"
          >
            ← Back
          </button>
        )}

        {step < forms.length && (
          <button
            onClick={nextStep}
            disabled={!isStepValid}
            className={`ml-auto px-4 py-2 rounded transition ${
              isStepValid
                ? "bg-gray-600 text-amber-100"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Next →
          </button>
        )}

        {step === forms.length && (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid || loading}
            className={`ml-auto px-4 py-2 rounded text-amber-100 transition
              ${
                isStepValid && !loading
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-green-400 cursor-not-allowed opacity-60"
              }`}
          >
            {loading ? "Saving..." : editMode ? "Update Invoice" : "Generate Invoice"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Form;
