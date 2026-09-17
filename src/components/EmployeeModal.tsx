import React, { useState, useMemo } from 'react';
import { 
  X, 
  Save, 
  Camera, 
  Upload, 
  Plus, 
  Trash2, 
  FileText, 
  Shield, 
  ChevronDown,
  Building2,
  GraduationCap,
  Award,
  Calendar,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { 
  EmployeeRecord, 
  EmployeeCols, 
  EmployeeLists, 
  EmployeeAttachment
} from '../types.js';
import {
  EDUCATION_LEVELS,
  RELIGIONS,
  ETHNICITIES,
  MOI_AGENCIES,
  MARITAL_STATUSES,
  IRAQ_PROVINCES,
  MOI_POSITIONS,
  EMPLOYMENT_TYPES,
  OFFICER_RANKS,
  CIVILIAN_GRADES,
  ENLISTEE_RANKS,
  MILITARY_COURSE_PLACES,
  PROMOTION_KINDS,
  getRanksForEmploymentType,
  EmploymentType
} from '../constants/moiData.js';

interface EmployeeModalProps {
  employee: EmployeeRecord | null;
  onClose: () => void;
  onSave: (employeeData: Partial<EmployeeRecord>) => Promise<void>;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  onClose,
  onSave
}) => {
  const isEditing = !!employee?.id;

  // Infer employment type if not set
  const initialEmploymentType = useMemo<EmploymentType>(() => {
    if (employee?.cols?.employmentType && ['ضابط', 'موظف مدني', 'منتسب'].includes(employee.cols.employmentType)) {
      return employee.cols.employmentType as EmploymentType;
    }
    const rank = employee?.cols?.G || '';
    if (OFFICER_RANKS.includes(rank)) return 'ضابط';
    if (CIVILIAN_GRADES.includes(rank) || rank.startsWith('موظف') || rank.includes('مهندس') || rank.includes('ملاحظ') || rank.includes('كاتب')) {
      return 'موظف مدني';
    }
    if (ENLISTEE_RANKS.includes(rank) || rank.includes('شرطي') || rank.includes('مفوض') || rank.includes('عريف')) {
      return 'منتسب';
    }
    return 'ضابط';
  }, [employee]);

  const [employmentType, setEmploymentType] = useState<EmploymentType>(initialEmploymentType);

  const [cols, setCols] = useState<EmployeeCols>(() => {
    const raw = employee?.cols || {};
    return {
      A: raw.A || '',
      B: raw.B || '',
      C: raw.C || '',
      D: raw.D || '',
      E: raw.E || '',
      F: raw.F || '',
      G: raw.G || (initialEmploymentType === 'ضابط' ? 'ملازم' : initialEmploymentType === 'موظف مدني' ? 'الدرجة الخامسة' : 'شرطي'),
      H: raw.H || '',
      I: raw.I || 'ذكر',
      J: raw.J || '',
      K: raw.K || '1990',
      L: raw.L || '01',
      M: raw.M || '01',
      N: raw.N || '',
      O: raw.O || '',
      P: raw.P || '',
      Q: raw.Q || 'بكالوريوس',
      R: raw.currAgency || raw.R || 'الدوائر المرتبطة بمكتب السيد الوزير',
      S: raw.currDirectorateGeneral || raw.S || 'مديرية التدريب والتأهيل',
      T: raw.currDirectorateSub || raw.T || '',
      U: raw.currDepartment || raw.U || 'قسم الاتصالات والمعلوماتية',
      V: raw.currDivision || raw.V || '',
      W: raw.W || '',
      X: raw.X || '',
      Y: raw.Y || '',
      Z: raw.Z || '',
      AA: raw.AA || '',
      AB: raw.AB || '',
      AC: raw.AC || '',
      AD: raw.AD || '',
      AE: raw.AE || '',
      AF: raw.AF || '',
      AG: raw.AG || '',
      AH: raw.AH || '',
      AI: raw.AI || '',
      AJ: raw.AJ || '',
      AK: raw.AK || '',
      AL: raw.AL || '',
      AM: raw.AM || '',
      AN: raw.AN || '',
      AO: raw.AO || '',
      AP: raw.AP || '',
      AQ: raw.AQ || '',
      AR: raw.AR || '',
      AS: raw.AS || '',
      AT: raw.AT || 'يوجد',
      AU: raw.AU || '',
      AV: raw.AV || '',
      AW: raw.AW || '',
      AX: raw.AX || '',
      AY: raw.AY || '',
      AZ: raw.AZ || '',
      BA: raw.BA || '',
      BB: raw.BB || '',
      BC: raw.BC || 'بغداد',
      BD: raw.BD || '',
      BE: raw.BE || '',
      BF: raw.BF || '',
      BG: raw.BG || '',
      BH: raw.BH || '',
      BI: raw.BI || '',

      // 1. Personal details
      motherFirstName: raw.motherFirstName || '',
      motherFatherName: raw.motherFatherName || '',
      motherGrandfatherName: raw.motherGrandfatherName || '',
      motherFullName: raw.motherFullName || '',
      religion: raw.religion || 'مسلم',
      ethnicity: raw.ethnicity || 'عربي',
      maritalStatus: raw.maritalStatus || 'متزوج',
      childrenCount: raw.childrenCount || '0',

      // 2. Employment details
      employmentType: initialEmploymentType,
      position: raw.position || 'مدير قسم',
      positionOrderNumber: raw.positionOrderNumber || '',
      positionOrderDate: raw.positionOrderDate || '',
      careerEntryDate: raw.careerEntryDate || '',

      // Current Directorate
      currAgency: raw.currAgency || raw.R || 'الدوائر المرتبطة بمكتب السيد الوزير',
      currDirectorateGeneral: raw.currDirectorateGeneral || raw.S || 'مديرية التدريب والتأهيل',
      currDirectorateSub: raw.currDirectorateSub || raw.T || '',
      currDepartment: raw.currDepartment || raw.U || 'قسم الاتصالات والمعلوماتية',
      currDivision: raw.currDivision || raw.V || '',

      // Previous Directorate
      prevAgency: raw.prevAgency || '',
      prevDirectorateGeneral: raw.prevDirectorateGeneral || '',
      prevDirectorateSub: raw.prevDirectorateSub || '',
      prevDepartment: raw.prevDepartment || '',
      prevDivision: raw.prevDivision || '',

      // Pre 2003-04-09 Directorate
      pre2003Agency: raw.pre2003Agency || '',
      pre2003DirectorateGeneral: raw.pre2003DirectorateGeneral || '',
      pre2003DirectorateSub: raw.pre2003DirectorateSub || '',
      pre2003Department: raw.pre2003Department || '',
      pre2003Division: raw.pre2003Division || '',

      // Military Course
      militaryCoursePlace: raw.militaryCoursePlace || 'كلية الشرطة',
      militaryCourseNumber: raw.militaryCourseNumber || '',
      militaryGraduationDate: raw.militaryGraduationDate || '',

      // Reinstatement Order
      reinstatementOrderNumber: raw.reinstatementOrderNumber || '',
      reinstatementOrderDate: raw.reinstatementOrderDate || ''
    };
  });

  const [lists, setLists] = useState<EmployeeLists>(() => {
    if (employee?.lists) {
      return {
        thanks: employee.lists.thanks ? [...employee.lists.thanks] : [],
        penalties: employee.lists.penalties ? [...employee.lists.penalties] : [],
        leaves: employee.lists.leaves ? [...employee.lists.leaves] : [],
        courses: employee.lists.courses ? [...employee.lists.courses] : [],
        allocations: employee.lists.allocations ? [...employee.lists.allocations] : [],
        promotions: employee.lists.promotions ? [...employee.lists.promotions] : [],
        allowances: employee.lists.allowances ? [...employee.lists.allowances] : [],
        prevdirs: employee.lists.prevdirs ? [...employee.lists.prevdirs] : []
      };
    }
    return {
      thanks: [],
      penalties: [],
      leaves: [],
      courses: [],
      allocations: [],
      promotions: [],
      allowances: [],
      prevdirs: []
    };
  });

  const [photo, setPhoto] = useState<string | null>(employee?.photo || null);
  const [files, setFiles] = useState<EmployeeAttachment[]>(employee?.files ? [...employee.files] : []);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field change handler
  const handleColChange = (key: keyof EmployeeCols, val: string) => {
    setCols(prev => ({ ...prev, [key]: val }));
  };

  // Change employment type and adjust available ranks
  const handleEmploymentTypeChange = (newType: EmploymentType) => {
    setEmploymentType(newType);
    const availableRanks = getRanksForEmploymentType(newType);
    setCols(prev => {
      const currentRank = prev.G || '';
      const keepRank = availableRanks.includes(currentRank);
      return {
        ...prev,
        employmentType: newType,
        G: keepRank ? currentRank : availableRanks[0]
      };
    });
  };

  // Mother name composite sync
  const handleMotherNamePartChange = (field: 'motherFirstName' | 'motherFatherName' | 'motherGrandfatherName', val: string) => {
    setCols(prev => {
      const updated = { ...prev, [field]: val };
      const full = [updated.motherFirstName, updated.motherFatherName, updated.motherGrandfatherName]
        .map(s => s?.trim())
        .filter(Boolean)
        .join(' ');
      return { ...updated, motherFullName: full };
    });
  };

  // Photo picker
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً (الحد الأقصى 8 ميجابايت)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Document attachments picker
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded: File[] = Array.from(e.target.files || []);
    uploaded.forEach((file: File) => {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage(`الملف ${file.name} كبير جداً (الحد الأقصى 15 ميجابايت)`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: EmployeeAttachment = {
          id: 'att_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          name: file.name,
          type: file.type || 'application/octet-stream',
          desc: file.name.replace(/\.[^/.]+$/, ''),
          dataUrl: reader.result as string,
          createdAt: new Date().toISOString()
        };
        setFiles(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cols.B?.trim()) {
      setErrorMessage('الاسم الأول للموظف مطلوب إلزامياً');
      return;
    }

    setSaving(true);
    setErrorMessage(null);
    try {
      // Sync primary ministry columns
      const finalCols: EmployeeCols = {
        ...cols,
        employmentType,
        R: cols.currAgency || cols.R,
        S: cols.currDirectorateGeneral || cols.S,
        T: cols.currDirectorateSub || cols.T,
        U: cols.currDepartment || cols.U,
        V: cols.currDivision || cols.V,
        motherFullName: [cols.motherFirstName, cols.motherFatherName, cols.motherGrandfatherName]
          .map(s => s?.trim())
          .filter(Boolean)
          .join(' ')
      };

      await onSave({
        id: employee?.id,
        cols: finalCols,
        lists,
        photo,
        files
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء حفظ السجل');
    } finally {
      setSaving(false);
    }
  };

  const currentAvailableRanks = getRanksForEmploymentType(employmentType);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4 border-b border-sky-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-700 flex items-center justify-center text-white font-bold shadow-md shadow-sky-800/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isEditing ? `تعديل بيانات الموظف: ${cols.B || ''} ${cols.F || ''}` : 'إضافة موظف جديد إلى خط الخدمة'}
              </h3>
              <p className="text-xs text-sky-200">
                مديرية التدريب والتأهيل — قسم الاتصالات والمعلوماتية (قاعدة بيانات SQLite)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-full">
              {cols.A ? `التسلسل: ${cols.A}` : 'التسلسل: تلقائي'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-50 text-rose-800 px-6 py-2.5 text-xs font-bold border-b border-rose-200 flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800">✕</button>
          </div>
        )}

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-slate-800 flex-1">
          {/* Top Card: Photo & Digital Archive Attachments */}
          <div className="p-4 rounded-xl bg-slate-50 border border-sky-200/80 flex flex-wrap gap-6 items-start">
            {/* Photo */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-700">الصورة الشخصية الرسمية</span>
              <div className="w-24 h-32 rounded-lg bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                {photo ? (
                  <img src={photo} alt="صورة الموظف" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
                <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                  <Upload className="w-4 h-4 mb-1" />
                  <span>تغيير الصورة</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="text-[11px] text-rose-600 hover:underline font-bold"
                >
                  حذف الصورة
                </button>
              )}
            </div>

            {/* Document Attachments */}
            <div className="flex-1 min-w-[280px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">المستمسكات والأوامر الإدارية المؤرشفة</span>
                <label className="flex items-center gap-1 text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white px-3 py-1.5 rounded-lg cursor-pointer shadow-xs transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة وثيقة / أمر إداري</span>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFilesUpload} className="hidden" />
                </label>
              </div>

              {files.length === 0 ? (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-center text-xs text-slate-400">
                  لا توجد مستمسكات أو أوامر مرفقة. اضغط على الزر أعلاه لإرفاق قرارات التعيين، الهويات، والأوامر الإدارية.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {files.map((file, idx) => (
                    <div key={file.id || idx} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <div className="truncate flex-1">
                          <input
                            type="text"
                            placeholder="وصف الوثيقة (أمر إداري رقم...)"
                            value={file.desc || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setFiles(prev => prev.map((f, i) => i === idx ? { ...f, desc: val } : f));
                            }}
                            className="w-full text-xs font-semibold px-2 py-0.5 border border-slate-200 rounded"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 max-w-[120px] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: Personal Information & Family (المعلومات الشخصية) */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open>
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">١</span>
                <span>المعلومات الشخصية والعائلية</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>
            
            <div className="p-4 space-y-4 text-xs">
              {/* Row 1: Employee Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الأول *</label>
                  <input
                    type="text"
                    value={cols.B || ''}
                    onChange={e => handleColChange('B', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الثاني</label>
                  <input
                    type="text"
                    value={cols.C || ''}
                    onChange={e => handleColChange('C', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الثالث</label>
                  <input
                    type="text"
                    value={cols.D || ''}
                    onChange={e => handleColChange('D', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم الرابع</label>
                  <input
                    type="text"
                    value={cols.E || ''}
                    onChange={e => handleColChange('E', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اللقب والعشيرة</label>
                  <input
                    type="text"
                    value={cols.F || ''}
                    onChange={e => handleColChange('F', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Requirement 1-أ: Mother Triple Name Segmented (اسم الأم الثلاثي مقطع) */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <span>🌸 اسم الأم الثلاثي (مقطع بحسب القيود الرسمية):</span>
                  </span>
                  {cols.motherFullName && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-md">
                      الاسم الكامل: {cols.motherFullName}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">اسم الأم الأول</label>
                    <input
                      type="text"
                      placeholder="اسم الأم الأول"
                      value={cols.motherFirstName || ''}
                      onChange={e => handleMotherNamePartChange('motherFirstName', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">اسم والد الأم (أب الأم)</label>
                    <input
                      type="text"
                      placeholder="اسم والد الأم"
                      value={cols.motherFatherName || ''}
                      onChange={e => handleMotherNamePartChange('motherFatherName', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">اسم جد الأم / اللقب</label>
                    <input
                      type="text"
                      placeholder="اسم جد الأم أو لقبها"
                      value={cols.motherGrandfatherName || ''}
                      onChange={e => handleMotherNamePartChange('motherGrandfatherName', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Requirement 1: Dropdowns for Education, Religion, Ethnicity, Marital Status & Children */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Education Dropdown */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">التحصيل الدراسي *</label>
                  <select
                    value={cols.Q || 'بكالوريوس'}
                    onChange={e => handleColChange('Q', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-bold text-sky-950"
                  >
                    {EDUCATION_LEVELS.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                {/* Religion Dropdown */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الديانة *</label>
                  <select
                    value={cols.religion || 'مسلم'}
                    onChange={e => handleColChange('religion', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
                  >
                    {RELIGIONS.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>

                {/* Ethnicity Dropdown */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القومية *</label>
                  <select
                    value={cols.ethnicity || 'عربي'}
                    onChange={e => handleColChange('ethnicity', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
                  >
                    {ETHNICITIES.map(eth => (
                      <option key={eth} value={eth}>{eth}</option>
                    ))}
                  </select>
                </div>

                {/* Requirement 1-ب: Marital Status Dropdown */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الحالة الزوجية *</label>
                  <select
                    value={cols.maritalStatus || 'متزوج'}
                    onChange={e => handleColChange('maritalStatus', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
                  >
                    {MARITAL_STATUSES.map(ms => (
                      <option key={ms} value={ms}>{ms}</option>
                    ))}
                  </select>
                </div>

                {/* Requirement 1-ب: Children count */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">عدد الأطفال</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={cols.childrenCount ?? '0'}
                    onChange={e => handleColChange('childrenCount', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono text-center font-bold"
                  />
                </div>
              </div>

              {/* Row 3: Gender, Birth, Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الجنس</label>
                  <select
                    value={cols.I || 'ذكر'}
                    onChange={e => handleColChange('I', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="انثى">انثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ المواليد (سنة / شهر / يوم)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="سنة"
                      value={cols.K || ''}
                      onChange={e => handleColChange('K', e.target.value)}
                      className="w-1/3 p-2 border border-slate-300 rounded-lg bg-white text-center font-mono"
                    />
                    <input
                      type="text"
                      placeholder="شهر"
                      value={cols.L || ''}
                      onChange={e => handleColChange('L', e.target.value)}
                      className="w-1/3 p-2 border border-slate-300 rounded-lg bg-white text-center font-mono"
                    />
                    <input
                      type="text"
                      placeholder="يوم"
                      value={cols.M || ''}
                      onChange={e => handleColChange('M', e.target.value)}
                      className="w-1/3 p-2 border border-slate-300 rounded-lg bg-white text-center font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={cols.N || ''}
                    onChange={e => handleColChange('N', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono"
                    dir="ltr"
                    placeholder="07xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={cols.BG || ''}
                    onChange={e => handleColChange('BG', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono"
                    dir="ltr"
                    placeholder="name@moi.gov.iq"
                  />
                </div>
              </div>

              {/* Requirement 1-ت: Residence with Province Dropdown (عنوان السكن) */}
              <div className="p-3 bg-slate-100/80 border border-slate-300 rounded-xl space-y-2">
                <span className="font-extrabold text-slate-800 block">🏡 عنوان السكن الدائم:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المحافظة (قائمة منسدلة) *</label>
                    <select
                      value={cols.BC || 'بغداد'}
                      onChange={e => handleColChange('BC', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-bold text-sky-950"
                    >
                      {IRAQ_PROVINCES.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">محلة</label>
                    <input
                      type="text"
                      placeholder="مثال: حي الجامعة 620"
                      value={cols.BD || ''}
                      onChange={e => handleColChange('BD', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">زقاق</label>
                    <input
                      type="text"
                      placeholder="مثال: 14"
                      value={cols.BE || ''}
                      onChange={e => handleColChange('BE', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">دار</label>
                    <input
                      type="text"
                      placeholder="مثال: 8"
                      value={cols.BF || ''}
                      onChange={e => handleColChange('BF', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: Employment Information (معلومات العمل) */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open>
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">٢</span>
                <span>معلومات العمل، الرتبة/الدرجة، والمنصب</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>

            <div className="p-4 space-y-4 text-xs">
              {/* Requirement 2-ب: Employment Type Selector (نوع التوظيف: ضابط / موظف مدني / منتسب) */}
              <div className="p-3.5 bg-gradient-to-r from-sky-900/10 via-slate-100 to-sky-900/10 border border-sky-300 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sky-950 font-black text-xs">
                    ⭐ نوع التوظيف (يحدد تلقائياً قائمة الرتب والدرجات وسجلات الدورات):
                  </label>
                  <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
                    النوع الحالي: {employmentType}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {EMPLOYMENT_TYPES.map(typeItem => {
                    const isSelected = employmentType === typeItem.id;
                    return (
                      <button
                        key={typeItem.id}
                        type="button"
                        onClick={() => handleEmploymentTypeChange(typeItem.id as EmploymentType)}
                        className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-sky-900 text-white border-sky-900 shadow-md shadow-sky-900/20 ring-2 ring-sky-500/40'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <UserCheck className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{typeItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ranks & Basic Work Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Dynamic Rank Dropdown based on Employment Type */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {employmentType === 'ضابط' 
                      ? 'الرتبة العسكرية (قائمة الضباط) *' 
                      : employmentType === 'موظف مدني' 
                        ? 'الدرجة الوظيفية (قائمة الموظفين المدنيين) *' 
                        : 'رتبة المنتسب (قائمة المنتسبين) *'}
                  </label>
                  <select
                    value={cols.G || currentAvailableRanks[0]}
                    onChange={e => handleColChange('G', e.target.value)}
                    className="w-full p-2 border-2 border-sky-600 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-black text-sky-950 text-sm"
                  >
                    {currentAvailableRanks.map(rankItem => (
                      <option key={rankItem} value={rankItem}>{rankItem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">العنوان الوظيفي / الاختصاص</label>
                  <input
                    type="text"
                    placeholder="مثال: معاون رئيس مهندسين، ضابط حقوقي..."
                    value={cols.H || ''}
                    onChange={e => handleColChange('H', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الرقم الإحصائي *</label>
                  <input
                    type="text"
                    value={cols.J || ''}
                    onChange={e => handleColChange('J', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono font-bold"
                    dir="ltr"
                    placeholder="مثال: 871980188"
                  />
                </div>

                {/* Requirement 2-ت: Career Entry Date (تاريخ دخول المسلك) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ دخول المسلك</label>
                  <input
                    type="date"
                    value={cols.careerEntryDate || ''}
                    onChange={e => handleColChange('careerEntryDate', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Requirement 2-أ: Position Dropdown with Administrative Order & Date */}
              <div className="p-3 bg-slate-100/90 border border-slate-300 rounded-xl space-y-2">
                <span className="font-extrabold text-slate-900 block">
                  📌 بيانات المنصب والأمر الإداري بالمنصب:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">المنصب (قائمة منسدلة) *</label>
                    <select
                      value={cols.position || 'بدون منصب / موظف'}
                      onChange={e => handleColChange('position', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-bold text-sky-950"
                    >
                      {MOI_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">رقم الأمر الإداري بالمنصب</label>
                    <input
                      type="text"
                      placeholder="رقم الأمر الإداري"
                      value={cols.positionOrderNumber || ''}
                      onChange={e => handleColChange('positionOrderNumber', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">تاريخ الأمر الإداري بالمنصب</label>
                    <input
                      type="date"
                      value={cols.positionOrderDate || ''}
                      onChange={e => handleColChange('positionOrderDate', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Appointment Orders & Requirement 2-خ: Reinstatement Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم أمر التعيين</label>
                  <input
                    type="text"
                    value={cols.O || ''}
                    onChange={e => handleColChange('O', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ أمر التعيين</label>
                  <input
                    type="date"
                    value={cols.P || ''}
                    onChange={e => handleColChange('P', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                  />
                </div>

                {/* Requirement 2-خ: Reinstatement Order from Administrative Agency */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    أمر الإعادة للداخلية (الوكالة الإدارية)
                  </label>
                  <input
                    type="text"
                    placeholder="رقم أمر الإعادة"
                    value={cols.reinstatementOrderNumber || ''}
                    onChange={e => handleColChange('reinstatementOrderNumber', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">تاريخ أمر الإعادة</label>
                  <input
                    type="date"
                    value={cols.reinstatementOrderDate || ''}
                    onChange={e => handleColChange('reinstatementOrderDate', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                  />
                </div>
              </div>

              {/* Requirement 2-ح: Military Course Section (for Officer or Enlistee) */}
              {(employmentType === 'ضابط' || employmentType === 'منتسب') && (
                <div className="p-3.5 bg-sky-950 text-white rounded-xl space-y-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="font-extrabold text-xs text-white">
                      بيانات الدورة العسكرية الأساسية ({employmentType === 'ضابط' ? 'كلية الشرطة / المعهد العالي' : 'معهد المفوضين / التدريب'}):
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-900">
                    <div>
                      <label className="block text-sky-200 font-bold mb-1 text-[11px]">
                        مكان الدورة (قائمة منسدلة) *
                      </label>
                      <select
                        value={cols.militaryCoursePlace || 'كلية الشرطة'}
                        onChange={e => handleColChange('militaryCoursePlace', e.target.value)}
                        className="w-full p-2 border border-sky-400 rounded-lg bg-white focus:ring-2 focus:ring-amber-400 outline-none font-bold text-xs"
                      >
                        {MILITARY_COURSE_PLACES.map(place => (
                          <option key={place} value={place}>{place}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sky-200 font-bold mb-1 text-[11px]">رقم الدورة</label>
                      <input
                        type="text"
                        placeholder="مثال: دورة 64، دورة 28 تأهيلية"
                        value={cols.militaryCourseNumber || ''}
                        onChange={e => handleColChange('militaryCourseNumber', e.target.value)}
                        className="w-full p-2 border border-sky-400 rounded-lg bg-white focus:ring-2 focus:ring-amber-400 outline-none text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sky-200 font-bold mb-1 text-[11px]">تاريخ التخرج من الدورة</label>
                      <input
                        type="date"
                        value={cols.militaryGraduationDate || ''}
                        onChange={e => handleColChange('militaryGraduationDate', e.target.value)}
                        className="w-full p-2 border border-sky-400 rounded-lg bg-white focus:ring-2 focus:ring-amber-400 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 3: Directorates Hierarchy (قسم خاص للمديرية)          */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open>
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">٣</span>
                <span>سجل المديريات (المديرية الحالية، السابقة، وقبل 9/4/2003)</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>

            <div className="p-4 space-y-4 text-xs">
              {/* Requirement 2-ث-أ: Current Directorate (المديرية الحالية) */}
              <div className="p-3.5 bg-white border border-sky-300 rounded-xl space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 text-sky-900 font-extrabold">
                  <Building2 className="w-4 h-4 text-sky-700" />
                  <span>أ- المديرية الحالية:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الوكالة (قائمة منسدلة) *</label>
                    <select
                      value={cols.currAgency || cols.R || 'الدوائر المرتبطة بمكتب السيد الوزير'}
                      onChange={e => {
                        const val = e.target.value;
                        handleColChange('currAgency', val);
                        handleColChange('R', val);
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-semibold text-sky-950"
                    >
                      {MOI_AGENCIES.map(ag => (
                        <option key={ag} value={ag}>{ag}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المديرية العامة</label>
                    <input
                      type="text"
                      placeholder="مديرية التدريب والتأهيل"
                      value={cols.currDirectorateGeneral || cols.S || ''}
                      onChange={e => {
                        const val = e.target.value;
                        handleColChange('currDirectorateGeneral', val);
                        handleColChange('S', val);
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المديرية الفرعية</label>
                    <input
                      type="text"
                      placeholder="المديرية الفرعية إن وجدت"
                      value={cols.currDirectorateSub || cols.T || ''}
                      onChange={e => {
                        const val = e.target.value;
                        handleColChange('currDirectorateSub', val);
                        handleColChange('T', val);
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">القسم</label>
                    <input
                      type="text"
                      placeholder="قسم الاتصالات والمعلوماتية"
                      value={cols.currDepartment || cols.U || ''}
                      onChange={e => {
                        const val = e.target.value;
                        handleColChange('currDepartment', val);
                        handleColChange('U', val);
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الشعبة</label>
                    <input
                      type="text"
                      placeholder="شعبة الاتصالات، شعبة النظم..."
                      value={cols.currDivision || cols.V || ''}
                      onChange={e => {
                        const val = e.target.value;
                        handleColChange('currDivision', val);
                        handleColChange('V', val);
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Requirement 2-ث-ب: Previous Directorate (المديرية السابقة) */}
              <div className="p-3.5 bg-slate-100/80 border border-slate-300 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-slate-800 font-extrabold">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>ب- المديرية السابقة (المنقول منها):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الوكالة (قائمة منسدلة)</label>
                    <select
                      value={cols.prevAgency || ''}
                      onChange={e => handleColChange('prevAgency', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-600 outline-none"
                    >
                      <option value="">— اختر الوكالة —</option>
                      {MOI_AGENCIES.map(ag => (
                        <option key={ag} value={ag}>{ag}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المديرية العامة</label>
                    <input
                      type="text"
                      placeholder="المديرية العامة السابقة"
                      value={cols.prevDirectorateGeneral || ''}
                      onChange={e => handleColChange('prevDirectorateGeneral', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المديرية الفرعية</label>
                    <input
                      type="text"
                      placeholder="المديرية الفرعية"
                      value={cols.prevDirectorateSub || ''}
                      onChange={e => handleColChange('prevDirectorateSub', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">القسم</label>
                    <input
                      type="text"
                      placeholder="القسم السابق"
                      value={cols.prevDepartment || ''}
                      onChange={e => handleColChange('prevDepartment', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الشعبة</label>
                    <input
                      type="text"
                      placeholder="الشعبة السابقة"
                      value={cols.prevDivision || ''}
                      onChange={e => handleColChange('prevDivision', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Requirement 2-ث-ت: Directorate Pre-2003 (المديرية قبل 9/4/2003) */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-amber-950 font-extrabold">
                  <Building2 className="w-4 h-4 text-amber-800" />
                  <span>ت- المديرية قبل تاريخ 2003/4/9:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الوكالة (قائمة منسدلة)</label>
                    <select
                      value={cols.pre2003Agency || ''}
                      onChange={e => handleColChange('pre2003Agency', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="">— اختر الوكالة —</option>
                      {MOI_AGENCIES.map(ag => (
                        <option key={ag} value={ag}>{ag}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المديرية العامة</label>
                    <input
                      type="text"
                      placeholder="المديرية قبل 2003"
                      value={cols.pre2003DirectorateGeneral || ''}
                      onChange={e => handleColChange('pre2003DirectorateGeneral', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">المديرية الفرعية</label>
                    <input
                      type="text"
                      placeholder="المديرية الفرعية"
                      value={cols.pre2003DirectorateSub || ''}
                      onChange={e => handleColChange('pre2003DirectorateSub', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">القسم</label>
                    <input
                      type="text"
                      placeholder="القسم"
                      value={cols.pre2003Department || ''}
                      onChange={e => handleColChange('pre2003Department', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">الشعبة</label>
                    <input
                      type="text"
                      placeholder="الشعبة"
                      value={cols.pre2003Division || ''}
                      onChange={e => handleColChange('pre2003Division', e.target.value)}
                      className="w-full p-2 border border-amber-300 rounded-lg bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Repeatable Transfer Records (أوامر النقل الإضافية) */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block">
                  أوامر النقل والمديريات السابقة الإضافية ({lists.prevdirs.length}):
                </span>
                {lists.prevdirs.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">اسم المديرية / الجهة المنقول منها</label>
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, prevdirs: p.prevdirs.map((it, i) => i === idx ? { ...it, name: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">رقم أمر النقل</label>
                      <input
                        type="text"
                        value={item.num || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, prevdirs: p.prevdirs.map((it, i) => i === idx ? { ...it, num: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">تاريخ أمر النقل</label>
                        <input
                          type="date"
                          value={item.date || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setLists(p => ({ ...p, prevdirs: p.prevdirs.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, prevdirs: p.prevdirs.filter((_, i) => i !== idx) }))}
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLists(p => ({ ...p, prevdirs: [...p.prevdirs, { name: '', num: '', date: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة أمر نقل سابق</span>
                </button>
              </div>
            </div>
          </details>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 4: Promotions & Allowances (سجل الترقيات والعلاوات)   */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open>
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">٤</span>
                <span>سجل الترقيات السابقة والعلاوات والمستحقات القادمة</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>

            <div className="p-4 space-y-4 text-xs">
              {/* Upcoming dates for Alerts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-lg bg-amber-50/70 border border-amber-300">
                <div>
                  <label className="block text-amber-900 font-extrabold mb-1">📅 تاريخ الترقية القادمة (محفز للتنبيه التلقائي)</label>
                  <input
                    type="date"
                    value={cols.AP || ''}
                    onChange={e => handleColChange('AP', e.target.value)}
                    className="w-full p-2 border border-amber-400 rounded-lg bg-white font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-amber-700 mt-0.5 block">سيقوم النظام بتنبيه مدير القسم قبل الموعد بـ 30 يوماً</span>
                </div>
                <div>
                  <label className="block text-amber-900 font-extrabold mb-1">📈 تاريخ العلاوة القادمة (محفز للتنبيه التلقائي)</label>
                  <input
                    type="date"
                    value={cols.AQ || ''}
                    onChange={e => handleColChange('AQ', e.target.value)}
                    className="w-full p-2 border border-amber-400 rounded-lg bg-white font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-amber-700 mt-0.5 block">إشعار آلي لجدول العلاوات السنوية</span>
                </div>
              </div>

              {/* Requirement 2-ج: Promotions rows with Movement Kind dropdown & Ranks dropdowns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 block">
                    سجل الترقيات السابقة ({lists.promotions.length}):
                  </span>
                  <span className="text-[11px] text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                    رتب الترقية متوافقة مع نوع التوظيف ({employmentType})
                  </span>
                </div>

                {lists.promotions.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-6 gap-2 items-end">
                    {/* Promotion Kind Dropdown */}
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-bold">نوع الحركة *</label>
                      <select
                        value={item.kind || 'ترقية اعتيادية'}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, promotions: p.promotions.map((it, i) => i === idx ? { ...it, kind: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold text-sky-950"
                      >
                        {PROMOTION_KINDS.map(pk => (
                          <option key={pk} value={pk}>{pk}</option>
                        ))}
                      </select>
                    </div>

                    {/* From Rank Dropdown */}
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-bold">من رتبة / درجة *</label>
                      <select
                        value={item.from || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, promotions: p.promotions.map((it, i) => i === idx ? { ...it, from: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold"
                      >
                        <option value="">— اختر الرتبة السابقة —</option>
                        {currentAvailableRanks.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    {/* To Rank Dropdown */}
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-bold">إلى رتبة / درجة *</label>
                      <select
                        value={item.to || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, promotions: p.promotions.map((it, i) => i === idx ? { ...it, to: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold text-sky-900"
                      >
                        <option value="">— اختر الرتبة الجديدة —</option>
                        {currentAvailableRanks.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">تاريخ الترقية</label>
                      <input
                        type="date"
                        value={item.date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, promotions: p.promotions.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">رقم الأمر الإداري</label>
                      <input
                        type="text"
                        placeholder="رقم الأمر"
                        value={item.num || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, promotions: p.promotions.map((it, i) => i === idx ? { ...it, num: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      />
                    </div>

                    <div className="flex gap-1 items-end">
                      <input
                        type="text"
                        placeholder="المقدار / جدول كانون"
                        value={item.amount || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, promotions: p.promotions.map((it, i) => i === idx ? { ...it, amount: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, promotions: p.promotions.filter((_, i) => i !== idx) }))}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setLists(p => ({ 
                    ...p, 
                    promotions: [...p.promotions, { 
                      kind: 'ترقية اعتيادية', 
                      from: currentAvailableRanks[0] || '', 
                      to: currentAvailableRanks[1] || '', 
                      date: '', 
                      num: '', 
                      change: 'زيادة', 
                      amount: '' 
                    }] 
                  }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة حركة ترقية سابقة</span>
                </button>
              </div>

              {/* Annual Allowances */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <span className="font-extrabold text-slate-800 block">
                  سجل العلاوات السنوية الممنوحة ({lists.allowances.length}):
                </span>
                {lists.allowances.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">نوع العلاوة</label>
                      <input
                        type="text"
                        value={item.kind || 'علاوة سنوية'}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, allowances: p.allowances.map((it, i) => i === idx ? { ...it, kind: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">تاريخ منح العلاوة</label>
                      <input
                        type="date"
                        value={item.date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, allowances: p.allowances.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">رقم الأمر الإداري</label>
                      <input
                        type="text"
                        value={item.num || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, allowances: p.allowances.map((it, i) => i === idx ? { ...it, num: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">المقدار والملاحظة</label>
                      <input
                        type="text"
                        placeholder="علاوة سنوية مستحقة"
                        value={item.amount || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, allowances: p.allowances.map((it, i) => i === idx ? { ...it, amount: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, allowances: p.allowances.filter((_, i) => i !== idx) }))}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded w-full flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLists(p => ({ ...p, allowances: [...p.allowances, { kind: 'علاوة سنوية', date: '', num: '', change: 'زيادة', amount: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة علاوة سنوية</span>
                </button>
              </div>
            </div>
          </details>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 5: Commendations & Penalties                         */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden" open>
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">٥</span>
                <span>كتب الشكر والقدم والعقوبات الانضباطية</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>

            <div className="p-4 space-y-4 text-xs">
              {/* Thanks */}
              <div className="space-y-2">
                <span className="font-extrabold text-sky-900 block">سجل كتب الشكر والتقدير والقدم الممنوح ({lists.thanks.length}):</span>
                {lists.thanks.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-bold">النوع</label>
                      <select
                        value={item.kind || 'شكر'}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, thanks: p.thanks.map((it, i) => i === idx ? { ...it, kind: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold"
                      >
                        <option value="شكر">شكر وتقدير</option>
                        <option value="قدم">قدم ممتاز</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">البيان والجهة المانحة</label>
                      <input
                        type="text"
                        value={item.desc || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, thanks: p.thanks.map((it, i) => i === idx ? { ...it, desc: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">مدة القدم</label>
                      <input
                        type="text"
                        placeholder="مثال: شهر، 6 أشهر"
                        value={item.duration || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, thanks: p.thanks.map((it, i) => i === idx ? { ...it, duration: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold text-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">رقم الأمر الإداري</label>
                      <input
                        type="text"
                        value={item.num || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, thanks: p.thanks.map((it, i) => i === idx ? { ...it, num: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      />
                    </div>
                    <div className="flex gap-1 items-end">
                      <input
                        type="date"
                        value={item.date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, thanks: p.thanks.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, thanks: p.thanks.filter((_, i) => i !== idx) }))}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLists(p => ({ ...p, thanks: [...p.thanks, { kind: 'شكر', desc: '', duration: '', num: '', date: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة كتاب شكر أو قدم</span>
                </button>
              </div>

              {/* Penalties */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <span className="font-extrabold text-rose-900 block">سجل العقوبات الانضباطية والتأخيرات ({lists.penalties.length}):</span>
                {lists.penalties.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-rose-200 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-bold">نوع العقوبة</label>
                      <input
                        type="text"
                        placeholder="لفت نظر، إنذار، توبيخ، قطع راتب..."
                        value={item.type || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, penalties: p.penalties.map((it, i) => i === idx ? { ...it, type: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold text-rose-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">مقدار التأخير المترتب على الترقية</label>
                      <input
                        type="text"
                        placeholder="مثال: شهر، 3 أشهر"
                        value={item.amount || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, penalties: p.penalties.map((it, i) => i === idx ? { ...it, amount: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-bold text-rose-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">رقم الأمر الإداري</label>
                      <input
                        type="text"
                        value={item.num || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, penalties: p.penalties.map((it, i) => i === idx ? { ...it, num: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      />
                    </div>
                    <div className="flex gap-1 items-end">
                      <input
                        type="date"
                        value={item.date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, penalties: p.penalties.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, penalties: p.penalties.filter((_, i) => i !== idx) }))}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLists(p => ({ ...p, penalties: [...p.penalties, { type: '', amount: '', num: '', date: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-800 hover:text-rose-950 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة عقوبة انضباطية</span>
                </button>
              </div>
            </div>
          </details>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 6: Leaves & Specialized Courses                      */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">٦</span>
                <span>الإجازات الرسمية والدورات التخصصية الأخرى</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>

            <div className="p-4 space-y-4 text-xs">
              {/* Leaves */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">سجل الإجازات الرسمية ({lists.leaves.length}):</span>
                {lists.leaves.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">نوع الإجازة</label>
                      <input
                        type="text"
                        placeholder="اعتيادية، مرضية، دراسية، أمومة..."
                        value={item.type || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, leaves: p.leaves.map((it, i) => i === idx ? { ...it, type: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">مدة الإجازة</label>
                      <input
                        type="text"
                        placeholder="مثال: 15 يوم، شهر"
                        value={item.duration || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, leaves: p.leaves.map((it, i) => i === idx ? { ...it, duration: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </div>
                    <div className="flex gap-1 items-end">
                      <input
                        type="date"
                        value={item.date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, leaves: p.leaves.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, leaves: p.leaves.filter((_, i) => i !== idx) }))}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLists(p => ({ ...p, leaves: [...p.leaves, { type: '', duration: '', date: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة إجازة</span>
                </button>
              </div>

              {/* Specialized Courses */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700 block">الدورات التدريبية والتطويرية التخصصية ({lists.courses.length}):</span>
                {lists.courses.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">اسم الدورة ومكانها</label>
                      <input
                        type="text"
                        placeholder="مثال: دورة أمن الاتصالات وتأمين الشبكات"
                        value={item.name || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, courses: p.courses.map((it, i) => i === idx ? { ...it, name: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold"
                      />
                    </div>
                    <div className="flex gap-1 items-end">
                      <input
                        type="date"
                        value={item.date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setLists(p => ({ ...p, courses: p.courses.map((it, i) => i === idx ? { ...it, date: val } : it) }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setLists(p => ({ ...p, courses: p.courses.filter((_, i) => i !== idx) }))}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setLists(p => ({ ...p, courses: [...p.courses, { name: '', date: '' }] }))}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة دورة تخصصية</span>
                </button>
              </div>
            </div>
          </details>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 7: Allowances, Notes & Performance Evaluation        */}
          {/* ------------------------------------------------------------- */}
          <details className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden">
            <summary className="cursor-pointer bg-slate-100 hover:bg-slate-200/70 p-3.5 font-extrabold text-sm text-sky-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-800 text-white flex items-center justify-center text-xs">٧</span>
                <span>المخصصات المالية، تقييم الأداء والملاحظات</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </summary>

            <div className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">مخصصات المنصب</label>
                  <input
                    type="text"
                    placeholder="مثال: يوجد / 250,000 د.ع"
                    value={cols.AT || ''}
                    onChange={e => handleColChange('AT', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">مخصصات الشهادة الجامعية</label>
                  <input
                    type="text"
                    placeholder="مثال: ماجستير هندسة اتصالات 45%"
                    value={cols.AV || ''}
                    onChange={e => handleColChange('AV', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">مخصصات أخرى والخطورة</label>
                  <input
                    type="text"
                    placeholder="مخصصات خطورة، هندسية، قانونية..."
                    value={cols.AY || ''}
                    onChange={e => handleColChange('AY', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">الملاحظات الإدارية وتقييم الأداء السنوي</label>
                <textarea
                  rows={3}
                  value={cols.BH || ''}
                  onChange={e => handleColChange('BH', e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none text-xs focus:ring-2 focus:ring-sky-600"
                  placeholder="أية ملاحظات إدارية، مؤشرات تميز، تقييمات سنوية..."
                />
              </div>
            </div>
          </details>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              إلغاء الأمر
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'جارٍ الحفظ في SQLite...' : 'حفظ بيانات الموظف في السجل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
