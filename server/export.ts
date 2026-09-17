import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, BorderStyle, TextRun } from 'docx';
import { EmployeeRecord } from '../src/types.js';

export function exportEmployeesToExcel(employees: EmployeeRecord[], singleEmployee = false): Buffer {
  const wb = XLSX.utils.book_new();

  if (singleEmployee && employees.length === 1) {
    const emp = employees[0];
    const c = emp.cols;
    const motherName = c.motherFullName || [c.motherFirstName, c.motherFatherName, c.motherGrandfatherName].filter(Boolean).join(' ') || '—';

    // Sheet 1: Personal & Appointment Data
    const personalData = [
      ["جمهورية العراق - وزارة الداخلية - مديرية التدريب والتأهيل"],
      ["قسم الاتصالات والمعلوماتية - خلاصة خط الخدمة الرسمية والسيرة الوظيفية"],
      [],
      ["الحقل الإداري", "البيان والمعلومات الرسمية"],
      ["التسلسل", c.A || "—"],
      ["الاسم الكامل", `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.trim() || "—"],
      ["اسم الأم الثلاثي (مقطع)", motherName],
      ["اسم الأم الأول", c.motherFirstName || "—"],
      ["اسم والد الأم", c.motherFatherName || "—"],
      ["اسم جد الأم / اللقب", c.motherGrandfatherName || "—"],
      ["الجنس", c.I || "—"],
      ["المواليد", `${c.K || ''}/${c.L || ''}/${c.M || ''}`],
      ["التحصيل الدراسي", c.Q || "—"],
      ["الديانة", c.religion || "—"],
      ["القومية", c.ethnicity || "—"],
      ["الحالة الزوجية", c.maritalStatus || "—"],
      ["عدد الأطفال", c.childrenCount ?? "0"],
      ["محافظة السكن", c.BC || "—"],
      ["العنوان التفصيلي", `محلة: ${c.BD || '—'} / زقاق: ${c.BE || '—'} / دار: ${c.BF || '—'}`],
      ["رقم الهاتف", c.N || "—"],
      ["البريد الإلكتروني", c.BG || "—"],
      [],
      ["معلومات العمل والخدمة", ""],
      ["الرقم الإحصائي", c.J || "—"],
      ["نوع التوظيف", c.employmentType || "—"],
      ["الرتبة / الدرجة الوظيفية", c.G || "—"],
      ["العنوان الوظيفي", c.H || "—"],
      ["المنصب", c.position || "—"],
      ["رقم الأمر الإداري بالمنصب", c.positionOrderNumber || "—"],
      ["تاريخ الأمر الإداري بالمنصب", c.positionOrderDate || "—"],
      ["تاريخ دخول المسلك", c.careerEntryDate || "—"],
      ["رقم أمر التعيين وتاريخه", `${c.O || '—'} بتاريخ ${c.P || '—'}`],
      ["أمر الإعادة إلى وزارة الداخلية (الوكالة الإدارية)", c.reinstatementOrderNumber ? `${c.reinstatementOrderNumber} بتاريخ ${c.reinstatementOrderDate || '—'}` : "—"],
      ["مكان الدورة العسكرية", c.militaryCoursePlace || "—"],
      ["رقم الدورة العسكرية", c.militaryCourseNumber || "—"],
      ["تاريخ التخرج من الدورة", c.militaryGraduationDate || "—"],
      ["تاريخ الترقية القادمة (مؤشر التنبيه)", c.AP || "—"],
      ["تاريخ العلاوة القادمة (مؤشر التنبيه)", c.AQ || "—"],
      ["ملاحظات إدارية وتقييم أداء", c.BH || "—"]
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(personalData);
    ws1['!cols'] = [{ wch: 35 }, { wch: 65 }];
    XLSX.utils.book_append_sheet(wb, ws1, "المعلومات الشخصية والوظيفية");

    // Sheet 2: Directorates Hierarchy (الحالية، السابقة، قبل 2003)
    const dirData = [
      ["المستوى الإداري", "المديرية الحالية", "المديرية السابقة", "المديرية قبل 2003/4/9"],
      ["الوكالة", c.currAgency || c.R || "—", c.prevAgency || "—", c.pre2003Agency || "—"],
      ["المديرية العامة", c.currDirectorateGeneral || c.S || "—", c.prevDirectorateGeneral || "—", c.pre2003DirectorateGeneral || "—"],
      ["المديرية الفرعية", c.currDirectorateSub || c.T || "—", c.prevDirectorateSub || "—", c.pre2003DirectorateSub || "—"],
      ["القسم", c.currDepartment || c.U || "—", c.prevDepartment || "—", c.pre2003Department || "—"],
      ["الشعبة", c.currDivision || c.V || "—", c.prevDivision || "—", c.pre2003Division || "—"],
      [],
      ["أوامر النقل الإضافية المسجلة", "", "", ""],
      ["#", "اسم المديرية / الجهة المنقول منها", "رقم أمر النقل", "تاريخ أمر النقل"]
    ];
    (emp.lists.prevdirs || []).forEach((d, idx) => {
      dirData.push([(idx + 1).toString(), d.name || "—", d.num || "—", d.date || "—"]);
    });
    const wsDir = XLSX.utils.aoa_to_sheet(dirData);
    wsDir['!cols'] = [{ wch: 25 }, { wch: 35 }, { wch: 35 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsDir, "سجل المديريات");

    // Sheet 3: Promotions with kind and ranks
    const promData: any[][] = [["نوع الحركة", "من رتبة / درجة", "إلى رتبة / درجة", "تاريخ الترقية", "رقم الأمر الإداري", "المقدار / التغيير"]];
    (emp.lists.promotions || []).forEach(p => {
      promData.push([p.kind || 'ترقية اعتيادية', p.from || '—', p.to || '—', p.date || '—', p.num || '—', p.amount || p.change || '—']);
    });
    const wsProm = XLSX.utils.aoa_to_sheet(promData);
    wsProm['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsProm, "الترقيات والعلاوات");

    // Sheet 4: Thanks & Penalties
    const thanksData: any[][] = [["النوع", "البيان / الوصف", "سنوات/مدة القدم", "رقم الأمر الإداري", "التاريخ"]];
    (emp.lists.thanks || []).forEach(t => {
      thanksData.push([t.kind || '—', t.desc || '—', t.duration || '—', t.num || '—', t.date || '—']);
    });
    const wsThanks = XLSX.utils.aoa_to_sheet(thanksData);
    XLSX.utils.book_append_sheet(wb, wsThanks, "التشكرات والقدمات");

    const penData: any[][] = [["نوع العقوبة", "مقدار التأخير المترتب", "رقم الأمر الإداري", "التاريخ"]];
    (emp.lists.penalties || []).forEach(p => {
      penData.push([p.type || '—', p.amount || '—', p.num || '—', p.date || '—']);
    });
    const wsPen = XLSX.utils.aoa_to_sheet(penData);
    XLSX.utils.book_append_sheet(wb, wsPen, "العقوبات");

    // Sheet 5: Leaves & Courses
    const leaveData: any[][] = [["نوع الإجازة", "المدة", "التاريخ"]];
    (emp.lists.leaves || []).forEach(l => {
      leaveData.push([l.type || '—', l.duration || '—', l.date || '—']);
    });
    const wsLeave = XLSX.utils.aoa_to_sheet(leaveData);
    XLSX.utils.book_append_sheet(wb, wsLeave, "الإجازات والدورات");

  } else {
    // Export general table for all employees
    const headers = [
      "التسلسل", "الاسم الكامل", "اسم الأم الثلاثي", "نوع التوظيف", "الرتبة / الدرجة", 
      "العنوان الوظيفي", "المنصب", "أمر المنصب", "الرقم الإحصائي", "المواليد", "التحصيل الدراسي", 
      "الديانة", "القومية", "الحالة الزوجية", "محافظة السكن", "الوكالة الحالية", "المديرية العامة", 
      "القسم", "الشعبة", "تاريخ دخول المسلك", "الترقية القادمة", "العلاوة القادمة", "الهاتف", 
      "عدد التشكرات", "عدد العقوبات", "ملاحظات"
    ];

    const rows: any[][] = [headers];
    employees.forEach(emp => {
      const c = emp.cols;
      const fullName = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.trim();
      const motherName = c.motherFullName || [c.motherFirstName, c.motherFatherName, c.motherGrandfatherName].filter(Boolean).join(' ') || '—';
      const birth = `${c.K || ''}-${c.L || ''}-${c.M || ''}`;
      rows.push([
        c.A || '—',
        fullName || '—',
        motherName,
        c.employmentType || '—',
        c.G || '—',
        c.H || '—',
        c.position || '—',
        c.positionOrderNumber ? `${c.positionOrderNumber} (${c.positionOrderDate || ''})` : '—',
        c.J || '—',
        birth !== '--' ? birth : '—',
        c.Q || '—',
        c.religion || '—',
        c.ethnicity || '—',
        c.maritalStatus || '—',
        c.BC || '—',
        c.currAgency || c.R || '—',
        c.currDirectorateGeneral || c.S || '—',
        c.currDepartment || c.U || '—',
        c.currDivision || c.V || '—',
        c.careerEntryDate || '—',
        c.AP || '—',
        c.AQ || '—',
        c.N || '—',
        emp.lists.thanks?.length || 0,
        emp.lists.penalties?.length || 0,
        c.BH || ''
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = headers.map(() => ({ wch: 22 }));
    XLSX.utils.book_append_sheet(wb, ws, "خط الخدمة لجميع الموظفين");
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export async function exportEmployeeToWord(emp: EmployeeRecord): Promise<Buffer> {
  const c = emp.cols;
  const fullName = `${c.B || ''} ${c.C || ''} ${c.D || ''} ${c.E || ''} ${c.F || ''}`.trim() || 'غير محدد';
  const motherName = c.motherFullName || [c.motherFirstName, c.motherFatherName, c.motherGrandfatherName].filter(Boolean).join(' ') || 'غير محدد';
  const birthDate = `${c.K || ''}/${c.L || ''}/${c.M || ''}`;

  function createCell(text: string, bold = false, isHeader = false) {
    return new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text,
              bold: bold || isHeader,
              font: 'Calibri',
              size: isHeader ? 22 : 20,
              color: isHeader ? '0B4F8A' : '1C2B3A'
            })
          ]
        })
      ]
    });
  }

  function createHeaderRow(col1: string, col2: string) {
    return new TableRow({
      children: [createCell(col1, true, true), createCell(col2, true, true)]
    });
  }

  function createDataRow(label: string, val: string) {
    return new TableRow({
      children: [createCell(label, true), createCell(val || '—')]
    });
  }

  // Build basic info table
  const infoRows = [
    createHeaderRow("الحقل الإداري", "بيانات الموظف الرسمية"),
    createDataRow("الرقم الإحصائي", c.J || '—'),
    createDataRow("الاسم الكامل", fullName),
    createDataRow("اسم الأم الثلاثي مقطع", motherName),
    createDataRow("الجنس والمواليد", `${c.I || '—'} / ${birthDate !== '//' ? birthDate : '—'}`),
    createDataRow("التحصيل الدراسي", c.Q || '—'),
    createDataRow("الديانة والقومية", `${c.religion || '—'} / ${c.ethnicity || '—'}`),
    createDataRow("الحالة الزوجية وعدد الأطفال", `${c.maritalStatus || '—'} (أطفال: ${c.childrenCount ?? '0'})`),
    createDataRow("نوع التوظيف", c.employmentType || '—'),
    createDataRow("الرتبة / الدرجة الوظيفية", c.G || '—'),
    createDataRow("العنوان الوظيفي", c.H || '—'),
    createDataRow("المنصب الإداري", c.position || '—'),
    createDataRow("أمر المنصب وتاريخه", `${c.positionOrderNumber || '—'} بتاريخ ${c.positionOrderDate || '—'}`),
    createDataRow("تاريخ دخول المسلك", c.careerEntryDate || '—'),
    createDataRow("أمر التعيين وتاريخه", `${c.O || '—'} بتاريخ ${c.P || '—'}`),
    createDataRow("أمر الإعادة (الوكالة الإدارية)", c.reinstatementOrderNumber ? `${c.reinstatementOrderNumber} بتاريخ ${c.reinstatementOrderDate || '—'}` : '—'),
    createDataRow("بيانات الدورة العسكرية", `${c.militaryCoursePlace || '—'} | دورة: ${c.militaryCourseNumber || '—'} | تخرج: ${c.militaryGraduationDate || '—'}`),
    createDataRow("الوكالة الحالية", c.currAgency || c.R || '—'),
    createDataRow("المديرية العامة الحالية", c.currDirectorateGeneral || c.S || '—'),
    createDataRow("القسم والشعبة", `${c.currDepartment || c.U || '—'} / ${c.currDivision || c.V || '—'}`),
    createDataRow("المديرية السابقة", `${c.prevAgency || ''} - ${c.prevDirectorateGeneral || ''} - ${c.prevDepartment || ''}`),
    createDataRow("المديرية قبل 2003/4/9", `${c.pre2003Agency || ''} - ${c.pre2003DirectorateGeneral || ''} - ${c.pre2003Department || ''}`),
    createDataRow("تاريخ الترقية القادمة", c.AP || '—'),
    createDataRow("تاريخ العلاوة القادمة", c.AQ || '—'),
    createDataRow("محافظة السكن", c.BC || '—'),
    createDataRow("العنوان السكني المفصل", `محلة: ${c.BD || '—'} / زقاق: ${c.BE || '—'} / دار: ${c.BF || '—'}`),
    createDataRow("الهاتف والبريد", `${c.N || '—'} / ${c.BG || '—'}`),
    createDataRow("الملاحظات الإدارية", c.BH || '—')
  ];

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: infoRows
  });

  // Section: Promotions
  const promRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "نوع الحركة", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "من رتبة", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "إلى رتبة", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "رقم الأمر / التاريخ", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "المقدار", bold: true })] })] })
      ]
    })
  ];
  (emp.lists.promotions || []).forEach(p => {
    promRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(p.kind || 'ترقية اعتيادية')] }),
        new TableCell({ children: [new Paragraph(p.from || '—')] }),
        new TableCell({ children: [new Paragraph(p.to || '—')] }),
        new TableCell({ children: [new Paragraph(`${p.num || '—'} / ${p.date || '—'}`)] }),
        new TableCell({ children: [new Paragraph(p.amount || p.change || '—')] })
      ]
    }));
  });

  // Section: Commendations & Seniority
  const thanksRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "النوع", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "البيان والجهة المانحة", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "القدم", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "رقم الأمر / التاريخ", bold: true })] })] })
      ]
    })
  ];
  (emp.lists.thanks || []).forEach(t => {
    thanksRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(t.kind || '—')] }),
        new TableCell({ children: [new Paragraph(t.desc || '—')] }),
        new TableCell({ children: [new Paragraph(t.duration || '—')] }),
        new TableCell({ children: [new Paragraph(`${t.num || '—'} / ${t.date || '—'}`)] })
      ]
    }));
  });

  // Section: Penalties
  const penRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "نوع العقوبة", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "مقدار التأخير المترتب", bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "رقم الأمر / التاريخ", bold: true })] })] })
      ]
    })
  ];
  (emp.lists.penalties || []).forEach(p => {
    penRows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(p.type || '—')] }),
        new TableCell({ children: [new Paragraph(p.amount || '—')] }),
        new TableCell({ children: [new Paragraph(`${p.num || '—'} / ${p.date || '—'}`)] })
      ]
    }));
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "جمهورية العراق - وزارة الداخلية",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: "مديرية التدريب والتأهيل - قسم الاتصالات والمعلوماتية",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: `وثيقة خط الخدمة والسجل الوظيفي: ${fullName} (${c.employmentType || 'موظف'} / ${c.G || 'رتبة غير محددة'})`,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({ text: `تاريخ التصدير: ${new Date().toLocaleDateString('ar-IQ')}`, alignment: AlignmentType.LEFT }),
        new Paragraph({ text: " " }),
        infoTable,
        new Paragraph({ text: " " }),
        new Paragraph({ text: "سجل الترقيات السابقة:", heading: HeadingLevel.HEADING_3 }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: promRows }),
        new Paragraph({ text: " " }),
        new Paragraph({ text: "سجل التشكرات والقدمات الإدارية:", heading: HeadingLevel.HEADING_3 }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: thanksRows }),
        new Paragraph({ text: " " }),
        new Paragraph({ text: "سجل العقوبات والتأخيرات:", heading: HeadingLevel.HEADING_3 }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: penRows }),
        new Paragraph({ text: " " }),
        new Paragraph({
          text: "مصادقة مدير قسم الاتصالات والمعلوماتية: ............................................      التوقيع والختم الرسمي: ............................",
          alignment: AlignmentType.RIGHT
        })
      ]
    }]
  });

  return await Packer.toBuffer(doc);
}
