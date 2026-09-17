import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header 
} from './components/Header.js';
import { 
  ServiceRecordsTab 
} from './components/ServiceRecordsTab.js';
import { 
  AttendanceTab 
} from './components/AttendanceTab.js';
import { 
  ManagerAlertsTab 
} from './components/ManagerAlertsTab.js';
import { 
  ArchiveExportTab 
} from './components/ArchiveExportTab.js';
import { 
  EmployeeModal 
} from './components/EmployeeModal.js';
import { 
  ServiceReportModal 
} from './components/ServiceReportModal.js';
import { 
  PasswordModal 
} from './components/PasswordModal.js';
import { 
  EmployeeRecord 
} from './types.js';
import { 
  getEmployees, 
  getDashboardStats, 
  saveEmployee, 
  deleteEmployee, 
  downloadExcel, 
  downloadWord,
  login
} from './api.js';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  FileSpreadsheet, 
  Award,
  Users
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'records' | 'attendance' | 'alerts' | 'archive'>('records');
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [stats, setStats] = useState<any>({
    totalEmployees: 0,
    officers: 0,
    civil: 0,
    alertsCount: 0,
    presentToday: 0
  });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<EmployeeRecord | null>(null);
  const [selectedEmployeeForReport, setSelectedEmployeeForReport] = useState<EmployeeRecord | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Lock Screen state
  const [isLocked, setIsLocked] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [lockError, setLockError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load employees and dashboard stats
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [empData, statsData] = await Promise.all([
        getEmployees(),
        getDashboardStats()
      ]);
      setEmployees(empData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      showToast('تعذر جلب البيانات: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Employee Add / Edit / Delete handlers
  const handleAddEmployee = () => {
    setSelectedEmployeeForEdit(null);
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: EmployeeRecord) => {
    setSelectedEmployeeForEdit(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الموظف نهائياً من خط الخدمة وقاعدة بيانات SQLite؟')) {
      return;
    }
    try {
      await deleteEmployee(id);
      showToast('تم حذف الموظف بنجاح');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'فشل حذف الموظف');
    }
  };

  const handleSaveEmployee = async (data: Partial<EmployeeRecord>) => {
    await saveEmployee(data);
    showToast('تم حفظ بيانات الموظف في قاعدة بيانات SQLite بنجاح');
    await loadData();
  };

  // Export handlers
  const handleExportAllExcel = async () => {
    try {
      showToast('جارٍ إعداد وتصدير ملف Excel...');
      await downloadExcel();
      showToast('تم تنزيل ملف Excel بنجاح');
    } catch (err: any) {
      showToast('فشل التصدير: ' + err.message);
    }
  };

  const handleExportEmployeeExcel = async (employeeId: string) => {
    try {
      showToast('جارٍ تصدير خط الخدمة إلى Excel...');
      await downloadExcel(employeeId);
      showToast('تم تنزيل خط الخدمة Excel بنجاح');
    } catch (err: any) {
      showToast('فشل التصدير: ' + err.message);
    }
  };

  const handleExportEmployeeWord = async (emp: EmployeeRecord) => {
    try {
      const c = emp.cols;
      const fullName = `${c.B || ''} ${c.F || ''}`.trim() || 'موظف';
      showToast('جارٍ تجهيز وثيقة Word الرسمية...');
      await downloadWord(emp.id, fullName);
      showToast('تم تنزيل وثيقة Word بنجاح');
    } catch (err: any) {
      showToast('فشل التصدير: ' + err.message);
    }
  };

  const handleViewReport = (emp: EmployeeRecord) => {
    setSelectedEmployeeForReport(emp);
  };

  const handleSelectEmployeeById = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (emp) {
      setSelectedEmployeeForReport(emp);
    }
  };

  // Unlock handler
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLockError(null);
    try {
      const ok = await login(lockPassword);
      if (ok) {
        setIsLocked(false);
        setLockPassword('');
      } else {
        setLockError('كلمة المرور غير صحيحة (الافتراضية: 123456)');
      }
    } catch (err: any) {
      setLockError(err.message || 'خطأ في التحقق من كلمة المرور');
    }
  };

  // Lock screen view
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-['Cairo',sans-serif]" dir="rtl">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-400">جمهورية العراق - وزارة الداخلية</span>
            <h2 className="text-xl font-black text-white mt-1">النظام مؤمن ومقفل</h2>
            <p className="text-xs text-slate-400 mt-1">يرجى إدخال كلمة مرور الإدارة لفتح منظومة خط الخدمة</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-right">
            {lockError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-lg text-center font-bold">
                {lockError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                value={lockPassword}
                onChange={e => setLockPassword(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                autoFocus
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-center text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              فتح النظام والمتابعة
            </button>
          </form>

          <div className="text-[11px] text-slate-500">
            كلمة المرور المبدئية عند التثبيت: <code className="text-amber-400 font-mono font-bold">123456</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-['Cairo',sans-serif] flex flex-col" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white mr-2">✕</button>
        </div>
      )}

      {/* Main Header with Navigation Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalEmployees={stats.totalEmployees || employees.length}
        alertCount={stats.alertsCount || 0}
        onLock={() => setIsLocked(true)}
        onChangePassword={() => setIsPasswordModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && employees.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-sky-700 animate-spin mx-auto" />
            <div className="text-base font-black text-slate-800">جارٍ تهيئة منظومة خط الخدمة وتحميل قاعدة بيانات SQLite...</div>
            <div className="text-xs text-slate-500">مديرية التدريب والتأهيل — قسم الاتصالات والمعلوماتية</div>
          </div>
        ) : (
          <>
            {/* Tab 1: Service Records */}
            {activeTab === 'records' && (
              <ServiceRecordsTab
                employees={employees}
                onAddEmployee={handleAddEmployee}
                onEditEmployee={handleEditEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                onViewReport={handleViewReport}
                onExportExcel={handleExportAllExcel}
                onExportWord={handleExportEmployeeWord}
                onPrintAll={() => window.print()}
                onRecordAttendance={() => setActiveTab('attendance')}
              />
            )}

            {/* Tab 2: Daily Attendance and Departure */}
            {activeTab === 'attendance' && (
              <AttendanceTab
                onRefreshStats={loadData}
              />
            )}

            {/* Tab 3: Department Manager Alerts */}
            {activeTab === 'alerts' && (
              <ManagerAlertsTab
                onSelectEmployee={handleSelectEmployeeById}
                onNavigateAttendance={() => setActiveTab('attendance')}
              />
            )}

            {/* Tab 4: Multi-Format Archive and Exports */}
            {activeTab === 'archive' && (
              <ArchiveExportTab
                employees={employees}
                onExportAllExcel={handleExportAllExcel}
                onExportEmployeeExcel={handleExportEmployeeExcel}
                onExportEmployeeWord={handleExportEmployeeWord}
                onViewReport={handleViewReport}
              />
            )}
          </>
        )}
      </main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">
            منظومة خط الخدمة وإدارة الحضور والانصراف © {new Date().getFullYear()} — جمهورية العراق / وزارة الداخلية
          </div>
          <div className="text-[11px] text-slate-400">
            مديرية التدريب والتأهيل • قسم الاتصالات والمعلوماتية • شعبة إدارة الملاكات (SQLite Database)
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isEmployeeModalOpen && (
        <EmployeeModal
          employee={selectedEmployeeForEdit}
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setSelectedEmployeeForEdit(null);
          }}
          onSave={handleSaveEmployee}
        />
      )}

      {selectedEmployeeForReport && (
        <ServiceReportModal
          employee={selectedEmployeeForReport}
          onClose={() => setSelectedEmployeeForReport(null)}
          onExportWord={handleExportEmployeeWord}
          onExportExcel={handleExportEmployeeExcel}
        />
      )}

      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
