import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  UserX, 
  Scale, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Filter, 
  ChevronRight,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { ManagerAlert } from '../types.js';
import * as XLSX from 'xlsx';

interface ManagerAlertsTabProps {
  onSelectEmployee: (employeeId: string) => void;
  onNavigateAttendance: () => void;
}

export const ManagerAlertsTab: React.FC<ManagerAlertsTabProps> = ({
  onSelectEmployee,
  onNavigateAttendance
}) => {
  const [alerts, setAlerts] = useState<ManagerAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const loadAlerts = async (dept = '') => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (dept) q.set('department', dept);
      const res = await fetch(`/api/alerts?${q.toString()}`);
      if (!res.ok) throw new Error('فشل جلب التنبيهات');
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts(selectedDept);
  }, [selectedDept]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    alerts.forEach(a => {
      if (a.department) set.add(a.department);
    });
    return Array.from(set).filter(Boolean);
  }, [alerts]);

  // Counts by category
  const counts = useMemo(() => {
    return {
      total: alerts.length,
      high: alerts.filter(a => a.severity === 'high').length,
      promotions: alerts.filter(a => a.type === 'promotion_due').length,
      allowances: alerts.filter(a => a.type === 'allowance_due').length,
      absent: alerts.filter(a => a.type === 'absent_today').length,
      late: alerts.filter(a => a.type === 'late_today').length,
      penalties: alerts.filter(a => a.type === 'penalty_delay').length
    };
  }, [alerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (selectedType !== 'all' && a.type !== selectedType) return false;
      if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
      return true;
    });
  }, [alerts, selectedType, selectedSeverity]);

  // Export alerts to Excel
  const exportAlertsExcel = () => {
    const headers = ["نوع التنبيه", "درجة الأهمية", "الاسم الكامل", "الرتبة", "الرقم الإحصائي", "القسم", "التاريخ المعني", "البيان والتفاصيل", "الإجراء المطلوب"];
    const rows: any[][] = [
      ["تقرير تنبيهات الأداء الإداري والمتابعة - مديرية التدريب والتأهيل"],
      [`تاريخ التقرير: ${new Date().toISOString().split('T')[0]} | إجمالي التنبيهات: ${alerts.length}`],
      [],
      headers
    ];

    filteredAlerts.forEach(a => {
      rows.push([
        a.title,
        a.severity === 'high' ? 'عاجل / مرتفع' : a.severity === 'medium' ? 'متوسط' : 'معلومة',
        a.employeeName,
        a.rank,
        a.statisticalId,
        a.department,
        a.date,
        a.message,
        a.actionRequired || '—'
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 45 }, { wch: 30 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تنبيهات المديرين");
    XLSX.writeFile(wb, `تنبيهات_المديرين_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-5">
      {/* Alert Highlights Banner */}
      <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-amber-500/30 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">نظام التنبيهات التلقائي لمديري الأقسام</h2>
              <p className="text-xs text-amber-200/80">
                مراقبة حية لاستحقاقات الترقية والعلاوة، رصد الانضباط والغياب اليومي، واحتساب آثار العقوبات الإدارية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAlertsExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير التنبيهات Excel</span>
            </button>
            <button
              onClick={() => loadAlerts(selectedDept)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
            >
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <button
          onClick={() => { setSelectedType('all'); setSelectedSeverity('all'); }}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedType === 'all' && selectedSeverity === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-semibold opacity-75">إجمالي التنبيهات</div>
          <div className="text-2xl font-black mt-1">{counts.total}</div>
        </button>

        {/* High Severity */}
        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'high' ? 'all' : 'high')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedSeverity === 'high'
              ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
              : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>تنبيهات عاجلة</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black mt-1">{counts.high}</div>
        </button>

        {/* Promotions Due */}
        <button
          onClick={() => setSelectedType(selectedType === 'promotion_due' ? 'all' : 'promotion_due')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedType === 'promotion_due'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>استحقاق ترقية</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black mt-1">{counts.promotions}</div>
        </button>

        {/* Allowances Due */}
        <button
          onClick={() => setSelectedType(selectedType === 'allowance_due' ? 'all' : 'allowance_due')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedType === 'allowance_due'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>استحقاق علاوة</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black mt-1">{counts.allowances}</div>
        </button>

        {/* Absent Today */}
        <button
          onClick={() => setSelectedType(selectedType === 'absent_today' ? 'all' : 'absent_today')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedType === 'absent_today'
              ? 'bg-red-600 text-white border-red-600 shadow-sm'
              : 'bg-white text-red-700 border-red-200 hover:bg-red-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>غياب اليوم</span>
            <UserX className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black mt-1">{counts.absent}</div>
        </button>

        {/* Penalty Impacts */}
        <button
          onClick={() => setSelectedType(selectedType === 'penalty_delay' ? 'all' : 'penalty_delay')}
          className={`p-3 rounded-xl border text-right transition-all ${
            selectedType === 'penalty_delay'
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
              : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50/50'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span>عقوبات مؤخرة</span>
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black mt-1">{counts.penalties}</div>
        </button>
      </div>

      {/* Department Filter Selector */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-700">تصفية حسب قسم المدير المختص:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">كافة الأقسام والشعب</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="text-slate-500 font-medium">
          يتم فرز التنبيهات آلياً وتحديثها من قاعدة بيانات SQLite مباشرةً
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <div className="text-sm font-bold text-slate-700">لا توجد تنبيهات تستوجب المعالجة حالياً</div>
            <div className="text-xs text-slate-400 mt-1">كافة الاستحقاقات الإدارية وسجلات الحضور منتظمة ومحدثة</div>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isHigh = alert.severity === 'high';
            const isMedium = alert.severity === 'medium';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs ${
                  isHigh 
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300' 
                    : isMedium 
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left Content */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.type === 'promotion_due' ? 'bg-amber-100 text-amber-700' :
                    alert.type === 'allowance_due' ? 'bg-blue-100 text-blue-700' :
                    alert.type === 'absent_today' ? 'bg-rose-100 text-rose-700' :
                    alert.type === 'late_today' ? 'bg-amber-100 text-amber-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {alert.type === 'promotion_due' && <TrendingUp className="w-5 h-5" />}
                    {alert.type === 'allowance_due' && <Calendar className="w-5 h-5" />}
                    {alert.type === 'absent_today' && <UserX className="w-5 h-5" />}
                    {alert.type === 'late_today' && <Clock className="w-5 h-5" />}
                    {alert.type === 'penalty_delay' && <Scale className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                        isHigh ? 'bg-rose-600 text-white' : isMedium ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {alert.title}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">{alert.employeeName}</span>
                      <span className="text-xs text-slate-500">({alert.rank})</span>
                      <span className="text-[11px] font-mono text-slate-400">إحصائي: {alert.statisticalId}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <span>القسم: <b className="text-slate-700">{alert.department}</b></span>
                      <span>•</span>
                      <span>التاريخ: <b className="text-slate-700 font-mono">{alert.date}</b></span>
                      {alert.actionRequired && (
                        <>
                          <span>•</span>
                          <span className="text-amber-800 font-bold bg-amber-100/60 px-2 py-0.5 rounded">
                            الإجراء: {alert.actionRequired}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {alert.type.includes('absent') || alert.type.includes('late') ? (
                    <button
                      onClick={onNavigateAttendance}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                    >
                      تسجيل الحضور
                    </button>
                  ) : null}

                  <button
                    onClick={() => onSelectEmployee(alert.employeeId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>فتح خط الخدمة</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
