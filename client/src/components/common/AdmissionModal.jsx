import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, CreditCard, Sparkles, Building, BookOpen, User, Phone, Mail, Award, Lock, Copy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const AdmissionModal = ({ isOpen, onClose, preselectedProgram, defaultProgram = 'JEE' }) => {
  const effectiveProgram = preselectedProgram || defaultProgram;

  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [catalog, setCatalog] = useState({ programs: [], branches: [] });

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    program: effectiveProgram,
    branchId: 'branch-1',
    tenthScore: '',
    address: '',
    paymentAmount: '',
    paymentMethod: 'UPI / NetBanking'
  });

  // Success State
  const [admissionResult, setAdmissionResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/public/home-data')
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load admission options');
        return res.json();
      })
      .then((data) => {
        setCatalog({ programs: data.programs || [], branches: data.branches || [] });
        setFormData((current) => ({
          ...current,
          program: effectiveProgram,
          branchId: current.branchId || data.branches?.[0]?.id || '',
          paymentAmount: current.paymentAmount || data.programs?.find((program) => program.id === effectiveProgram)?.annualFee || ''
        }));
      })
      .catch((err) => setError(err.message));
  }, [isOpen, effectiveProgram]);

  if (!isOpen) return null;

  const programs = catalog.programs;
  const branches = catalog.branches;

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.studentName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setError('Please fill in student name, email and phone number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.paymentAmount || Number(formData.paymentAmount) <= 0) {
        const selectedProgram = programs.find((program) => program.id === formData.program);
        setFormData((current) => ({
          ...current,
          paymentAmount: selectedProgram?.annualFee || ''
        }));
      }
      setStep(3);
    }
  };

  const handlePaymentAndSubmit = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Simulate gateway delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const res = await fetch('/api/admission/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Admission application failed.');
      }

      if (data.payment?.status === 'Paid') {
        setAdmissionResult(data);
        setStep(4);
        return;
      }

      if (!window.Razorpay || !data.checkout?.orderId) {
        throw new Error('Razorpay Checkout is unavailable. Please refresh and try again.');
      }

      const razorpay = new window.Razorpay({
        key: data.checkout.keyId,
        amount: data.checkout.amountInPaise,
        currency: data.checkout.currency,
        name: 'Apex Academy',
        description: 'Admission Seat Confirmation Fee',
        order_id: data.checkout.orderId,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        prefill: { name: formData.studentName, email: formData.email, contact: formData.phone },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/admission/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: data.paymentId,
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verification.error || 'Payment verification failed.');
            setAdmissionResult(data);
            setStep(4);
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } catch (verificationError) {
            setError(verificationError.message || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: async () => {
            try {
              const cancelResponse = await fetch('/api/admission/payment/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentId: data.paymentId,
                  orderId: data.checkout.orderId
                })
              });
              const cancelData = await cancelResponse.json();
              if (!cancelResponse.ok) {
                throw new Error(cancelData.error || 'Unable to cancel the pending admission.');
              }
              setError('Payment was cancelled. You can submit the admission form again.');
            } catch (cancelError) {
              setError('Payment was cancelled. Please try again after refreshing the page.');
            }
          }
        }
      });
      razorpay.open();
    } catch (err) {
      setError(err.message || 'Something went wrong during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectLogin = async () => {
    if (!admissionResult) return;
    try {
      setIsProcessing(true);
      await login(admissionResult.credentials.email, admissionResult.credentials.temporaryPassword);
      onClose();
    } catch (e) {
      setError('Direct login error. You can login using the credentials on the login screen.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!admissionResult) return;
    const text = `Apex Academy Credentials:\nEnrollment No: ${admissionResult.credentials.enrollmentNo}\nEmail: ${admissionResult.credentials.email}\nPassword: ${admissionResult.credentials.temporaryPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 pb-7">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Academic Session 2026 - 2027 Admissions Open</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">Apply for Admission</h2>
          <p className="text-sm text-blue-100 mt-1">
            Fill the form, complete seat confirmation fee, and instantly receive your student portal credentials.
          </p>

          {/* Stepper Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/15 text-xs font-medium">
              <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-white font-bold' : 'text-blue-300'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-amber-400 text-slate-900 font-black' : 'bg-white/20'}`}>1</span>
                <span>Student Info</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-white font-bold' : 'text-blue-300'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-amber-400 text-slate-900 font-black' : 'bg-white/20'}`}>2</span>
                <span>Stream & Campus</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-white font-bold' : 'text-blue-300'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-amber-400 text-slate-900 font-black' : 'bg-white/20'}`}>3</span>
                <span>Fee Checkout</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center space-x-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Sai Teja Reddy"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="saiteja@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98480 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Mr. V. Reddy"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98480 54321"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">10th Class GPA / Score %</label>
                  <div className="relative">
                    <Award className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="10.0 GPA / 95%"
                      value={formData.tenthScore}
                      onChange={(e) => setFormData({ ...formData, tenthScore: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Continue to Stream Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Program & Campus Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Select Coaching Program *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {programs.map((prog) => {
                    const isSelected = formData.program === prog.id;
                    return (
                      <div
                        key={prog.id}
                        onClick={() => setFormData({ ...formData, program: prog.id })}
                        className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {prog.badge}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1.5">{prog.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{prog.subtitle}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Course Fee:</span>
                          <span className="font-bold text-slate-900">{prog.fee}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Select Campus / Branch *</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Proceed to Fee Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Admission Fee Checkout */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Admission Seat Confirmation</span>
                    <h3 className="text-base font-bold">{formData.studentName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300">Admission Fee Token</span>
                    <p className="text-xl font-black text-amber-400">₹{Number(formData.paymentAmount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-slate-300">
                  <p><span className="text-slate-400">Program:</span> {formData.program}</p>
                  <p><span className="text-slate-400">Email:</span> {formData.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Admission Payment Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter the amount to pay"
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5">You can pay up to the selected program fee.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['UPI (GPay / PhonePe)', 'Credit / Debit Card', 'Net Banking'].map((method) => {
                    const isSelected = formData.paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method })}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>256-bit Encrypted Simulated Payment Gateway. Instant credential generation guaranteed.</span>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-medium transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePaymentAndSubmit}
                  className="flex items-center space-x-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-600/25 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment & Generating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{Number(formData.paymentAmount).toLocaleString('en-IN')} & Get Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Credentials Voucher */}
          {step === 4 && admissionResult && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Admission Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Welcome to Apex Academy! Your student account has been created.
                </p>
              </div>

              {/* Credentials Box */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white text-left relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 p-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                    Active Account
                  </span>
                </div>

                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-3">Your Student Login Credentials</p>

                <div className="space-y-2.5 text-sm font-mono">
                  <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 text-xs">Enrollment No:</span>
                    <span className="font-bold text-amber-300">{admissionResult.credentials.enrollmentNo}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 text-xs">Login Email:</span>
                    <span className="font-bold text-blue-300">{admissionResult.credentials.email}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 text-xs">Password:</span>
                    <span className="font-bold text-emerald-300">{admissionResult.credentials.temporaryPassword}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Program: {admissionResult.credentials.program}</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Info'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDirectLogin}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Direct Login to Student Portal</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition cursor-pointer"
                >
                  Close & Back to Home
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
