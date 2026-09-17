export interface EmployeeCols {
  A?: string; // التسلسل
  B?: string; // الاسم الاول
  C?: string; // الاسم الثاني
  D?: string; // الاسم الثالث
  E?: string; // الاسم الرابع
  F?: string; // اللقب
  G?: string; // الرتبة
  H?: string; // العنوان الوظيفي
  I?: string; // الجنس
  J?: string; // الرقم الاحصائي
  K?: string; // المواليد - السنة
  L?: string; // الشهر
  M?: string; // اليوم
  N?: string; // رقم الهاتف
  O?: string; // امر التعيين
  P?: string; // تاريخه
  Q?: string; // التحصيل الدراسي
  R?: string; // الوكالة
  S?: string; // المديرية العامة او مايعادلها
  T?: string; // المديرية الفرعية
  U?: string; // القسم
  V?: string; // الشعبة
  W?: string; // تاريخ سنة اخر ترقية
  X?: string; // الشهر
  Y?: string; // اليوم
  Z?: string; // رقم الامر الاداري للترقية
  AA?: string; // تاريخ اخر علاوة
  AB?: string; // شهر
  AC?: string; // يوم
  AD?: string; // رقم الامر الاداري للعلاوة
  AE?: string; // التشكرات والقدمات
  AF?: string; // سنوات القدم والاشهر
  AG?: string; // رقم الامر الاداري للتشكرات والقدمات
  AH?: string; // تاريخها
  AI?: string; // نوع العقوبات
  AJ?: string; // تاريخ العقوبات
  AK?: string; // مقدار التاخير المترتب على العقوبات
  AL?: string; // رقم الامر الاداري للعقوبات
  AM?: string; // الاجازات
  AN?: string; // تاريخها
  AO?: string; // نوع الاجازة
  AP?: string; // تاريخ الترقية القادمة
  AQ?: string; // تاريخ العلاوة القادمة
  AR?: string; // الدورات التي شارك بها
  AS?: string; // تاريخ المشاركة في الدورات
  AT?: string; // مخصصات منصب
  AU?: string; // مقدار المخصصات
  AV?: string; // مخصصات الشهادة الجامعية
  AW?: string; // تاريخها
  AX?: string; // امر مخصصات الشهادة الجامعية
  AY?: string; // مخصصات اخرى
  AZ?: string; // رقم الامر الخاص بالمخصصات الاخرى
  BA?: string; // تاريخ منح المخصصات الاخرى
  BB?: string; // رقم الامر الاداري الخاص بها
  BC?: string; // محافظة السكن الحالي
  BD?: string; // محلة
  BE?: string; // زقاق
  BF?: string; // دار
  BG?: string; // ايميل
  BH?: string; // الملاحظات
  BI?: string; // المديريات السابقة المنقول منها

  // 1. المعلومات الشخصية الإضافية
  motherFirstName?: string; // اسم الأم الأول
  motherFatherName?: string; // اسم والد الأم
  motherGrandfatherName?: string; // اسم جد الأم أو لقبها
  motherFullName?: string; // اسم الأم الثلاثي مقطع
  religion?: string; // الديانة (قائمة منسدلة)
  ethnicity?: string; // القومية (قائمة منسدلة)
  maritalStatus?: string; // الحالة الزوجية (قائمة منسدلة)
  childrenCount?: string; // عدد الأطفال

  // 2. معلومات العمل الإضافية
  employmentType?: string; // نوع التوظيف (ضابط، موظف مدني، منتسب)
  position?: string; // المنصب (مدير مديرية، معاون مدير عام، مدير قسم...)
  positionOrderNumber?: string; // الأمر الإداري بالمنصب
  positionOrderDate?: string; // تاريخ الأمر الإداري بالمنصب
  careerEntryDate?: string; // تاريخ دخول المسلك

  // تفاصيل المديرية الحالية
  currAgency?: string; // الوكالة
  currDirectorateGeneral?: string; // المديرية العامة
  currDirectorateSub?: string; // المديرية الفرعية
  currDepartment?: string; // القسم
  currDivision?: string; // الشعبة

  // تفاصيل المديرية السابقة
  prevAgency?: string; // الوكالة
  prevDirectorateGeneral?: string; // المديرية العامة
  prevDirectorateSub?: string; // المديرية الفرعية
  prevDepartment?: string; // القسم
  prevDivision?: string; // الشعبة

  // تفاصيل المديرية قبل 9/4/2003
  pre2003Agency?: string; // الوكالة
  pre2003DirectorateGeneral?: string; // المديرية العامة
  pre2003DirectorateSub?: string; // المديرية الفرعية
  pre2003Department?: string; // القسم
  pre2003Division?: string; // الشعبة

  // الدورة العسكرية (للضباط والمنتسبين)
  militaryCoursePlace?: string; // مكان الدورة (المعهد العالي، كلية الشرطة، معهد إعداد المفوضين...)
  militaryCourseNumber?: string; // رقم الدورة
  militaryGraduationDate?: string; // تاريخ التخرج من الدورة

  // أمر الإعادة الصادر من الوكالة الإدارية
  reinstatementOrderNumber?: string; // رقم الأمر الإداري بإعادته إلى وزارة الداخلية
  reinstatementOrderDate?: string; // تاريخ الأمر الإداري بالإعادة

  [key: string]: string | undefined;
}

