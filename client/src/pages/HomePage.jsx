import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Building,
  GraduationCap,
  BookOpen,
  Monitor,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Target,
  Zap,
  Users,
  TrendingUp,
  ChevronDown,
  Play,
  Quote,
  Heart,
  Rocket,
  Brain,
  Atom,
  Calculator,
  Microscope
} from 'lucide-react';

export const HomePage = ({ onOpenAdmission, onOpenLogin, onSelectProgramAdmission }) => {
  const [homeData, setHomeData] = useState(null);
  const [selectedExamFilter, setSelectedExamFilter] = useState('ALL');
  const [selectedBranchTab, setSelectedBranchTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    fetch('/api/public/home-data')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setHomeData(data);
        setLoadError('');
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load homepage data:', err);
        setLoadError('We could not load the latest campus information. Please try again.');
        setIsLoading(false);
      });
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Recorded Selections', value: homeData?.stats?.totalSelections ?? 0, icon: Award, color: 'from-blue-500 to-indigo-600' },
    { label: 'Recorded Top 100 Ranks', value: homeData?.stats?.top100AIRs ?? 0, icon: Star, color: 'from-amber-500 to-orange-600' },
    { label: 'Recorded NEET 700+ Scores', value: homeData?.stats?.neetScore700Plus ?? 0, icon: Zap, color: 'from-emerald-500 to-teal-600' },
    { label: 'Faculty Members', value: homeData?.stats?.facultyCount ?? 0, icon: Users, color: 'from-purple-500 to-pink-600' }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Track your progress with intelligent insights and personalized study recommendations.',
      color: 'text-blue-500'
    },
    {
      icon: Monitor,
      title: 'CBT Test Labs',
      description: 'Practice with real NTA simulation interface on 300+ computer terminals.',
      color: 'text-emerald-500'
    },
    {
      icon: Clock,
      title: '24/7 Doubt Support',
      description: 'Get your doubts cleared anytime with dedicated faculty support desks.',
      color: 'text-purple-500'
    },
    {
      icon: BookOpen,
      title: 'Expert Study Material',
      description: 'Comprehensive modules compiled by IIT & AIIMS alumni faculty.',
      color: 'text-amber-500'
    }
  ];

  const filteredAchievements = homeData?.achievements?.filter((ach) => {
    if (selectedExamFilter === 'ALL') return true;
    return ach.program === selectedExamFilter || ach.exam.includes(selectedExamFilter);
  }) || [];

  const programIcons = {
    JEE: Rocket,
    NEET: Heart,
    EAMCET_MPC: Calculator,
    EAMCET_BIPC: Microscope
  };

  const programColors = {
    JEE: 'from-blue-600 to-indigo-700',
    NEET: 'from-emerald-600 to-teal-700',
    EAMCET_MPC: 'from-amber-600 to-orange-700',
    EAMCET_BIPC: 'from-rose-600 to-pink-700'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Apex Academy...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-slate-700 font-medium">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm animate-fade-in-down">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white/90">Admissions Open 2026-27</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4 animate-fade-in-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                  Master{' '}
                  <span className="gradient-text">JEE, NEET</span>
                  <br />& EAMCET
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0">
                  South India's premier coaching institute with{' '}
                  <span className="text-white font-semibold">IIT & AIIMS alumni faculty</span>, 
                  cutting-edge CBT labs, and proven results.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={onOpenAdmission}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={onOpenLogin}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Student Portal</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {stats.slice(0, 3).map((stat, idx) => (
                  <div key={idx} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Feature Showcase */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 space-y-4">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                        isActive 
                          ? 'bg-white/10 border-white/30 shadow-xl scale-105' 
                          : 'bg-white/5 border-white/10 hover:bg-white/8'
                      }`}
                      onMouseEnter={() => setActiveFeature(idx)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-white/10 ${feature.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-slate-300'}`}>
                            {feature.title}
                          </h3>
                          <p className={`text-sm mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              Our Programs
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Path to Excellence
            </h2>
            <p className="text-lg text-slate-600">
              Specialized coaching programs designed for India's toughest competitive exams
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {homeData?.programs?.map((prog) => {
              const Icon = programIcons[prog.id] || GraduationCap;
              const colorGradient = programColors[prog.id] || 'from-slate-600 to-slate-700';
              
              return (
                <div
                  key={prog.id}
                  className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${colorGradient}`}></div>
                  
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorGradient} text-white shadow-lg`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {prog.duration}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900">{prog.name}</h3>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${colorGradient} text-white`}>
                        {prog.badge}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Subjects */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Core Subjects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {prog.subjects.map((sub, sidx) => (
                          <span 
                            key={sidx} 
                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="text-sm text-slate-500">
                        Target: <span className="font-semibold text-slate-700">{prog.targetExams?.join(', ')}</span>
                      </div>
                      <button
                        onClick={() => onSelectProgramAdmission?.(prog.id)}
                        className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${colorGradient} text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
              Hall of Fame
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Our Top Rankers
            </h2>
            <p className="text-lg text-slate-600">
              Real students, extraordinary achievements. Proof of our proven methodology.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['ALL', 'JEE', 'NEET', 'EAMCET_MPC', 'EAMCET_BIPC'].map((filter) => {
              const labels = {
                ALL: 'All Streams',
                JEE: 'JEE',
                NEET: 'NEET',
                EAMCET_MPC: 'EAMCET MPC',
                EAMCET_BIPC: 'EAMCET BiPC'
              };
              const isActive = selectedExamFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedExamFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {labels[filter]}
                </button>
              );
            })}
          </div>

          {/* Achievements Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={ach.photo}
                    alt={ach.studentName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg">
                    {ach.rank}
                  </div>
                  
                  {/* Exam Badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg">{ach.studentName}</h3>
                    <p className="text-white/80 text-sm">{ach.exam} • {ach.score}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    <span className="font-semibold text-slate-900">College:</span> {ach.collegeAllotted}
                  </p>
                  <div className="flex items-start gap-2 text-sm text-slate-500 italic bg-slate-50 p-3 rounded-xl">
                    <Quote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{ach.quote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section id="faculty" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
              Expert Faculty
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Learn from the Best
            </h2>
            <p className="text-lg text-slate-600">
              Our faculty comprises IIT & AIIMS alumni with 15+ years of experience
            </p>
          </div>

          {/* Faculty Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeData?.faculty?.map((fac) => (
              <div
                key={fac.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative p-6 pb-0">
                  <div className="relative">
                    <img
                      src={fac.photo}
                      alt={fac.name}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {fac.rating}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 text-center">
                  <h3 className="font-bold text-lg text-slate-900">{fac.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mt-0.5">{fac.designation}</p>
                  <p className="text-xs text-slate-500 mt-1">{fac.qualification}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap justify-center gap-1">
                      {fac.subjects?.slice(0, 2).map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {sub.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{fac.experience}+ Years</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
              Our Campuses
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              State-of-the-Art Campuses
            </h2>
            <p className="text-lg text-slate-600">
              Modern facilities across Hyderabad, Vijayawada, and Visakhapatnam
            </p>
          </div>

          {/* Branch Tabs & Content */}
          {homeData?.branches && homeData.branches.length > 0 && (
            <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200">
              
              {/* Tab Buttons */}
              <div className="flex flex-wrap border-b border-slate-200 bg-white">
                {homeData.branches.map((br, idx) => (
                  <button
                    key={br.id}
                    onClick={() => setSelectedBranchTab(idx)}
                    className={`flex-1 min-w-[150px] px-6 py-4 text-left transition-all duration-300 ${
                      selectedBranchTab === idx
                        ? 'bg-slate-50 border-b-2 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs text-slate-400 font-mono">{br.code}</span>
                    <p className={`font-semibold ${selectedBranchTab === idx ? 'text-blue-600' : 'text-slate-700'}`}>
                      {br.city}
                    </p>
                  </button>
                ))}
              </div>

              {/* Branch Details */}
              {(() => {
                const branch = homeData.branches[selectedBranchTab] || homeData.branches[0];
                return (
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:aspect-auto">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-slate-700">
                        {branch.totalStudents?.toLocaleString()}+ Students
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 space-y-6">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-semibold mb-2">
                          <MapPin className="w-4 h-4" />
                          {branch.city} Campus
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                          {branch.name}
                        </h3>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        {branch.address}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <a href={`tel:${branch.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-colors">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700">{branch.phone}</span>
                        </a>
                        <a href={`mailto:${branch.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-colors">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700 truncate">{branch.email}</span>
                        </a>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                          Campus Facilities
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {branch.facilities?.map((fac, fidx) => (
                            <li key={fidx} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{fac}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={onOpenAdmission}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        Enroll at this Campus
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-sm font-semibold mb-6">
            Limited Seats Available
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Achieve Your Dream Rank?
          </h2>
          
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students who transformed their careers with Apex Academy. 
            Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOpenAdmission}
              className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl shadow-xl hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              Apply for Admission
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={onOpenLogin}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Student Login
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
