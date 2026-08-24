import React from 'react';
import { X, Printer, Receipt, CheckCircle2 } from 'lucide-react';

export const ReceiptModal = ({ receipt, student, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Actions (hidden during print) */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-800 text-white print:hidden">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-blue-300" />
            <span className="font-semibold text-sm">Payment receipt</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 bg-white text-slate-800" id="receipt-print-area">
          
          {/* Institute Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xl">
                  A
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">APEX ACADEMY</h2>
                  <p className="text-xs font-medium text-blue-600 uppercase">Academic fee receipt</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mt-2">
                Apex Academy of Science & Technology<br />
                Payment receipt generated from the student portal.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase mb-2">
                {receipt.status || 'Recorded'}
              </span>
              <p className="text-xs text-slate-500">Receipt Number</p>
              <p className="text-sm font-mono font-bold text-slate-900">{receipt.receiptNo}</p>
              <p className="text-xs text-slate-500 mt-1">Payment date: {receipt.paymentDate}</p>
            </div>
          </div>

          {/* Student & Course Particulars */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider mb-1">Student Particulars</p>
              <p className="text-sm font-bold text-slate-900">{student?.name || 'Not available'}</p>
              <p className="text-slate-600 mt-0.5"><span className="font-medium text-slate-500">Enrollment ID:</span> <span className="font-mono font-semibold text-blue-700">{student?.enrollmentNo || 'Not available'}</span></p>
              <p className="text-slate-600"><span className="font-medium text-slate-500">Campus:</span> {student?.branch || 'Not available'}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider mb-1">Course & Program</p>
              <p className="text-sm font-bold text-slate-900">{student?.program || 'Not available'}</p>
              <p className="text-slate-600 mt-0.5"><span className="font-medium text-slate-500">Payment channel:</span> {receipt.paymentMethod || 'Not available'}</p>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Fee Item / Description</th>
                  <th className="py-3 px-4">Transaction Reference</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-mono text-slate-500">01</td>
                    <td className="py-3.5 px-4 font-mono text-blue-700 font-semibold">{receipt.receiptNo}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {receipt.installmentName || 'Fee payment'}
                      {receipt.notes && <span className="block text-[11px] text-slate-500 mt-0.5">{receipt.notes}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{receipt.transactionRef || 'Not available'}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">₹{receipt.amount?.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan="3" className="py-3 px-4 text-right font-bold text-slate-700 uppercase text-[11px]">Total Paid Amount:</td>
                  <td className="py-3 px-4 text-right font-black text-blue-700 text-base">₹{receipt.amount?.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer & Signature Stamp */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-1 max-w-xs text-slate-500 text-[11px]">
              <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Digitally Verified & Non-Transferable</span>
              </div>
              <p>This is a computer-generated receipt.</p>
            </div>
            <div className="text-center">
              <div className="w-28 h-12 mx-auto border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest font-mono bg-slate-50 mb-1">
                APEX FINANCE
              </div>
              <p className="text-[11px] font-bold text-slate-800">Accounts Officer</p>
              <p className="text-[10px] text-slate-400">Student Accounts</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
