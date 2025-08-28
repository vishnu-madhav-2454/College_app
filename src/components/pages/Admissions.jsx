import React, { useState } from 'react';
import PageLayout from '../layout/PageLayout';
import { COLORS } from '../../constants/colors';

const steps = [
  'Check eligibility (SSC/10th pass, required documents)',
  'Fill enquiry form or visit campus',
  'Counseling + stream selection (MPC/BiPC/MEC/CEC)',
  'Submit documents and fees',
  'Receive admission confirmation'
];

const requiredDocs = [
  '10th Marks Memo / Provisional Certificate',
  'Transfer Certificate (TC)',
  'Aadhaar (Student & Parent)',
  'Passport size photos (4)',
  'Caste/Income certificate (if applicable)'
];

const Admissions = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', stream: 'MPC', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks! We have received your enquiry. Our team will contact you.');
    setForm({ name: '', phone: '', email: '', stream: 'MPC', message: '' });
  };

  const primary = COLORS.primary.red;
  const secondary = COLORS.primary.yellow;

  return (
    <PageLayout>
      <section className="section py-12">
        {/* Banner */}
        <div
          className="mb-6 rounded-lg px-4 py-3 text-white shadow-md text-center font-medium fade-in-down"
          style={{ backgroundColor: primary }}
        >
          Admissions open for Inter 1st Year (2025–26). Limited merit scholarships available. Apply early.
        </div>

        {/* Header */}
        <div className="section-header text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-extrabold fade-in-up"
            style={{ color: primary }}
          >
            Admissions (Inter 1st & 2nd Year)
          </h1>
          <p className="mt-2 text-gray-700 text-lg md:text-xl fade-in-up" style={{ animationDelay: '80ms' }}>
            Join our Class 11–12 programs with integrated coaching and strong academic support.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center fade-in-up" style={{ animationDelay: '140ms' }}>
            {['MPC','BiPC','MEC','CEC'].map((s) => (
              <span
                key={s}
                className="text-xs md:text-sm font-semibold rounded-full px-3 py-1 text-black"
                style={{ backgroundColor: secondary }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="container-page grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* How to Apply */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1 fade-in-up">
              <h2 className="text-2xl font-bold mb-3" style={{ color: primary }}>How to Apply</h2>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                {steps.map((s, i) => (<li key={i}>{s}</li>))}
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-black rounded-full px-3 py-1" style={{ backgroundColor: secondary }}>Merit-based seats</span>
                <span className="text-xs font-semibold text-black rounded-full px-3 py-1" style={{ backgroundColor: secondary }}>Scholarships</span>
                <span className="text-xs font-semibold text-black rounded-full px-3 py-1" style={{ backgroundColor: secondary }}>Bridge Course</span>
              </div>
            </div>

            {/* Eligibility & Documents */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1 fade-in-up" style={{ animationDelay: '80ms' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: primary }}>Eligibility & Documents</h2>
              <p className="mb-3 text-gray-700">
                <span className="font-semibold">Eligibility:</span> SSC/10th pass. Merit-based seat allocation. Scholarships available for high performers.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {requiredDocs.map((d, i) => (<li key={i}>{d}</li>))}
              </ul>
            </div>

            {/* Contact & Help */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1 fade-in-up" style={{ animationDelay: '140ms' }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: primary }}>Contact & Help</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                <div className="p-3 rounded-lg border" style={{ borderColor: primary }}>
                  <div className="font-semibold">Admissions Office</div>
                  <div>+91 91761 62696</div>
                  <div>ssjccong@gmail.com</div>
                </div>
                <div className="p-3 rounded-lg border" style={{ borderColor: primary }}>
                  <div className="font-semibold">Timings</div>
                  <div>Mon–Sat: 9:00 AM – 5:00 PM</div>
                  <div>Sun: Closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1 fade-in-up">
            <h2 className="text-2xl font-bold mb-3" style={{ color: primary }}>Enquiry Form</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Student Name"
                className="w-full rounded-md border px-3 py-2 focus:outline-none"
                style={{ borderColor: primary }}
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Phone"
                className="w-full rounded-md border px-3 py-2 focus:outline-none"
                style={{ borderColor: primary }}
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="Email (optional)"
                className="w-full rounded-md border px-3 py-2 focus:outline-none"
                style={{ borderColor: primary }}
              />
              <select
                name="stream"
                value={form.stream}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 focus:outline-none"
                style={{ borderColor: primary }}
              >
                <option>MPC</option>
                <option>BiPC</option>
                <option>MEC</option>
                <option>CEC</option>
              </select>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full rounded-md border px-3 py-2 min-h-[100px] focus:outline-none"
                style={{ borderColor: primary }}
              />
              <button
                type="submit"
                className="w-full py-2 rounded-md text-black font-semibold hover:shadow-lg hover:-translate-y-0.5 transition"
                style={{ backgroundColor: secondary }}
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Admissions;
