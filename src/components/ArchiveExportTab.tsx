import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Download, 
  Archive, 
  Search, 
  ShieldCheck, 
  FolderArchive,
  Check,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { EmployeeRecord } from '../types.js';

interface ArchiveExportTabProps {
  employees: EmployeeRecord[];
  onExportAllExcel: () => void;
  onExportEmployeeExcel: (employeeId: string) => void;
  onExportEmployeeWord: (employee: EmployeeRecord) => void;
  onViewReport: (employee: EmployeeRecord) => void;
}

export const ArchiveExportTab: React.FC<ArchiveExportTabProps> = ({
  employees,
  onExportAllExcel,
  onExportEmployeeExcel,
  onExportEmployeeWord,
  onViewReport
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];

  const filteredEmployees = employees.filter(e => {
    if (!searchTerm) return true;
    const c = e.cols;
    const full = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.toLowerCase();
    return full.includes(searchTerm.toLowerCase()) || (c.J || '').includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 text-white p-6 rounded-2xl border border-indigo-500/30 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">مركز الأرشفة والتصدير الرقمي المتعدد</h2>
              <p className="text-xs text-indigo-200">
                تصدير السجلات الوظيفية الرسمية بصيغ Excel و Word و PDF متوافقة مع معايير الأرشفة الإدارية بوزارة الداخلية
              </p>
            </div>
          </div>

          <button
            onClick={onExportAllExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير قاعدة البيانات بالكامل (Excel)</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Selection Column */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Archive className="w-4 h-4 text-indigo-600" />
              <span>اختر الموظف للأرشفة والتصدير</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">{employees.length} موظف</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم الإحصائي..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* List of employees */}
          <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {filteredEmployees.map(emp => {
              const c = emp.cols;
              const name = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.F || ''}`.trim() || 'بدون اسم';
              const isSelected = emp.id === selectedEmpId;

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmpId(emp.id)}
                  className={`p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/80 border-r-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {emp.photo ? (
                      <img src={emp.photo} alt="" className="w-8 h-10 object-cover rounded border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-8 h-10 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border border-dashed border-slate-300 shrink-0">
                        —
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">{name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-semibold text-indigo-700">{c.G || '—'}</span>
                        <span>•</span>
                        <span className="font-mono">{c.J || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right / Export Card Options for Selected Employee */}
        <div className="lg:col-span-2 space-y-4">
          {selectedEmployee ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
              {/* Employee Summary Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3.5">
                  {selectedEmployee.photo ? (
                    <img src={selectedEmployee.photo} alt="" className="w-14 h-16 object-cover rounded-lg border border-slate-300 shadow-xs" />
                  ) : (
                    <div className="w-14 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-300">
                      صورة
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      التسلسل الإداري: {selectedEmployee.cols.A || '—'}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {`${selectedEmployee.cols.B || ''} ${selectedEmployee.cols.C || ''} ${selectedEmployee.cols.D || ''} ${selectedEmployee.cols.E || ''} ${selectedEmployee.cols.F || ''}`.trim()}
                    </h3>
                    <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-0.5">
                      <span>الرتبة: <b className="text-slate-800">{selectedEmployee.cols.G || '—'}</b></span>
                      <span>•</span>
                      <span>العنوان: <b className="text-slate-800">{selectedEmployee.cols.H || '—'}</b></span>
                      <span>•</span>
                      <span>الرقم الإحصائي: <b className="text-slate-800 font-mono">{selectedEmployee.cols.J || '—'}</b></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Format Export Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Excel Export (.xlsx) */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">ملف إكسل تفصيلي (.xlsx)</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      يحتوي على أوراق عمل متعددة تشمل المعلومات الأساسية، سجل الترقيات، العلاوات، التشكرات، والعقوبات.
                    </p>
                  </div>
                  <button
                    onClick={() => onExportEmployeeExcel(selectedEmployee.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل Excel</span>
                  </button>
                </div>

                {/* Word Export (.docx) */}
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">وثيقة وورد رسمية (.docx)</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      ملف وورد منسق ومجهز بجدول خط الخدمة المعتمد لدى وزارة الداخلية، مهيأ للطباعة والتوقيع والمصادقة.
                    </p>
                  </div>
                  <button
                    onClick={() => onExportEmployeeWord(selectedEmployee)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل Word</span>
                  </button>
                </div>

                {/* PDF & Printable Report */}
                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/30 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold shadow-xs">
                      <Printer className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">تقرير خط الخدمة (PDF / طباعة)</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      معاينة عالية الدقة مطابقة للنسخة الورقية مع إمكانية الحفظ كملف PDF مباشر أو إرساله إلى الطابعة.
                    </p>
                  </div>
                  <button
                    onClick={() => onViewReport(selectedEmployee)}
                    className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>معاينة وطباعة PDF</span>
                  </button>
                </div>
              </div>

              {/* Attachments and Documents Archive for this employee */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>المستمسكات والأوامر الإدارية المؤرشفة في قاعدة البيانات ({selectedEmployee.files?.length || 0})</span>
                </h4>

                {(!selectedEmployee.files || selectedEmployee.files.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">
                    لا توجد مرفقات محفوظة في ملف هذا الموظف. يمكنك رفع المستمسكات والأوامر من زر "تعديل الموظف".
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedEmployee.files.map(f => (
                      <div key={f.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="truncate min-w-0 pr-2">
                          <div className="font-bold text-slate-800 truncate">{f.desc || f.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{f.name}</div>
                        </div>
                        <a
                          href={f.dataUrl}
                          download={f.name}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-[11px] shrink-0"
                        >
                          تحميل
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
