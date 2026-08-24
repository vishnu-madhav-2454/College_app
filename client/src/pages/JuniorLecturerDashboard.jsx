import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  Users,
  Edit3,
  Filter,
  Check,
  RotateCcw,
  Search,
  UserX,
  Zap,
  Award,
  BookOpen,
  Lock,
  Eye,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getTodayDateString = () => {
  const now = new Date();
  const istOffset = 5 * 60 + 30; // IST = UTC + 5:30
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + istOffset * 60000).toISOString().split('T')[0];
};

export const JuniorLecturerDashboard = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');

  const todayDate = useMemo(() => getTodayDateString(), []);
  const [meta, setMeta] = useState(null);
  const [attDate, setAttDate] = useState(getTodayDateString());
  const isToday = attDate === todayDate;
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);
  const [attProgram, setAttProgram] = useState('JEE');
  const [attSection, setAttSection] = useState('ALL');
  const [attSubject, setAttSubject] = useState('Physics');
  const [attRecords, setAttRecords] = useState([]);
  const [attSearchQuery, setAttSearchQuery] = useState('');
  const [isSavingAtt, setIsSavingAtt] = useState(false);
  const [attMessage, setAttMessage] = useState('');

  const [selectedTestId, setSelectedTestId] = useState('');
  const [marksProgram, setMarksProgram] = useState('JEE');
  const [marksSection, setMarksSection] = useState('ALL');
  const [marksList, setMarksList] = useState([]);
  const [marksSearchQuery, setMarksSearchQuery] = useState('');
  const [selectedTestObj, setSelectedTestObj] = useState(null);
  const [isSavingMarks, setIsSavingMarks] = useState(false);
  const [marksMessage, setMarksMessage] = useState('');
  const [singleSavedId, setSingleSavedId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const marksTests = meta?.tests?.filter((test) => test.program === marksProgram) || [];
  const marksSections = [...new Set(marksTests.flatMap((test) => test.targetSections || []))];

  const fetchMeta = async () => {
    try {
      const res = await fetch('/api/jl/metadata', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setMeta(data);
        if (data.tests?.length > 0 && !selectedTestId) setSelectedTestId(data.tests[0].id);
      }
    } catch (e) { console.error(e); }
  };

  const fetchAttendanceSheet = async () => {
    try {
      const params = new URLSearchParams({ date: attDate, program: attProgram, section: attSection, subject: attSubject });
      const res = await fetch(`/api/jl/attendance?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAttRecords(data.records || []);
        setIsAlreadyMarked(!!data.isAlreadyMarked);
      }
    } catch (e) { console.error(e); }
  };

  const fetchMarksSheet = async () => {
    if (!selectedTestId) return;
    try {
      const params = new URLSearchParams({ testId: selectedTestId, program: marksProgram, section: marksSection });
      const res = await fetch(`/api/jl/marks?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setSelectedTestObj(data.test);
        setMarksList(data.students || []);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (!token) return; setIsLoading(true); fetchMeta().finally(() => setIsLoading(false)); }, [token]);
  useEffect(() => { if (token) fetchAttendanceSheet(); }, [attDate, attProgram, attSection, attSubject]);
  useEffect(() => { if (token && selectedTestId) fetchMarksSheet(); }, [selectedTestId, marksProgram, marksSection]);
  useEffect(() => {
    if (!marksTests.some((test) => test.id === selectedTestId)) {
      setSelectedTestId(marksTests[0]?.id || '');
    }
    setMarksSection('ALL');
  }, [marksProgram, meta]);

  const filteredAttRecords = useMemo(() => {
    if (!attSearchQuery.trim()) return attRecords;
    const q = attSearchQuery.toLowerCase();
    return attRecords.filter(r => r.studentName.toLowerCase().includes(q) || r.enrollmentNo.toLowerCase().includes(q));
  }, [attRecords, attSearchQuery]);

  const filteredMarksList = useMemo(() => {
    if (!marksSearchQuery.trim()) return marksList;
    const q = marksSearchQuery.toLowerCase();
    return marksList.filter(s => s.studentName.toLowerCase().includes(q) || s.enrollmentNo.toLowerCase().includes(q));
  }, [marksList, marksSearchQuery]);

  const totalStudentsCount = attRecords.length;
  const presentCount = attRecords.filter(r => r.status === 'present').length;
  const absentCount = totalStudentsCount - presentCount;
  const presentPercentage = totalStudentsCount > 0 ? Math.round((presentCount / totalStudentsCount) * 100) : 100;

  const handleToggleStatus = (studentId) => {
    if (!isToday || isAlreadyMarked) return;
    setAttRecords(prev => prev.map(r => r.studentId === studentId ? { ...r, status: r.status === 'present' ? 'absent' : 'present' } : r));
  };

  const handleSetSingleStatus = (studentId, status) => {
    if (!isToday || isAlreadyMarked) return;
    setAttRecords(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
  };

  const handleMarkAll = (status) => {
    if (!isToday || isAlreadyMarked) return;
    setAttRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleMarkFilteredAsAbsentAndRestPresent = () => {
    if (!isToday || isAlreadyMarked) return;
    const matchedIds = new Set(filteredAttRecords.map(r => r.studentId));
    setAttRecords(prev => prev.map(r => ({ ...r, status: matchedIds.has(r.studentId) ? 'absent' : 'present' })));
    setAttMessage(`Marked ${matchedIds.size} as ABSENT, rest as PRESENT.`);
    setTimeout(() => setAttMessage(''), 3000);
  };

  const handleInvertAttendance = () => {
    if (!isToday || isAlreadyMarked) return;
    setAttRecords(prev => prev.map(r => ({ ...r, status: r.status === 'present' ? 'absent' : 'present' })));
  };

  const handleSaveAttendance = async () => {
    if (!isToday) {
      setAttMessage('⚠️ Cannot save: Past attendance is read-only.');
      setTimeout(() => setAttMessage(''), 4000);
      return;
    }
    setIsSavingAtt(true);
    setAttMessage('');
    try {
      const updates = attRecords.map(r => ({ studentId: r.studentId, status: r.status }));
      const res = await fetch('/api/jl/attendance/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date: attDate, subject: attSubject, updates })
      });
      const data = await res.json();
      if (res.ok) {
        setAttMessage(data.message || 'Saved successfully!');
        setIsAlreadyMarked(true);
        setTimeout(() => setAttMessage(''), 4000);
      } else {
        setAttMessage(data.error || 'Failed to save attendance.');
        setTimeout(() => setAttMessage(''), 4000);
      }
    } catch (e) {
      console.error(e);
      setAttMessage('Network error while saving attendance.');
    }
    finally { setIsSavingAtt(false); }
  };

  const handleSubjectMarkChange = (studentId, subKey, val) => {
    const numVal = val === '' ? 0 : Number(val);
    setMarksList(prev => prev.map(s => {
      if (s.studentId === studentId) {
        const updatedBreakdown = { ...(s.breakdown || {}), [subKey]: numVal };
        const totalObtained = Object.values(updatedBreakdown).reduce((a, b) => Number(a) + (Number(b) || 0), 0);
        return { ...s, breakdown: updatedBreakdown, totalObtained };
      }
      return s;
    }));
  };

  const handleRemarksChange = (studentId, val) => {
    setMarksList(prev => prev.map(s => s.studentId === studentId ? { ...s, remarks: val } : s));
  };

  const handleSaveSingleStudent = async (studentId) => {
    const targetStudent = marksList.find(s => s.studentId === studentId);
    if (!targetStudent) return;
    try {
      const res = await fetch('/api/jl/marks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testId: selectedTestId, marksList: [{ studentId: targetStudent.studentId, breakdown: targetStudent.breakdown || {}, remarks: targetStudent.remarks || '' }] })
      });
      if (res.ok) { setSingleSavedId(studentId); setTimeout(() => setSingleSavedId(null), 2000); }
    } catch (e) { console.error(e); }
  };

  const handleSaveMarks = async () => {
    setIsSavingMarks(true);
    setMarksMessage('');
    try {
      const payloadMarks = marksList.map(s => ({ studentId: s.studentId, breakdown: s.breakdown || {}, remarks: s.remarks || '' }));
      const res = await fetch('/api/jl/marks/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testId: selectedTestId, marksList: payloadMarks })
      });
      const data = await res.json();
      if (res.ok) { setMarksMessage(data.message || 'Saved!'); setTimeout(() => setMarksMessage(''), 3000); }
    } catch (e) { console.error(e); }
    finally { setIsSavingMarks(false); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading JL Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jl-page min-h-screen bg-slate-50 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'} alt={user?.name} className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl" />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold">{user?.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">Junior Lecturer</span>
                </div>
                <p className="text-emerald-200 text-sm mt-1">Academic Management & Marks Entry</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalStudentsCount}</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
              <div className="text-center border-l border-white/10">
                <div className="text-2xl font-bold text-emerald-400">{presentCount}</div>
                <div className="text-xs text-slate-400">Present</div>
              </div>
              <div className="text-center border-l border-white/10">
                <div className="text-2xl font-bold text-rose-400">{absentCount}</div>
                <div className="text-xs text-slate-400">Absent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2 flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('attendance')} className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'attendance' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Calendar className="w-4 h-4" /> Attendance
          </button>
          <button onClick={() => setActiveTab('marks')} className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'marks' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Edit3 className="w-4 h-4" /> Marks Entry
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Attendance Filters</span>
                </div>
                <div>
                  {isToday ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      Today's Live Session (Editable) {isAlreadyMarked && '• Previously Saved'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      <Lock className="w-3.5 h-3.5" />
                      Past Date Record (Read-Only)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-600 uppercase">Date</label>
                    {!isToday && (
                      <button
                        type="button"
                        onClick={() => setAttDate(todayDate)}
                        className="text-[11px] text-emerald-600 hover:underline font-semibold"
                      >
                        Go to Today
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    max={todayDate}
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Program</label>
                  <select value={attProgram} onChange={(e) => setAttProgram(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm">
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="EAMCET_MPC">EAMCET MPC</option>
                    <option value="EAMCET_BIPC">EAMCET BiPC</option>
                    <option value="ALL">All</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Section</label>
                  <select value={attSection} onChange={(e) => setAttSection(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm">
                    <option value="ALL">All Sections</option>
                    {meta?.sections?.map((sec, i) => <option key={i} value={sec}>{sec}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Subject</label>
                  <select value={attSubject} onChange={(e) => setAttSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Read-Only Notice for Past Dates */}
            {!isToday && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Viewing Past Attendance Log for {attDate}</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    As a Junior Lecturer, past dates are available for review only. Live attendance modification is restricted to today's session.
                  </p>
                </div>
              </div>
            )}

            {isToday && isAlreadyMarked && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 flex items-start gap-3 text-slate-800">
                <Lock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Attendance finalized for {attSubject}</p>
                  <p className="text-slate-600 text-xs mt-0.5">This period is locked after saving. It is now available for viewing only.</p>
                </div>
              </div>
            )}

            {/* Smart Actions (Only editable for Today) */}
            {isToday && !isAlreadyMarked ? (
              <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-semibold">Smart Absentee Tool</h3>
                      <p className="text-sm text-slate-300">Quickly find absentees and mark the rest present</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-400">Present: {presentCount}</span>
                    <span className="text-rose-400">Absent: {absentCount}</span>
                    <span className="text-amber-400 font-bold">{presentPercentage}%</span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search student name or enrollment..."
                      value={attSearchQuery}
                      onChange={(e) => setAttSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                    />
                  </div>
                  {attSearchQuery.trim() && (
                    <button onClick={handleMarkFilteredAsAbsentAndRestPresent} className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-colors flex items-center gap-2">
                      <UserX className="w-4 h-4" /> Mark Filtered as Absent
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/10">
                  <button onClick={() => handleMarkAll('present')} className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/30 transition-colors flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> All Present
                  </button>
                  <button onClick={() => handleMarkAll('absent')} className="px-3 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-sm font-semibold hover:bg-rose-500/30 transition-colors flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> All Absent
                  </button>
                  <button onClick={handleInvertAttendance} className="px-3 py-2 rounded-lg bg-white/10 text-slate-200 text-sm font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Invert
                  </button>
                  <div className="flex-1"></div>
                  {attMessage && <span className="text-emerald-400 text-sm font-medium">{attMessage}</span>}
                  <button onClick={handleSaveAttendance} disabled={isSavingAtt} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                    <Save className="w-4 h-4" /> {isSavingAtt ? 'Saving...' : isAlreadyMarked ? 'Update Today\'s Attendance' : 'Save Today\'s Attendance'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search records in this date..."
                    value={attSearchQuery}
                    onChange={(e) => setAttSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 shrink-0">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100">Total: {totalStudentsCount}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700">Present: {presentCount}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700">Absent: {absentCount}</span>
                </div>
              </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Student</th>
                      <th className="px-6 py-3 text-left">Enrollment</th>
                      <th className="px-6 py-3 text-left">Section</th>
                      <th className="px-6 py-3 text-left">Subject</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">{isToday ? 'Actions' : 'Mode'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAttRecords.map((rec, idx) => (
                      <tr key={rec.studentId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{rec.studentName}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{rec.enrollmentNo}</td>
                        <td className="px-6 py-4 text-slate-600">{rec.section}</td>
                        <td className="px-6 py-4 text-slate-600">{rec.subject}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {rec.status === 'present' ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isToday && !isAlreadyMarked ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSetSingleStatus(rec.studentId, 'present')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${rec.status === 'present' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
                              >
                                P
                              </button>
                              <button
                                onClick={() => handleSetSingleStatus(rec.studentId, 'absent')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${rec.status === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'}`}
                              >
                                A
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                              <Eye className="w-3.5 h-3.5" /> Read-Only
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Marks Tab */}
        {activeTab === 'marks' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Select Test</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Test</label>
                  <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm">
                    {marksTests.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Program</label>
                  <select value={marksProgram} onChange={(e) => setMarksProgram(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm">
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="EAMCET_MPC">EAMCET MPC</option>
                    <option value="EAMCET_BIPC">EAMCET BiPC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Section</label>
                  <select value={marksSection} onChange={(e) => setMarksSection(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm">
                    <option value="ALL">All Sections</option>
                    {marksSections.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Marks Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search student..." value={marksSearchQuery} onChange={(e) => setMarksSearchQuery(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm w-64" />
              </div>
              <div className="flex items-center gap-3">
                {marksMessage && <span className="text-emerald-600 text-sm font-medium">{marksMessage}</span>}
                <button onClick={handleSaveMarks} disabled={isSavingMarks} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Save className="w-4 h-4" /> {isSavingMarks ? 'Saving...' : 'Save All Marks'}
                </button>
              </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Student</th>
                      <th className="px-4 py-3 text-left">Enrollment</th>
                      <th className="px-4 py-3 text-left">Section</th>
                      {selectedTestObj?.program === 'NEET' ? (
                        <>
                          <th className="px-4 py-3 text-center">Physics</th>
                          <th className="px-4 py-3 text-center">Chemistry</th>
                          <th className="px-4 py-3 text-center">Biology</th>
                        </>
                      ) : selectedTestObj?.program === 'EAMCET_BIPC' ? (
                        <>
                          <th className="px-4 py-3 text-center">Biology</th>
                          <th className="px-4 py-3 text-center">Physics</th>
                          <th className="px-4 py-3 text-center">Chemistry</th>
                        </>
                      ) : selectedTestObj?.program === 'EAMCET_MPC' ? (
                        <>
                          <th className="px-4 py-3 text-center">Maths</th>
                          <th className="px-4 py-3 text-center">Physics</th>
                          <th className="px-4 py-3 text-center">Chemistry</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 text-center">Physics</th>
                          <th className="px-4 py-3 text-center">Chemistry</th>
                          <th className="px-4 py-3 text-center">Maths</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-center">Total</th>
                      <th className="px-4 py-3 text-left">Remarks</th>
                      <th className="px-4 py-3 text-center">Save</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMarksList.map((stu, idx) => (
                      <tr key={stu.studentId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{stu.studentName}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{stu.enrollmentNo}</td>
                        <td className="px-4 py-3 text-slate-600">{stu.section}</td>
                        {Object.entries(stu.breakdown || {}).map(([sub, mark]) => (
                          <td key={sub} className="px-4 py-3">
                            <input type="number" value={mark || ''} onChange={(e) => handleSubjectMarkChange(stu.studentId, sub, e.target.value)} className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-center text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none" />
                          </td>
                        ))}
                        <td className="px-4 py-3 font-bold text-slate-900">{stu.totalObtained || 0}</td>
                        <td className="px-4 py-3">
                          <input type="text" value={stu.remarks || ''} onChange={(e) => handleRemarksChange(stu.studentId, e.target.value)} placeholder="Remarks" className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => handleSaveSingleStudent(stu.studentId)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${singleSavedId === stu.studentId ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            {singleSavedId === stu.studentId ? 'Saved!' : 'Save'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
