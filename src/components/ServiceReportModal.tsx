import React from 'react';
import { Printer, Download, X, FileSpreadsheet, Shield, FileText } from 'lucide-react';
import { EmployeeRecord } from '../types.js';

interface ServiceReportModalProps {
  employee: EmployeeRecord | null;
  onClose: () => void;
  onExportWord: (employee: EmployeeRecord) => void;
  onExportExcel: (employeeId: string) => void;
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  employee,
  onClose,
  onExportWord,
  onExportExcel
}) => {
  if (!employee) return null;

  const c = employee.cols;
  const fullName = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.trim() || 'بدون اسم';
  const motherName = c.motherFullName || [c.motherFirstName, c.motherFatherName, c.motherGrandfatherName].filter(Boolean).join(' ') || '—';

  const handlePrint = () => {
    window.print();
  };

  const birthStr = `${c.K || ''}/${c.L || ''}/${c.M || ''}`;
  const now = new Date();
  const printDateStr = now.toLocaleDateString('ar-IQ');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Modal Top Bar (Hidden in print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black">معاينة وطباعة خط الخدمة الرسمي</h3>
              <p className="text-[11px] text-slate-400">سجل الخدمة المعتمد لدى وزارة الداخلية العراقية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة (PDF)</span>
            </button>

            <button
              onClick={() => onExportWord(employee)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>تصدير Word</span>
            </button>

            <button
              onClick={() => onExportExcel(employee.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 space-y-4 text-slate-900 font-['Cairo',sans-serif]">
          {/* Official Letterhead */}
          <div className="border-b-2 border-sky-900 pb-3 flex items-center justify-between text-right">
            <div>
              <h2 className="text-base sm:text-lg font-black text-sky-950">جمهورية العراق - وزارة الداخلية</h2>
              <div className="text-xs font-extrabold text-sky-900">مديرية التدريب والتأهيل</div>
              <div className="text-[11px] text-slate-600 font-semibold">قسم الاتصالات والمعلوماتية - شعبة إدارة الملاكات</div>
            </div>

            <div className="w-16 h-16 rounded-full border-2 border-sky-900 flex items-center justify-center p-1 bg-slate-50">
              <Shield className="w-10 h-10 text-sky-900" />
            </div>

            <div className="text-left text-[11px] text-slate-600 space-y-0.5" dir="rtl">
              <div><b>الرقم:</b> خ.خ / {c.A || '—'}</div>
              <div><b>التاريخ:</b> {printDateStr}</div>
              <div><b>الرقم الإحصائي:</b> <span className="font-mono font-bold">{c.J || '—'}</span></div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-sky-950 text-white text-center py-2 px-4 rounded-md font-black text-sm tracking-wide">
            خلاصة سجل خط الخدمة والسيرة الوظيفية الموحدة
          </div>

          {/* Employee Highlights Box with Photo */}
          <div className="bg-slate-50 border border-sky-900/40 rounded-lg p-3.5 flex items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1">
              <div>
                <span className="text-slate-500 font-bold block text-[10px]">الاسم الكامل:</span>
                <span className="font-black text-slate-950 text-sm">{fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[10px]">نوع التوظيف والرتبة:</span>
                <span className="font-black text-sky-900 text-sm">{c.employmentType || '—'} / {c.G || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[10px]">المنصب الحالي:</span>
                <span className="font-bold text-slate-900">{c.position || c.H || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block text-[10px]">الرقم الإحصائي:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{c.J || '—'}</span>
              </div>
            </div>

            {employee.photo && (
              <img
                src={employee.photo}
                alt=""
                className="w-20 h-24 object-cover rounded border-2 border-sky-900 shadow-xs shrink-0"
              />
            )}
          </div>

          {/* 1. Personal Information */}
          <div className="space-y-1">
            <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
              ١- المعلومات والبيانات الشخصية والعائلية
            </div>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 w-1/4 border-l border-slate-300">اسم الأم الثلاثي مقطع:</td>
                  <td className="p-2 w-1/4 border-l border-slate-300 font-semibold">{motherName}</td>
                  <td className="bg-slate-100 font-bold p-2 w-1/4 border-l border-slate-300">الجنس / المواليد:</td>
                  <td className="p-2 w-1/4">{c.I || '—'} / {birthStr !== '//' ? birthStr : '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">التحصيل الدراسي:</td>
                  <td className="p-2 border-l border-slate-300 font-bold">{c.Q || '—'}</td>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">الديانة / القومية:</td>
                  <td className="p-2">{c.religion || '—'} / {c.ethnicity || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">الحالة الزوجية:</td>
                  <td className="p-2 border-l border-slate-300">{c.maritalStatus || '—'} (عدد الأطفال: {c.childrenCount ?? '0'})</td>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">رقم الهاتف:</td>
                  <td className="p-2 font-mono" dir="ltr">{c.N || '—'}</td>
                </tr>
                <tr>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">محافظة السكن:</td>
                  <td className="p-2 border-l border-slate-300 font-bold">{c.BC || '—'}</td>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">العنوان التفصيلي:</td>
                  <td className="p-2">محلة: {c.BD || '—'} / زقاق: {c.BE || '—'} / دار: {c.BF || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2. Employment & Position Details */}
          <div className="space-y-1">
            <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
              ٢- معلومات العمل، الرتبة/الدرجة، والمنصب
            </div>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 w-1/4 border-l border-slate-300">نوع التوظيف:</td>
                  <td className="p-2 w-1/4 border-l border-slate-300 font-bold text-sky-900">{c.employmentType || '—'}</td>
                  <td className="bg-slate-100 font-bold p-2 w-1/4 border-l border-slate-300">الرتبة / الدرجة:</td>
                  <td className="p-2 w-1/4 font-black">{c.G || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">المنصب الإداري:</td>
                  <td className="p-2 border-l border-slate-300 font-bold">{c.position || '—'}</td>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">أمر المنصب وتاريخه:</td>
                  <td className="p-2">{c.positionOrderNumber || '—'} بتاريخ {c.positionOrderDate || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">تاريخ دخول المسلك:</td>
                  <td className="p-2 border-l border-slate-300 font-semibold">{c.careerEntryDate || '—'}</td>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">أمر التعيين وتاريخه:</td>
                  <td className="p-2">{c.O || '—'} بتاريخ {c.P || '—'}</td>
                </tr>
                {c.reinstatementOrderNumber && (
                  <tr className="border-b border-slate-200 bg-amber-50/50">
                    <td className="bg-amber-100/70 font-bold p-2 border-l border-slate-300">أمر الإعادة (الوكالة الإدارية):</td>
                    <td colSpan={3} className="p-2 font-semibold text-amber-950">
                      رقم الأمر: {c.reinstatementOrderNumber} بتاريخ {c.reinstatementOrderDate || '—'}
                    </td>
                  </tr>
                )}
                {/* Military Course */}
                {(c.employmentType === 'ضابط' || c.employmentType === 'منتسب') && (
                  <tr>
                    <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">بيانات الدورة العسكرية:</td>
                    <td colSpan={3} className="p-2">
                      مكان الدورة: <b>{c.militaryCoursePlace || 'كلية الشرطة'}</b> | رقم الدورة: <b>{c.militaryCourseNumber || '—'}</b> | تاريخ التخرج: <b>{c.militaryGraduationDate || '—'}</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3. Directorates Hierarchy (Current, Previous, Pre-2003) */}
          <div className="space-y-1">
            <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
              ٣- الهيكل الإداري والمديريات (الحالية، السابقة، وقبل 9/4/2003)
            </div>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
                  <th className="p-2 border-l border-slate-300 w-1/4">المستوى الإداري</th>
                  <th className="p-2 border-l border-slate-300">المديرية الحالية</th>
                  <th className="p-2 border-l border-slate-300">المديرية السابقة</th>
                  <th className="p-2">المديرية قبل 2003/4/9</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 font-bold p-2 border-l border-slate-300">الوكالة:</td>
                  <td className="p-2 border-l border-slate-300 font-bold text-sky-900">{c.currAgency || c.R || '—'}</td>
                  <td className="p-2 border-l border-slate-300">{c.prevAgency || '—'}</td>
                  <td className="p-2">{c.pre2003Agency || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 font-bold p-2 border-l border-slate-300">المديرية العامة:</td>
                  <td className="p-2 border-l border-slate-300 font-bold">{c.currDirectorateGeneral || c.S || '—'}</td>
                  <td className="p-2 border-l border-slate-300">{c.prevDirectorateGeneral || '—'}</td>
                  <td className="p-2">{c.pre2003DirectorateGeneral || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 font-bold p-2 border-l border-slate-300">المديرية الفرعية:</td>
                  <td className="p-2 border-l border-slate-300">{c.currDirectorateSub || c.T || '—'}</td>
                  <td className="p-2 border-l border-slate-300">{c.prevDirectorateSub || '—'}</td>
                  <td className="p-2">{c.pre2003DirectorateSub || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 font-bold p-2 border-l border-slate-300">القسم:</td>
                  <td className="p-2 border-l border-slate-300 font-bold">{c.currDepartment || c.U || '—'}</td>
                  <td className="p-2 border-l border-slate-300">{c.prevDepartment || '—'}</td>
                  <td className="p-2">{c.pre2003Department || '—'}</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 font-bold p-2 border-l border-slate-300">الشعبة:</td>
                  <td className="p-2 border-l border-slate-300">{c.currDivision || c.V || '—'}</td>
                  <td className="p-2 border-l border-slate-300">{c.prevDivision || '—'}</td>
                  <td className="p-2">{c.pre2003Division || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Previous Directorates Transfer Orders */}
          {employee.lists.prevdirs && employee.lists.prevdirs.length > 0 && (
            <div className="space-y-1">
              <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
                ٤- أوامر النقل والمديريات السابقة الإضافية ({employee.lists.prevdirs.length})
              </div>
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-1.5 border-l border-slate-300 w-10 text-center">#</th>
                    <th className="p-1.5 border-l border-slate-300">المديرية / الجهة</th>
                    <th className="p-1.5 border-l border-slate-300">رقم أمر النقل</th>
                    <th className="p-1.5">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.lists.prevdirs.map((d, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold border-l border-slate-300">{i + 1}</td>
                      <td className="p-1.5 border-l border-slate-300 font-semibold">{d.name || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300">{d.num || '—'}</td>
                      <td className="p-1.5">{d.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. Promotions History */}
          {employee.lists.promotions && employee.lists.promotions.length > 0 && (
            <div className="space-y-1">
              <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
                ٥- سجل الترقيات السابق ({employee.lists.promotions.length})
              </div>
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-1.5 border-l border-slate-300 w-10 text-center">#</th>
                    <th className="p-1.5 border-l border-slate-300">نوع الحركة</th>
                    <th className="p-1.5 border-l border-slate-300">من رتبة / درجة</th>
                    <th className="p-1.5 border-l border-slate-300">إلى رتبة / درجة</th>
                    <th className="p-1.5 border-l border-slate-300">تاريخ الترقية</th>
                    <th className="p-1.5 border-l border-slate-300">رقم الأمر الإداري</th>
                    <th className="p-1.5">المقدار والملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.lists.promotions.map((p, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold border-l border-slate-300">{i + 1}</td>
                      <td className="p-1.5 border-l border-slate-300 font-bold text-sky-900">{p.kind || 'ترقية اعتيادية'}</td>
                      <td className="p-1.5 border-l border-slate-300">{p.from || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300 font-bold text-emerald-900">{p.to || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300">{p.date || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300 font-mono">{p.num || '—'}</td>
                      <td className="p-1.5">{p.amount || p.change || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. Commendations & Seniority */}
          {employee.lists.thanks && employee.lists.thanks.length > 0 && (
            <div className="space-y-1">
              <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
                ٦- التشكرات والقدمات الإدارية الممنوحة ({employee.lists.thanks.length})
              </div>
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-1.5 border-l border-slate-300 w-10 text-center">#</th>
                    <th className="p-1.5 border-l border-slate-300">النوع</th>
                    <th className="p-1.5 border-l border-slate-300">البيان والجهة المانحة</th>
                    <th className="p-1.5 border-l border-slate-300">مدة القدم المترتب</th>
                    <th className="p-1.5 border-l border-slate-300">رقم الأمر الإداري</th>
                    <th className="p-1.5">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.lists.thanks.map((t, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold border-l border-slate-300">{i + 1}</td>
                      <td className="p-1.5 border-l border-slate-300 font-bold">{t.kind || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300">{t.desc || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300 font-semibold text-emerald-800">{t.duration || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300 font-mono">{t.num || '—'}</td>
                      <td className="p-1.5">{t.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. Disciplinary Actions */}
          {employee.lists.penalties && employee.lists.penalties.length > 0 && (
            <div className="space-y-1">
              <div className="bg-rose-900 text-white px-3 py-1 text-xs font-bold rounded-t">
                ٧- العقوبات والتأخيرات المسجلة ({employee.lists.penalties.length})
              </div>
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-1.5 border-l border-slate-300 w-10 text-center">#</th>
                    <th className="p-1.5 border-l border-slate-300">نوع العقوبة</th>
                    <th className="p-1.5 border-l border-slate-300">مقدار التأخير المترتب</th>
                    <th className="p-1.5 border-l border-slate-300">رقم الأمر الإداري</th>
                    <th className="p-1.5">تاريخ العقوبة</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.lists.penalties.map((p, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="p-1.5 text-center font-bold border-l border-slate-300">{i + 1}</td>
                      <td className="p-1.5 border-l border-slate-300 font-bold text-rose-700">{p.type || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300 font-semibold text-rose-800">{p.amount || '—'}</td>
                      <td className="p-1.5 border-l border-slate-300 font-mono">{p.num || '—'}</td>
                      <td className="p-1.5">{p.date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 8. Upcoming dates & Allocations */}
          <div className="space-y-1">
            <div className="bg-sky-900 text-white px-3 py-1 text-xs font-bold rounded-t">
              ٨- الاستحقاقات القادمة والمخصصات المالية
            </div>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 w-1/4 border-l border-slate-300">تاريخ الترقية القادمة:</td>
                  <td className="p-2 w-1/4 border-l border-slate-300 font-bold text-sky-900">{c.AP || '—'}</td>
                  <td className="bg-slate-100 font-bold p-2 w-1/4 border-l border-slate-300">تاريخ العلاوة القادمة:</td>
                  <td className="p-2 w-1/4 font-bold text-sky-900">{c.AQ || '—'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">مخصصات المنصب:</td>
                  <td className="p-2 border-l border-slate-300">{c.AT || '—'} {c.AU ? `(${c.AU})` : ''}</td>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">مخصصات الشهادة:</td>
                  <td className="p-2">{c.AV || '—'} (أمر: {c.AX || '—'})</td>
                </tr>
                <tr>
                  <td className="bg-slate-100 font-bold p-2 border-l border-slate-300">مخصصات أخرى:</td>
                  <td colSpan={3} className="p-2">{c.AY || '—'} (أمر: {c.AZ || '—'} بتاريخ {c.BA || '—'})</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 9. Administrative Notes */}
          {c.BH && (
            <div className="space-y-1">
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold rounded-t">
                ٩- الملاحظات الإدارية ومؤشرات الأداء
              </div>
              <div className="p-2.5 border border-slate-300 text-xs text-slate-800 bg-slate-50 leading-relaxed">
                {c.BH}
              </div>
            </div>
          )}

          {/* Signatures and Official Seals */}
          <div className="pt-6 border-t-2 border-slate-300 flex justify-between items-end text-xs font-bold text-slate-800">
            <div className="text-center space-y-8">
              <div>منظم الاستمارة / ضابط الملاك</div>
              <div>التوقيع: .......................................</div>
            </div>

            <div className="text-center space-y-8">
              <div>مدقق شعبة الاتصالات والمعلوماتية</div>
              <div>التوقيع: .......................................</div>
            </div>

            <div className="text-center space-y-8">
              <div>مصادقة مدير قسم الاتصالات والمعلوماتية</div>
              <div>التوقيع والختم الرسمي: .......................................</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