export interface RepeatableThanks {
  kind?: string;
  desc?: string;
  duration?: string;
  num?: string;
  date?: string;
}

export interface RepeatablePenalty {
  type?: string;
  amount?: string;
  num?: string;
  date?: string;
}

export interface RepeatableLeave {
  type?: string;
  duration?: string;
  date?: string;
}

export interface RepeatableCourse {
  name?: string;
  date?: string;
}

export interface RepeatableAllocation {
  post?: string;
  amount?: string;
  degree?: string;
  degDate?: string;
  degOrder?: string;
  other?: string;
  otherOrder?: string;
  otherDate?: string;
  adminOrder?: string;
}

export interface RepeatablePromotion {
  kind?: string;
  from?: string;
  to?: string;
  date?: string;
  num?: string;
  change?: string;
  amount?: string;
}

export interface RepeatableAllowance {
  kind?: string;
  date?: string;
  num?: string;
  change?: string;
  amount?: string;
  note?: string;
}

export interface RepeatablePrevDir {
  name?: string;
  num?: string;
  date?: string;
}

export interface EmployeeLists {
  thanks: RepeatableThanks[];
  penalties: RepeatablePenalty[];
  leaves: RepeatableLeave[];
  courses: RepeatableCourse[];
  allocations: RepeatableAllocation[];
  promotions: RepeatablePromotion[];
  allowances: RepeatableAllowance[];
  prevdirs: RepeatablePrevDir[];
}

export interface EmployeeAttachment {
  id: string;
  name: string;
  type: string;
  desc?: string;
  dataUrl: string;
  createdAt?: string;
}

export interface EmployeeRecord {
  id: string;
  cols: EmployeeCols;
  lists: EmployeeLists;
  photo?: string | null;
  files?: EmployeeAttachment[];
  createdAt?: string;
  updatedAt?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late' | 'mission';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  workHours?: number;
  notes?: string;
  recordedBy?: string;
  employeeName?: string;
  rank?: string;
  department?: string;
  statisticalId?: string;
  photo?: string | null;
}

export interface ManagerAlert {
  id: string;
  type: 'promotion_due' | 'allowance_due' | 'absent_today' | 'late_today' | 'leave_active' | 'penalty_delay';
  severity: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  employeeId: string;
  employeeName: string;
  statisticalId: string;
  rank: string;
  department: string;
  date: string;
  actionRequired?: string;
}
