import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Clock, 
  Bell, 
  Lock, 
  KeyRound, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'records' | 'attendance' | 'alerts' | 'archive';
  setActiveTab: (tab: 'records' | 'attendance' | 'alerts' | 'archive') => void;
  totalEmployees: number;
  alertCount: number;
  onLock: () => void;
  onChangePassword: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalEmployees,
  alertCount,
  onLock,
  onChangePassword
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('ar-IQ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('ar-IQ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white shadow-xl border-b border-sky-800/40 sticky top-0 z-40">
      {/* Top Directorate Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-3 flex flex-wrap items-center justify-between gap-4">
        {/* Ministry Branding & Emblems */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 ring-2 ring-amber-300/30">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">جمهورية العراق - وزارة الداخلية</span>
              <span className="bg-sky-500/20 text-sky-300 text-[11px] px-2 py-0.5 rounded-full font-medium border border-sky-400/30">قاعدة بيانات SQLite</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              منظومة خط الخدمة وإدارة الحضور اليومي
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              مديرية التدريب والتأهيل — إعداد قسم الاتصالات والمعلوماتية
            </p>
          </div>
        </div>

        {/* Live Date, Alerts Badge, Lock Action */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Clock Widget */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-slate-200">{formatTime(currentTime)}</span>
            <span className="text-slate-500">|</span>
            <span>{formatDate(currentTime)}</span>
          </div>

          {/* Employee Count Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 border border-sky-700/50 text-xs font-bold text-sky-200">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>الموظفون:</span>
            <span className="text-amber-400 font-extrabold text-sm">{totalEmployees}</span>
          </div>

          {/* Manager Alerts Indicator */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeTab === 'alerts'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                : 'bg-slate-800/70 text-slate-200 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>التنبيهات</span>
            {alertCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-black text-white bg-rose-600 rounded-full animate-pulse shadow-sm">
                {alertCount}
              </span>
            )}
          </button>

          {/* Change Password */}
          <button
            onClick={onChangePassword}
            title="تغيير كلمة المرور"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">كلمة المرور</span>
          </button>

          {/* Lock System */}
          <button
            onClick={onLock}
            title="قفل النظام"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-900/30 border border-rose-700/50 text-xs text-rose-300 hover:bg-rose-900/50 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">قفل</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-1 py-1.5">
          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'records'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>سجل خط الخدمة للموظفين</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>تسجيل الحضور والانصراف اليومي</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'alerts'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>تنبيهات المديرين ومراقبة الأداء</span>
            {alertCount > 0 && (
              <span className="bg-rose-500 text-white text-[11px] font-black px-1.5 py-0.2 rounded-full">
                {alertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'archive'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>الأرشفة والتصدير (Excel / Word / PDF)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
