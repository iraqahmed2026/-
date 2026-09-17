import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Briefcase, 
  FileSpreadsheet, 
  Save, 
  Users, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AttendanceRecord, AttendanceStatus } from '../types.js';
import * as XLSX from 'xlsx';

interface AttendanceTabProps {
  initialDate?: string;
  onRefreshStats?: () => void;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  initialDate = new Date().toISOString().split('T')[0],
  onRefreshStats
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load attendance data
  const loadAttendance = async (date: string, dept: string) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ date, department: dept });
      const res = await fetch(`/api/attendance?${q.toString()}`);
      if (!res.ok) throw new Error('فشل جلب سجل الحضور');
      const data: AttendanceRecord[] = await res.json();
      setRecords(data);
    } catch (err: any) {
      console.error(err);
      showMessage('خطأ في تحميل سجل الحضور: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance(selectedDate, departmentFilter);
  }, [selectedDate, departmentFilter]);

  const showMessage = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Department list
  const departments = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.department) set.add(r.department);
    });
    return Array.from(set).filter(Boolean);
  }, [records]);

  // Statistics
  const stats = useMemo(() => {
    const total = records.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;
    let mission = 0;

    records.forEach(r => {
      switch (r.status) {
        case 'present': present++; break;
        case 'absent': absent++; break;
        case 'late': late++; break;
        case 'leave': leave++; break;
        case 'mission': mission++; break;
      }
    });

    const attendanceRate = total > 0 ? Math.round(((present + late + mission) / total) * 100) : 0;
    return { total, present, absent, late, leave, mission, attendanceRate };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = (r.employeeName || '').toLowerCase().includes(q);
        const matchesStat = (r.statisticalId || '').toLowerCase().includes(q);
        const matchesRank = (r.rank || '').toLowerCase().includes(q);
        if (!matchesName && !matchesStat && !matchesRank) return false;
      }
      return true;
    });
  }, [records, statusFilter, searchQuery]);

  // Quick Time helper
  const getCurrentTimeStr = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  // Update single employee attendance
  const updateStatus = async (employeeId: string, newStatus: AttendanceStatus) => {
    setSavingId(employeeId);
    const existing = records.find(r => r.employeeId === employeeId);
    let inTime = existing?.checkInTime;
    let outTime = existing?.checkOutTime;

    if (newStatus === 'present' && !inTime) {
      inTime = '08:00';
    } else if (newStatus === 'late' && !inTime) {
      inTime = getCurrentTimeStr();
    } else if (newStatus === 'absent' || newStatus === 'leave') {
      inTime = undefined;
      outTime = undefined;
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
          status: newStatus,
          checkInTime: inTime,
          checkOutTime: outTime,
          notes: existing?.notes || ''
        })
      });

      if (!res.ok) throw new Error('فشل التحديث');

      setRecords(prev => prev.map(r => {
        if (r.employeeId === employeeId) {
          return {
            ...r,
            status: newStatus,
            checkInTime: inTime,
            checkOutTime: outTime
          };
        }
        return r;
      }));

      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      showMessage('تعذر حفظ الحضور: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const updateTimes = async (employeeId: string, inTime?: string, outTime?: string, notes?: string) => {
    setSavingId(employeeId);
    const existing = records.find(r => r.employeeId === employeeId);
    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
          status: existing?.status || 'present',
          checkInTime: inTime,
          checkOutTime: outTime,
          notes: notes !== undefined ? notes : existing?.notes
        })
      });

      setRecords(prev => prev.map(r => {
        if (r.employeeId === employeeId) {
          let workHours = 0;
          if (inTime && outTime) {
            const [ih, im] = inTime.split(':').map(Number);
            const [oh, om] = outTime.split(':').map(Number);
            const diff = (oh * 60 + om) - (ih * 60 + im);
            if (diff > 0) workHours = Math.round((diff / 60) * 100) / 100;
          }
          return {
            ...r,
            checkInTime: inTime,
            checkOutTime: outTime,
            notes: notes !== undefined ? notes : r.notes,
            workHours
          };
        }
        return r;
      }));
    } catch (err: any) {
      showMessage('تعذر تحديث الأوقات: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  // Bulk mark all filtered as Present
  const handleBulkPresent = async () => {
    const items = filteredRecords.map(r => ({
      employeeId: r.employeeId,
      date: selectedDate,
      status: 'present',
      checkInTime: r.checkInTime || '08:00',
      checkOutTime: r.checkOutTime || '14:30',
      notes: r.notes || ''
    }));

    setLoading(true);
    try {
      const res = await fetch('/api/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: items })
      });
      if (!res.ok) throw new Error('فشل تسجيل الحضور الجماعي');

      showMessage(`تم تسجيل حضور (${items.length}) موظف بنجاح`);
      loadAttendance(selectedDate, departmentFilter);
      if (onRefreshStats) onRefreshStats();
    } catch (err: any) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Date Navigation
  const shiftDate = (days: number) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + days);
    setSelectedDate(curr.toISOString().split('T')[0]);
  };

  // Export Daily Attendance Excel
  const exportAttendanceExcel = () => {
    const headers = [
      "الرقم الإحصائي", "الاسم الكامل", "الرتبة", "القسم / الشعبة",
      "التاريخ", "الحالة", "وقت الحضور", "وقت الانصراف", "ساعات العمل", "ملاحظات"
    ];

    const statusMap: Record<string, string> = {
      present: 'حاضر',
      absent: 'غائب',
      late: 'متأخر',
      leave: 'مجاز',
      mission: 'مأمورية / إيفاد'
    };

    const rows = [
      [`تقرير الحضور والانصراف اليومي - مديرية التدريب والتأهيل`],
      [`تاريخ التقرير: ${selectedDate} | عدد القوة: ${records.length} | نسبة الحضور: ${stats.attendanceRate}%`],
      [],
      headers
    ];

    records.forEach(r => {
      rows.push([
        r.statisticalId || '—',
        r.employeeName || '—',
        r.rank || '—',
        r.department || '—',
        r.date,
        statusMap[r.status] || r.status,
        r.checkInTime || '—',
        r.checkOutTime || '—',
        r.workHours ? `${r.workHours} ساعة` : '—',
        r.notes || ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "سجل الحضور اليومي");
    XLSX.writeFile(wb, `حضور_${selectedDate}.xlsx`);
    showMessage('تم تصدير سجل الحضور بنجاح');
  };

  return (
    <div className="space-y-5">
      {/* Date & Filter Control Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector with quick steps */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => shiftDate(1)}
              title="اليوم التالي"
              className="p-1.5 hover:bg-white rounded text-slate-700 hover:text-slate-900 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 px-2 py-0.5 outline-none cursor-pointer"
            />
            <button
              onClick={() => shiftDate(-1)}
              title="اليوم السابق"
              className="p-1.5 hover:bg-white rounded text-slate-700 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              selectedDate === new Date().toISOString().split('T')[0]
                ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            اليوم الحالي
          </button>
        </div>

        {/* Department and Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            <option value="">كافة الأقسام والمديريات</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={handleBulkPresent}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>تسجيل حضور جماعي (الكل حاضر)</span>
          </button>

          <button
            onClick={exportAttendanceExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>تصدير Excel</span>
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {statusMessage && (
        <div className="bg-sky-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center justify-between animate-fade-in">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-slate-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Daily Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Strength */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">إجمالي القوة</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">موظف مسجل</div>
        </div>

        {/* Present */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'present' ? 'all' : 'present')}
          className={`bg-white p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all ${
            statusFilter === 'present' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>حاضرون</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.present}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{stats.attendanceRate}% نسبة الحضور</div>
        </div>

        {/* Absent */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'absent' ? 'all' : 'absent')}
          className={`bg-white p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all ${
            statusFilter === 'absent' ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>غائبون</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{stats.absent}</div>
          <div className="text-[10px] text-rose-600 mt-0.5">بدون عذر مؤكد</div>
        </div>

        {/* Late */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'late' ? 'all' : 'late')}
          className={`bg-white p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all ${
            statusFilter === 'late' ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20' : 'border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>متأخرون</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{stats.late}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">بعد موعد الدوام</div>
        </div>

        {/* Leaves */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'leave' ? 'all' : 'leave')}
          className={`bg-white p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all ${
            statusFilter === 'leave' ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/20' : 'border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-sky-700">
            <span>إجازات رسمية</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-700 mt-1">{stats.leave}</div>
          <div className="text-[10px] text-sky-600 mt-0.5">مرضية / اعتيادية</div>
        </div>

        {/* Official Mission */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'mission' ? 'all' : 'mission')}
          className={`bg-white p-3.5 rounded-xl border shadow-sm cursor-pointer transition-all ${
            statusFilter === 'mission' ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/20' : 'border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-purple-700">
            <span>مأمورية / إيفاد</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">{stats.mission}</div>
          <div className="text-[10px] text-purple-600 mt-0.5">واجبات خارجية</div>
        </div>
      </div>

      {/* Search and Status Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث فوري بالاسم، الرقم الإحصائي، أو الرتبة لتسجيل الحضور..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold ml-1">تصفية حسب الحالة:</span>
          {(['all', 'present', 'absent', 'late', 'leave', 'mission'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' && 'الكل'}
              {st === 'present' && 'الحاضرون'}
              {st === 'absent' && 'الغائبون'}
              {st === 'late' && 'المتأخرون'}
              {st === 'leave' && 'المجازون'}
              {st === 'mission' && 'المأموريات'}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Interactive Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold divide-x divide-x-reverse divide-slate-800">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3 w-14 text-center">الصورة</th>
                <th className="py-3 px-4 min-w-[170px]">الاسم الكامل والرتبة</th>
                <th className="py-3 px-3 min-w-[120px]">القسم / الشعبة</th>
                <th className="py-3 px-3 min-w-[100px] text-center">الرقم الإحصائي</th>
                <th className="py-3 px-4 min-w-[280px] text-center">الحالة اليومية (تسجيل فوري)</th>
                <th className="py-3 px-3 min-w-[120px] text-center">وقت الحضور</th>
                <th className="py-3 px-3 min-w-[120px] text-center">وقت الانصراف</th>
                <th className="py-3 px-3 min-w-[150px]">ملاحظات / سبب الغياب أو الإجازة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    لا توجد سجلات حضور مطابقة
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const isSaving = savingId === rec.employeeId;

                  return (
                    <tr 
                      key={rec.employeeId} 
                      className={`hover:bg-slate-50 transition-colors ${
                        rec.status === 'absent' ? 'bg-rose-50/30' : rec.status === 'late' ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="py-2 px-2 text-center">
                        {rec.photo ? (
                          <img
                            src={rec.photo}
                            alt=""
                            className="w-9 h-11 object-cover rounded border border-slate-200 mx-auto"
                          />
                        ) : (
                          <div className="w-9 h-11 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 mx-auto border border-dashed border-slate-300">
                            —
                          </div>
                        )}
                      </td>

                      {/* Name & Rank */}
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <div>{rec.employeeName}</div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                          {rec.rank || 'غير محدد'}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.department || '—'}
                      </td>

                      {/* Stat ID */}
                      <td className="py-2.5 px-3 font-mono font-bold text-center text-slate-800" dir="ltr">
                        {rec.statisticalId || '—'}
                      </td>

                      {/* Status Switcher Buttons */}
                      <td className="py-2.5 px-4 text-center">
                        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg gap-1 border border-slate-200">
                          {/* Present */}
                          <button
                            onClick={() => updateStatus(rec.employeeId, 'present')}
                            title="تسجيل حاضر"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              rec.status === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            حاضر
                          </button>

                          {/* Late */}
                          <button
                            onClick={() => updateStatus(rec.employeeId, 'late')}
                            title="تسجيل متأخر"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              rec.status === 'late'
                                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            متأخر
                          </button>

                          {/* Absent */}
                          <button
                            onClick={() => updateStatus(rec.employeeId, 'absent')}
                            title="تسجيل غائب"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              rec.status === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            غائب
                          </button>

                          {/* Leave */}
                          <button
                            onClick={() => updateStatus(rec.employeeId, 'leave')}
                            title="تسجيل مجاز"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              rec.status === 'leave'
                                ? 'bg-sky-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            مجاز
                          </button>

                          {/* Mission */}
                          <button
                            onClick={() => updateStatus(rec.employeeId, 'mission')}
                            title="تسجيل مأمورية"
                            className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                              rec.status === 'mission'
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            إيفاد
                          </button>
                        </div>
                      </td>

                      {/* Check-in time */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="time"
                            value={rec.checkInTime || ''}
                            onChange={e => updateTimes(rec.employeeId, e.target.value, rec.checkOutTime)}
                            className="w-20 px-1.5 py-1 text-xs border border-slate-300 rounded bg-white text-center font-mono font-bold"
                          />
                          <button
                            onClick={() => updateTimes(rec.employeeId, getCurrentTimeStr(), rec.checkOutTime)}
                            title="الآن"
                            className="px-1.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded"
                          >
                            الآن
                          </button>
                        </div>
                      </td>

                      {/* Check-out time */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="time"
                            value={rec.checkOutTime || ''}
                            onChange={e => updateTimes(rec.employeeId, rec.checkInTime, e.target.value)}
                            className="w-20 px-1.5 py-1 text-xs border border-slate-300 rounded bg-white text-center font-mono font-bold"
                          />
                          <button
                            onClick={() => updateTimes(rec.employeeId, rec.checkInTime, getCurrentTimeStr())}
                            title="الآن"
                            className="px-1.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded"
                          >
                            الآن
                          </button>
                        </div>
                        {rec.workHours ? (
                          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            {rec.workHours} ساعة
                          </div>
                        ) : null}
                      </td>

                      {/* Notes */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          placeholder="ملاحظات، رقم أمر الإيفاد، نوع الإجازة..."
                          value={rec.notes || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setRecords(prev => prev.map(item => item.employeeId === rec.employeeId ? { ...item, notes: val } : item));
                          }}
                          onBlur={e => updateTimes(rec.employeeId, rec.checkInTime, rec.checkOutTime, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-sky-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
