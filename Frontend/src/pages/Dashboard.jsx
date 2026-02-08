import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InvoiceCard from "../components/InvoiceCard";
import { fetchInvoices } from "../store/reducers/invoiceSlice";

const PAGE_SIZE = 5;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list: invoices,
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.invoice);

  const [page, setPage] = useState(0);

  /* ================= FETCH ON PAGE CHANGE ================= */
  useEffect(() => {
    dispatch(fetchInvoices({ page, size: PAGE_SIZE }));
  }, [dispatch, page]);


  /* ================= HANDLERS ================= */
  const handleNewClick = () => {
    navigate("/dashboard/new");
  };

  const handlePrev = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage((p) => p + 1);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>

          <button
            onClick={handleNewClick}
            className="cursor-pointer px-4 py-2 rounded-md border border-green-500
                       hover:bg-green-500 hover:text-black transition"
          >
            Create New Invoice
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error loading invoices</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => dispatch(fetchInvoices({ page, size: PAGE_SIZE }))}
              className="cursor-pointer mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No invoices found</p>
            <button
              onClick={handleNewClick}
              className="cursor-pointer mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Create Your First Invoice
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <InvoiceCard 
                  key={invoice.id} 
                  invoice={invoice}
                  onDeleteSuccess={() => {
                    // Refetch invoices after delete
                    dispatch(fetchInvoices({ page, size: PAGE_SIZE }));
                  }}
                />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className={` px-4 py-2 rounded border ${
                  page === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900 cursor-pointer bg-gray-600 text-white"
                }`}
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={page === totalPages - 1}
                className={` px-4 py-2 rounded border ${
                  page === totalPages - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900 cursor-pointer bg-gray-600 text-white"
                }`}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
