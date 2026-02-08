import React, { useEffect, useState } from 'react'
import Form from '../components/Form'
import { useParams, useNavigate } from 'react-router-dom';
import Pdf from '../components/Pdf.jsx';
import { getInvoiceByIdAPI } from '../api/index.js';
import toast from 'react-hot-toast';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const emptyFormState = {
    from: { email: "", name: "", phNo: "", address: "", city: "", state: "", zipcode: "", country: "", gstId: "", logo: "" },
    to: { email: "", name: "", phNo: "", address: "", city: "", state: "", zipcode: "", country: "", gstId: "", logo: "" },
    invoicing: { currency: "", items: [], subTotal: "", total: "", note: "", additional: { discount: "", taxes: "" } },
    paymentDetails: { bankName: "", accountName: "", accountNumber: "", ifscCode: "" },
    invoiceTerms: { issueDate: "", dueDate: "" }
  };

  const [formData, setFormData] = useState(emptyFormState);
  const [step, setStep] = useState(1);
  const [resetIndex, setResetIndex] = useState(0);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await getInvoiceByIdAPI(id);
        const invoiceData = res.data?.invoiceJson;

        if (invoiceData) {
          setFormData(invoiceData);
          setResetIndex((prev) => prev + 1);
        } else {
          toast.error("Invoice data not found", {
            icon: '❌',
          });
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        const errorMessage = err.response?.data?.message || "Failed to load invoice. Please try again.";
        toast.error(errorMessage, {
          icon: '❌',
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }


  return (
    <div className='flex flex-col lg:flex-row justify-center gap-7'>
      <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl flex-1 min-h-[60vh] lg:flex-1 lg:min-h-[90vh]'>
        <Form 
          key={resetIndex} 
          step={step} 
          setStep={setStep} 
          formData={formData} 
          setFormData={setFormData}
          editMode={true}
          invoiceId={id}
        />
      </div>
      <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl flex-2 min-h-[40vh] lg:flex-2 text-white space-y-3'>
        <Pdf data={formData}></Pdf>
      </div>
    </div>
  )
}

export default Edit

