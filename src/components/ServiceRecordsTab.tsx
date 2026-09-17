import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  Download, 
  Printer, 
  FileText, 
  Edit3, 
  Trash2, 
  Filter, 
  FileSpreadsheet, 
  Phone, 
  MapPin, 
  Award, 
  AlertTriangle, 
  Calendar,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';
import { EmployeeRecord } from '../types.js';

interface ServiceRecordsTabProps {
  employees: EmployeeRecord[];
  onAddEmployee: () => void;
  onEditEmployee: (employee: EmployeeRecord) => void;
  onDeleteEmployee: (id: string) => void;
  onViewReport: (employee: EmployeeRecord) => void;
  onExportExcel: () => void;
  onExportWord: (employee: EmployeeRecord) => void;
  onPrintAll: () => void;
  onRecordAttendance: (employeeId: string) => void;
}

export const ServiceRecordsTab: React.FC<ServiceRecordsTabProps> = ({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewReport,
  onExportExcel,
  onExportWord,
  onPrintAll,
  onRecordAttendance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');

  // Extract unique filter options
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => {
      if (e.cols.U) set.add(e.cols.U);
      if (e.cols.S) set.add(e.cols.S);
    });
    return Array.from(set).filter(Boolean);
  }, [employees]);

  const ranks = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => {
      if (e.cols.G) set.add(e.cols.G);
    });
    return Array.from(set).filter(Boolean);
  }, [employees]);

  const provinces = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => {
      if (e.cols.BC) set.add(e.cols.BC);
    });
    return Array.from(set).filter(Boolean);
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const c = emp.cols;
      const fullName = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.toLowerCase();
      const motherName = (c.motherFullName || `${c.motherFirstName || ''} ${c.motherFatherName || ''}`).toLowerCase();
      const q = searchQuery.trim().toLowerCase();

      if (q) {
        const matchesName = fullName.includes(q);
        const matchesMother = motherName.includes(q);
        const matchesStat = (c.J || '').toLowerCase().includes(q);
        const matchesPhone = (c.N || '').toLowerCase().includes(q);
        const matchesRank = (c.G || '').toLowerCase().includes(q);
        const matchesJob = (c.H || '').toLowerCase().includes(q);
        const matchesPos = (c.position || '').toLowerCase().includes(q);
        const matchesDept = (c.U || '').toLowerCase().includes(q) || (c.S || '').toLowerCase().includes(q);
        if (!matchesName && !matchesMother && !matchesStat && !matchesPhone && !matchesRank && !matchesJob && !matchesPos && !matchesDept) {
          return false;
        }
      }

      if (selectedEmploymentType && c.employmentType !== selectedEmploymentType) return false;
      if (selectedDept && c.U !== selectedDept && c.S !== selectedDept) return false;
      if (selectedRank && c.G !== selectedRank) return false;
      if (selectedProvince && c.BC !== selectedProvince) return false;

      return true;
    });
  }, [employees, searchQuery, selectedEmploymentType, selectedDept, selectedRank, selectedProvince]);

  // Categorical stats
  const stats = useMemo(() => {
    let officers = 0;
    let otherRanks = 0;
    let civilians = 0;
    let contracts = 0;

    const officerRanks = ['فريق', 'لواء', 'عميد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم اول', 'ملازم'];
    const otherRankTerms = ['مفوض', 'رئيس عرفاء', 'عريف', 'نائب عريف', 'شرطي'];

    employees.forEach(e => {
      const empType = e.cols.employmentType;
      if (empType === 'ضابط') {
        officers++;
        return;
      } else if (empType === 'موظف مدني') {
        civilians++;
        return;
      } else if (empType === 'منتسب') {
        otherRanks++;
        return;
      }

      const r = (e.cols.G || '').trim();
      if (r === 'عقد' || (e.cols.H || '').includes('عقد')) {
        contracts++;
      } else if (officerRanks.some(or => r.includes(or))) {
        officers++;
      } else if (otherRankTerms.some(ort => r.includes(ort))) {
        otherRanks++;
      } else if (r.includes('موظف') || r.includes('مهندس') || r.includes('ملاحظ') || r.includes('كاتب') || !r) {
        civilians++;
      } else {
        otherRanks++;
      }
    });

    return { officers, otherRanks, civilians, contracts };
  }, [employees]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEmploymentType('');
    setSelectedDept('');
    setSelectedRank('');
    setSelectedProvince('');
  };

  const hasActiveFilters = searchQuery || selectedEmploymentType || selectedDept || selectedRank || selectedProvince;

  return (
    <div className="space-y-5">
      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">إجمالي القوة المسجلة</div>
            <div className="text-xl font-black text-slate-900">{employees.length}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">الضباط</div>
            <div className="text-xl font-black text-amber-600">{stats.officers}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">المراتب والمفوضون</div>
            <div className="text-xl font-black text-emerald-600">{stats.otherRanks}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">الموظفون المدنيون</div>
            <div className="text-xl font-black text-blue-600">{stats.civilians}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">العقود التشغيلية</div>
            <div className="text-xl font-black text-purple-600">{stats.contracts}</div>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onAddEmployee}
              className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة موظف جديد</span>
            </button>

            <button
              onClick={onExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={onPrintAll}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة خطوط الخدمة</span>
            </button>
          </div>

          {/* Quick Stats Indicator */}
          <div className="text-xs text-slate-500 font-medium">
            عرض <span className="font-bold text-sky-800">{filteredEmployees.length}</span> من أصل{' '}
            <span className="font-bold text-slate-700">{employees.length}</span> موظف
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، اسم الأم، المنصب، الرقم الإحصائي، الرتبة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Employment Type Filter */}
          <div className="relative">
            <select
              value={selectedEmploymentType}
              onChange={e => setSelectedEmploymentType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 appearance-none cursor-pointer"
            >
              <option value="">جميع أنواع التوظيف</option>
              <option value="ضابط">ضابط</option>
              <option value="موظف مدني">موظف مدني</option>
              <option value="منتسب">منتسب</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 appearance-none cursor-pointer"
            >
              <option value="">جميع الأقسام والمديريات</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Rank Filter */}
          <div className="relative">
            <select
              value={selectedRank}
              onChange={e => setSelectedRank(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 appearance-none cursor-pointer"
            >
              <option value="">جميع الرتب والعناوين</option>
              {ranks.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Province Filter & Reset */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-600 appearance-none cursor-pointer"
              >
                <option value="">جميع المحافظات</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                title="إلغاء التصفية"
                className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold divide-x divide-x-reverse divide-slate-800">
                <th className="py-3 px-3 w-12 text-center">التسلسل</th>
                <th className="py-3 px-3 w-14 text-center">الصورة</th>
                <th className="py-3 px-4 min-w-[170px]">الاسم الكامل</th>
                <th className="py-3 px-3 min-w-[110px]">الرتبة</th>
                <th className="py-3 px-3 min-w-[120px]">العنوان الوظيفي</th>
                <th className="py-3 px-3 min-w-[110px]">الرقم الإحصائي</th>
                <th className="py-3 px-3 min-w-[100px]">التحصيل الدراسي</th>
                <th className="py-3 px-3 min-w-[140px]">القسم / الشعبة</th>
                <th className="py-3 px-3 min-w-[100px] text-center">رقم الهاتف</th>
                <th className="py-3 px-3 min-w-[80px]">المحافظة</th>
                <th className="py-3 px-2 text-center min-w-[150px]">السجلات المتكررة</th>
                <th className="py-3 px-3 text-center min-w-[170px]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold">لا توجد سجلات موظفين مطابقة لمعايير البحث</p>
                    <p className="text-xs mt-1">تأكد من كتابة الاسم بدقة أو قم بإلغاء خيارات التصفية</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const c = emp.cols;
                  const fullName = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.trim() || 'بدون اسم';
                  const motherName = c.motherFullName || [c.motherFirstName, c.motherFatherName, c.motherGrandfatherName].filter(Boolean).join(' ');
                  const thanksCount = emp.lists.thanks?.length || (c.AE ? 1 : 0);
                  const penaltiesCount = emp.lists.penalties?.length || (c.AI ? 1 : 0);
                  const leavesCount = emp.lists.leaves?.length || (c.AO ? 1 : 0);
                  const promotionsCount = (emp.lists.promotions?.length || 0) + (emp.lists.allowances?.length || 0);

                  return (
                    <tr 
                      key={emp.id} 
                      className={`hover:bg-sky-50/50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}`}
                    >
                      {/* Serial */}
                      <td className="py-2.5 px-3 font-extrabold text-center text-sky-900 bg-slate-100/70 border-l border-slate-200">
                        {c.A || (index + 1)}
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="py-2 px-2 text-center">
                        {emp.photo ? (
                          <img
                            src={emp.photo}
                            alt={fullName}
                            className="w-10 h-12 object-cover rounded-md border border-slate-200 mx-auto shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-12 rounded-md bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 mx-auto">
                            —
                          </div>
                        )}
                      </td>

                      {/* Full Name & Extra Info */}
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <button
                          onClick={() => onViewReport(emp)}
                          className="hover:text-sky-700 hover:underline text-right block"
                        >
                          {fullName}
                        </button>
                        {motherName && (
                          <div className="text-[10px] text-slate-500 font-normal">
                            اسم الأم: <span className="font-semibold text-slate-700">{motherName}</span>
                          </div>
                        )}
                        {c.position && (
                          <div className="text-[10px] text-sky-800 font-semibold bg-sky-50 border border-sky-200 rounded px-1.5 py-0.5 inline-block mt-0.5">
                            المنصب: {c.position}
                          </div>
                        )}
                        {c.AP && (
                          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                            ترقية قادمة: {c.AP}
                          </div>
                        )}
                      </td>

                      {/* Rank & Employment Type */}
                      <td className="py-2.5 px-3 font-semibold">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200">
                          {c.G || '—'}
                        </span>
                        {c.employmentType && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            ({c.employmentType})
                          </div>
                        )}
                      </td>

                      {/* Job Title */}
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {c.H || '—'}
                      </td>

                      {/* Statistical ID */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800" dir="ltr">
                        {c.J || '—'}
                      </td>

                      {/* Degree */}
                      <td className="py-2.5 px-3 text-slate-600">
                        {c.Q || '—'}
                      </td>

                      {/* Department / Division */}
                      <td className="py-2.5 px-3 text-slate-600">
                        <div className="font-semibold text-slate-800">{c.U || c.S || '—'}</div>
                        {c.V && <div className="text-[10px] text-slate-500">{c.V}</div>}
                      </td>

                      {/* Phone */}
                      <td className="py-2.5 px-3 font-mono text-center text-slate-700" dir="ltr">
                        {c.N ? (
                          <a href={`tel:${c.N}`} className="text-sky-700 hover:underline">
                            {c.N}
                          </a>
                        ) : '—'}
                      </td>

                      {/* Province */}
                      <td className="py-2.5 px-3 text-slate-600">
                        {c.BC || '—'}
                      </td>

                      {/* Repeatable Lists Badges */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1 flex-wrap text-[10px]">
                          <span 
                            title={`التشكرات والقدمات: ${thanksCount}`}
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              thanksCount > 0 ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            تشكر: {thanksCount}
                          </span>
                          <span 
                            title={`العقوبات: ${penaltiesCount}`}
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              penaltiesCount > 0 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            عقوبة: {penaltiesCount}
                          </span>
                          <span 
                            title={`الإجازات: ${leavesCount}`}
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              leavesCount > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            إجازة: {leavesCount}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewReport(emp)}
                            title="عرض وطباعة خط الخدمة"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onExportWord(emp)}
                            title="تصدير بصيغة Word (.docx)"
                            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditEmployee(emp)}
                            title="تعديل بيانات الموظف"
                            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteEmployee(emp.id)}
                            title="حذف الموظف"
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
