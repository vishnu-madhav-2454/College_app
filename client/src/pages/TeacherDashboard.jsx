import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Lock,
  ChevronRight,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TeacherDashboard = () => {
  const { token, user, teacherProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('classes');
  
  const [todayData, setTodayData] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodayClasses = async () => {
    try {
      const res = await fetch('/api/teacher/classes-today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTodayData(await res.json());
    } catch (e) {
      console.error('Error loading teacher classes:', e);
    }
  };

  const fetchStudentMarks = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSection !== 'ALL') params.append('section', selectedSection);
      if (selectedTestId) params.append('testId', selectedTestId);
      
      const res = await fetch(`/api/teacher/student-marks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMarksData(data);
        if (!selectedTestId && data.selectedTest) {
          setSelectedTestId(data.selectedTest.id);
        }
      }
    } catch (e) {
      console.error('Error loading marks:', e);
    }
  };

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    Promise.all([fetchTodayClasses(), fetchStudentMarks()]).finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    if (token) fetchStudentMarks();
  }, [selectedSection, selectedTestId]);

  useEffect(() => {
    if (selectedSection !== 'ALL' && !marksData?.filters?.sections?.includes(selectedSection)) {
      setSelectedSection('ALL');
    }
  }, [marksData, selectedSection]);

  if (isLoading && !todayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Faculty Portal...</p>
        </div>
      </div>
    );
  }

  const teacherSubject = marksData?.teacherSubject || todayData?.teacherSubject || '';

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Profile Info */}
            <div className="flex items-center gap-5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold">{user?.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                    {teacherSubject} Faculty
                  </span>
                </div>
                <p className="text-purple-200 mt-1 text-sm">
                  {[teacherProfile?.designation, teacherProfile?.qualification].filter(Boolean).join(' • ')}
                </p>
                <p className="text-slate-400 text-sm mt-0.5">
                  Taught Sections: <span className="text-white font-medium">{marksData?.taughtSections?.join(', ')}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-center px-4">
                <div className="text-2xl lg:text-3xl font-bold text-amber-400">
                  {todayData?.totalClasses || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Today's Classes</div>
              </div>
              <div className="text-center px-4 border-l border-white/10">
                <div className="text-2xl lg:text-3xl font-bold text-purple-400">
                  {marksData?.stats?.totalStudents || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Students Taught</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'classes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Today's Classes ({todayData?.totalClasses || 0})
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'marks'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Student Marks
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Today's Class Schedule</h2>
                <p className="text-sm text-slate-500 mt-1">{todayData?.date}</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-semibold text-sm">
                {todayData?.today}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {todayData?.classes?.map((cls, idx) => (
                <div key={cls.id || idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono text-sm font-bold">
                      {cls.startTime} - {cls.endTime}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                      {cls.program}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900">{cls.subject}</h3>
                  <p className="text-sm text-blue-600 font-medium mt-0.5">{cls.section}</p>
                  
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Topic</p>
                    <p className="text-sm text-slate-700">{cls.topic}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      {cls.roomNo}
                    </div>
                    <span className="text-emerald-600 font-medium">Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Marks Tab */}
        {activeTab === 'marks' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Security Notice */}
            <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <Lock className="w-5 h-5 text-purple-600 shrink-0" />
              <p className="text-sm text-purple-700">
                <strong>Subject-Scoped Access:</strong> You can only view <strong>{teacherSubject}</strong> scores for your assigned sections.
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-700">Filters</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Select Test</label>
                  <select
                    value={selectedTestId}
                    onChange={(e) => setSelectedTestId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-sm"
                  >
                    {marksData?.filters?.tests?.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.program})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Select Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-sm"
                  >
                    <option value="ALL">All My Sections</option>
                    {marksData?.filters?.sections?.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold uppercase mb-1">
                  <Users className="w-4 h-4" />
                  Total Students
                </div>
                <div className="text-3xl font-bold text-purple-900">{marksData?.stats?.totalStudents || 0}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold uppercase mb-1">
                  <Target className="w-4 h-4" />
                  Avg {teacherSubject} Score
                </div>
                <div className="text-3xl font-bold text-blue-900">{marksData?.stats?.averageSubjectScore || 0}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Highest Score
                </div>
                <div className="text-3xl font-bold text-emerald-900">{marksData?.stats?.highestSubjectScore || 0}</div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{teacherSubject} Marks Report</h3>
                  <p className="text-sm text-slate-500">{marksData?.selectedTest?.name}</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">
                  {teacherSubject} Only
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Student</th>
                      <th className="px-6 py-3 text-left">Enrollment</th>
                      <th className="px-6 py-3 text-left">Section</th>
                      <th className="px-6 py-3 text-left">Program</th>
                      <th className="px-6 py-3 text-right">{teacherSubject} Score</th>
                      <th className="px-6 py-3 text-right">%</th>
                      <th className="px-6 py-3 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {marksData?.students?.map((stu, idx) => (
                      <tr key={stu.studentId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{stu.studentName}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">{stu.enrollmentNo}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                            {stu.section}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                            {stu.program}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-purple-900">{stu.subjectMarkObtained}</span>
                          <span className="text-slate-400">/{stu.subjectMaxMarks}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            stu.subjectPercentage >= 85 ? 'bg-emerald-100 text-emerald-700' :
                            stu.subjectPercentage >= 75 ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {stu.subjectPercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{stu.remarks}</td>
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
