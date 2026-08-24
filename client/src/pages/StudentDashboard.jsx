import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  Award,
  BookOpen,
  Clock,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Receipt,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  Target,
  Percent,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReceiptModal } from '../components/common/ReceiptModal';

export const StudentDashboard = () => {
  const { token, user, studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  const fetchAllStudentData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [dashRes, feeRes, testRes, attRes] = await Promise.all([
        fetch('/api/student/dashboard', { headers }),
        fetch('/api/student/fees', { headers }),
        fetch('/api/student/tests', { headers }),
        fetch('/api/student/attendance', { headers })
      ]);
      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (feeRes.ok) setFeeData(await feeRes.json());
      if (testRes.ok) setTestData(await testRes.json());
      if (attRes.ok) setAttendanceData(await attRes.json());
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudentData();
  }, [token]);

  const handlePayInstallment = async (e) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    setIsPaying(true);
    try {
      const res = await fetch('/api/student/fees/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(payAmount),
          installmentName: 'Online Term Installment Fee',
          paymentMethod: 'UPI / NetBanking'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPaySuccessMsg('Payment Successful! Receipt generated.');
        setTimeout(() => {
          setIsPayModalOpen(false);
          setPaySuccessMsg('');
          fetchAllStudentData();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  const getProgramColor = (prog) => {
    switch (prog) {
      case 'JEE': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      case 'NEET': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'EAMCET_MPC': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
      case 'EAMCET_BIPC': return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' };
      default: return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' };
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const student = dashboardData?.student || studentProfile;
  const programColor = getProgramColor(student?.program);

  const subjectCalendars = (attendanceData?.subjectStats || []).map((subStat) => {
    const subName = subStat.subject;
    const days = (attendanceData?.calendarGrid || []).map((dayItem) => {
      const matchedSub = dayItem.subjects.find((s) => s.subject === subName);
      return {
        date: dayItem.date,
        day: dayItem.day,
        status: matchedSub ? matchedSub.status : 'present'
      };
    });
    return { ...subStat, days };
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Profile Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'}
                  alt={student?.name}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold">{student?.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${programColor.bg} ${programColor.text} ${programColor.border} border`}>
                    {student?.program?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-blue-200 mt-1 font-mono text-sm">
                  {student?.enrollmentNo}
                </p>
                <p className="text-slate-400 text-sm mt-0.5">
                  {student?.programName}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-center px-4">
                <div className={`text-2xl lg:text-3xl font-bold ${(attendanceData?.totalPercentage || 0) >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {attendanceData?.totalPercentage || 0}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Attendance</div>
              </div>
              <div className="text-center px-4 border-l border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-amber-400">
                  ₹{(feeData?.paidFee || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-1">Fee Paid</div>
              </div>
              <div className="text-center px-4 border-l border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-blue-400">
                  #{testData?.scores?.[0]?.rankInBatch || '-'}
                </div>
                <div className="text-xs text-slate-400 mt-1">Last Test Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2 flex flex-wrap gap-2">
          {[
            { id: 'attendance', label: 'Attendance', icon: Calendar },
            { id: 'tests', label: 'Test Scores', icon: BarChart3 },
            { id: 'fees', label: 'Fee & Receipts', icon: Receipt }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Overall Attendance Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <span className="text-3xl font-bold">{attendanceData?.totalPercentage}%</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Overall Attendance</h3>
                  <p className="text-blue-200 text-sm">
                    {attendanceData?.attendedLectures} of {attendanceData?.totalLectures} classes attended
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/20">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span>Absent</span>
                </div>
              </div>
            </div>

            {/* Subject-wise Calendars */}
            <div className="grid lg:grid-cols-3 gap-6">
              {subjectCalendars.map((subCal, idx) => {
                const isHigh = subCal.percentage >= 85;
                const isMed = subCal.percentage >= 75 && subCal.percentage < 85;
                
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    {/* Subject Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          Subject
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1">{subCal.subject}</h4>
                        <p className="text-sm text-slate-500">
                          {subCal.attended} Present • {subCal.absent} Absent
                        </p>
                      </div>
                      <div className={`text-xl font-bold px-3 py-1 rounded-lg ${
                        isHigh ? 'bg-emerald-100 text-emerald-700' :
                        isMed ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {subCal.percentage}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full mb-5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-emerald-500' :
                          isMed ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{ width: `${subCal.percentage}%` }}
                      ></div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {subCal.days.map((dayItem) => {
                        const isPresent = dayItem.status === 'present';
                        return (
                          <div
                            key={dayItem.date}
                            title={`${subCal.subject} - ${dayItem.date}: ${isPresent ? 'Present' : 'Absent'}`}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                              isPresent
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-rose-500 text-white hover:bg-rose-600'
                            }`}
                          >
                            {dayItem.day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Total Tests</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {testData?.scores?.length || 0}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                    <Percent className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Avg Percentage</span>
                </div>
                <div className="text-3xl font-bold text-emerald-600">
                  {testData?.scores?.length > 0
                    ? (testData.scores.reduce((a, b) => a + b.percentage, 0) / testData.scores.length).toFixed(1)
                    : 0}%
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold uppercase">Best Percentile</span>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {testData?.scores?.[0]?.percentile || 99.4}%
                </div>
              </div>
            </div>

            {/* Test Scores List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Test Scorecards</h3>
              {testData?.scores?.map((test) => (
                <div key={test.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900">{test.testName}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${programColor.bg} ${programColor.text}`}>
                          {test.program}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{test.testDate}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Score</p>
                        <p className="text-xl font-bold text-slate-900">
                          {test.totalObtained}<span className="text-sm text-slate-400">/{test.totalMax}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Rank</p>
                        <p className="text-xl font-bold text-amber-600">#{test.rankInBatch}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject Breakdown */}
                  <div className="grid sm:grid-cols-3 gap-3 mt-4">
                    {Object.entries(test.breakdown || {}).map(([sub, mark]) => (
                      <div key={sub} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-medium text-slate-600 capitalize">{sub}</span>
                        <span className="text-sm font-bold text-blue-600">{mark}</span>
                      </div>
                    ))}
                  </div>
                  
                  {test.remarks && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-3 rounded-xl">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span><strong>Feedback:</strong> {test.remarks}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Fee Overview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fee account</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{student?.programName}</h2>
                  <p className="mt-1 text-sm text-slate-500">{student?.branchName}</p>
                </div>
                {feeData?.pendingFee > 0 ? (
                  <button onClick={() => setIsPayModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    <CreditCard className="w-4 h-4" /> Pay pending fee
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Account cleared
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-7 pt-5 border-t border-slate-100">
                <div><p className="text-xs text-slate-500">Total fee</p><p className="mt-1 text-lg font-bold text-slate-900">₹{(feeData?.totalFee || 0).toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-slate-500">Paid</p><p className="mt-1 text-lg font-bold text-emerald-700">₹{(feeData?.paidFee || 0).toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-slate-500">Balance</p><p className="mt-1 text-lg font-bold text-rose-700">₹{(feeData?.pendingFee || 0).toLocaleString('en-IN')}</p></div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Payment progress</span><span>{feeData?.paidPercent || 0}%</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${feeData?.paidPercent || 0}%` }} /></div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div><h3 className="font-bold text-slate-900">Payment history</h3><p className="text-sm text-slate-500 mt-1">{feeData?.receipts?.length || 0} receipt{feeData?.receipts?.length === 1 ? '' : 's'} recorded</p></div>
                <Receipt className="w-5 h-5 text-slate-400" />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">Receipt No</th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Method</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeData?.receipts?.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-blue-700 font-semibold">{rec.receiptNo}</div><div className="text-xs text-slate-500 mt-1">{rec.installmentName}</div></td>
                        <td className="px-6 py-4 text-slate-500">{rec.paymentDate}</td>
                        <td className="px-6 py-4 text-slate-500">{rec.paymentMethod}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹{rec.amount?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedReceipt(rec)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            View receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!feeData?.receipts || feeData.receipts.length === 0) && (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-500">No payments have been recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          student={{
            name: student?.name,
            enrollmentNo: student?.enrollmentNo,
            program: student?.programName,
            branch: student?.branchName
          }}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Pay Fee Installment</h3>
            <p className="text-sm text-slate-500 mb-6">
              Outstanding: <span className="font-bold text-rose-600">₹{feeData?.pendingFee?.toLocaleString('en-IN')}</span>
            </p>
            
            <form onSubmit={handlePayInstallment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {isPaying ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
            
            {paySuccessMsg && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium text-center">
                {paySuccessMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
