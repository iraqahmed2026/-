import fs from 'fs';
import path from 'path';
import initSqlJs, { Database } from 'sql.js';
import { EmployeeRecord, AttendanceRecord, ManagerAlert } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'service_records.sqlite');

let dbInstance: Database | null = null;

// Initial 33 seed records from the user prompt
const SEED_DATA = [
  {
    "_id": "seed1",
    "cols": {
      "A": "1",
      "B": "ضرغام",
      "C": "حسين",
      "D": "علي",
      "E": "حيدر",
      "F": "القاري",
      "G": "فريق",
      "H": "معاون رئيس مهندسين",
      "I": "ذكر",
      "J": "871980188",
      "K": "1987",
      "L": "10",
      "M": "12",
      "N": "07806969379",
      "O": "1339",
      "P": "2010-01-31",
      "Q": "استاذية",
      "R": "الدوائر المرتبطة بمكتب الوزير",
      "S": "مديرية التدريب والتاهيل",
      "T": "مديرية الادارية والمالية",
      "U": "قسم الاتصالات والمعلوماتية",
      "V": "شعبة الاتصالات",
      "W": "2020-01-01",
      "X": "01",
      "Y": "01",
      "Z": "1420",
      "AA": "2023-01-01",
      "AB": "01",
      "AC": "01",
      "AD": "1214",
      "AE": "قدم رئيس الوزراء",
      "AF": "6 اشهر",
      "AG": "15248",
      "AH": "2011-09-08",
      "AI": "غياب",
      "AJ": "2012-06-03",
      "AK": "3 اشهر",
      "AL": "14884",
      "AM": "3 اشهر",
      "AN": "2013-04-08",
      "AO": "اعتيادية بدون راتب",
      "AP": "2026-10-15", // upcoming promotion!
      "AQ": "2026-11-01", // upcoming allowance!
      "AR": "دورة أمن الاتصالات وتأمين الشبكات",
      "AS": "2019-05-10",
      "AT": "يوجد",
      "AU": "250000",
      "AV": "ماجستير هندسة اتصالات",
      "AW": "2015-06-30",
      "AX": "189898",
      "AY": "مخصصات هندسية وخطورة",
      "AZ": "198799",
      "BA": "2010-01-05",
      "BB": "18787878",
      "BC": "بغداد",
      "BD": "حي الجامعة",
      "BE": "14",
      "BF": "8",
      "BG": "dhirghamhusain@gmail.com",
      "BH": "كفاءة عالية ومتميز في إدارة منظومة الاتصالات السلكية واللاسلكية"
    },
    "lists": {
      "thanks": [
        { "kind": "شكر", "desc": "شكر وتقدير من السيد وزير الداخلية للجهود الاستثنائية", "duration": "قدم شهر واحد", "num": "15248", "date": "2011-09-08" },
        { "kind": "قدم", "desc": "قدم رئيس الوزراء لإنجاز مشروع شبكة الاتصالات المؤمنة", "duration": "6 اشهر", "num": "9921", "date": "2018-04-12" }
      ],
      "penalties": [
        { "type": "لفت نظر", "amount": "تأخير شهر واحد", "num": "14884", "date": "2012-06-03" }
      ],
      "leaves": [
        { "type": "إجازة اعتيادية", "duration": "3 اشهر", "date": "2013-04-08" }
      ],
      "courses": [
        { "name": "دورة أمن الاتصالات وتأمين الشبكات", "date": "2019-05-10" },
        { "name": "دورة القيادة الإدارية العليا لضباط الداخلية", "date": "2022-09-01" }
      ],
      "allocations": [
        { "post": "معاون رئيس مهندسين", "amount": "250,000 د.ع", "degree": "ماجستير هندسة اتصالات", "degDate": "2015-06-30", "degOrder": "189898", "other": "مخصصات هندسية 35%", "otherOrder": "198799", "otherDate": "2010-01-05", "adminOrder": "18787878" }
      ],
      "promotions": [
        { "kind": "ترقية", "from": "عميد", "to": "لواء", "date": "2016-07-14", "num": "8432", "change": "زيادة", "amount": "درجة ورتبة" },
        { "kind": "ترقية", "from": "لواء", "to": "فريق", "date": "2020-01-01", "num": "1420", "change": "زيادة", "amount": "استحقاق جدول كانون" }
      ],
      "allowances": [
        { "kind": "علاوة سنوية", "date": "2023-01-01", "num": "1214", "change": "زيادة", "amount": "علاوة سنوية مستحقة", "note": "مستوف للشروط" }
      ],
      "prevdirs": [
        { "name": "مديرية الاتصالات السلكية واللاسلكية", "num": "4421", "date": "2012-03-15" }
      ]
    }
  },
  { "_id": "seed2", "cols": { "A": "2", "B": "محمد", "C": "صادق", "D": "كاظم", "G": "لواء", "H": "ضابط", "I": "ذكر", "J": "852910332", "Q": "دكتوراه", "R": "وكالة الوزارة للشؤون الادارية والمالية", "S": "مديرية التدريب والتاهيل", "U": "قسم الإدارة", "BC": "اربيل", "AP": "2026-11-20", "AQ": "2026-10-01" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed3", "cols": { "A": "3", "B": "علي", "C": "فاضل", "D": "عباس", "G": "عميد", "H": "منتسب", "I": "ذكر", "J": "764920119", "Q": "ماجستير", "R": "وكالة الوزارة لشؤون الشرطة", "S": "مديرية شرطة بغداد", "U": "قسم النجدة", "BC": "الانبار", "AP": "2026-09-30", "AQ": "2027-01-01" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed4", "cols": { "A": "4", "B": "حسام", "C": "رياض", "D": "مجيد", "G": "عقيد", "H": "عقد", "I": "ذكر", "J": "781029384", "Q": "دبلوم عالي", "R": "وكالة الوزارة لشؤون الامن الاتحادي", "BC": "البصرة", "AP": "2027-01-14" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed5", "cols": { "A": "5", "B": "زينب", "C": "عبد الكريم", "D": "جواد", "G": "مقدم", "H": "ضابط حقوقي", "I": "انثى", "J": "893019283", "Q": "بكالوريوس", "R": "وكالة الوزارة لشؤون الاستخبارات والتحقيقات الاتحادية", "BC": "السليمانية", "AQ": "2026-09-25" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed6", "cols": { "A": "6", "B": "أحمد", "C": "صباح", "D": "نوري", "G": "رائد", "H": "ضابط اتصالات", "I": "ذكر", "J": "902194821", "Q": "دبلوم", "R": "خارج ملاك وزارة الداخلية", "BC": "القادسية" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed7", "cols": { "A": "7", "B": "ياسر", "C": "منعم", "D": "راضي", "G": "نقيب", "H": "مهندس حاسبات", "I": "ذكر", "J": "912049281", "Q": "اعدادية", "R": "وكالة الوزارة للشؤون الادارية والمالية", "BC": "المثنى", "AP": "2026-10-01" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed8", "cols": { "A": "8", "B": "كرار", "C": "حيدر", "D": "فالح", "G": "ملازم اول", "H": "ضابط خفر", "I": "ذكر", "J": "934019281", "Q": "كلية الشرطة", "BC": "النجف الاشرف" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed9", "cols": { "A": "9", "B": "مصطفى", "C": "سعدون", "D": "محمود", "G": "ملازم", "H": "ضابط دورية", "I": "ذكر", "J": "951029381", "Q": "كلية الشرطة", "BC": "بابل" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed10", "cols": { "A": "10", "B": "طارق", "C": "عدنان", "D": "خضير", "G": "مفوض1", "H": "مسؤول مشجب", "I": "ذكر", "J": "801928371", "Q": "اعدادية", "BC": "دهوك" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed11", "cols": { "A": "11", "B": "ماجد", "C": "شريف", "D": "سالم", "G": "مفوض2", "H": "مراقب كاميرات", "I": "ذكر", "J": "812039182", "BC": "ديالى" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed12", "cols": { "A": "12", "B": "عمر", "C": "عبد الخالق", "D": "حمد", "G": "مفوض3", "H": "كاتب قلم", "I": "ذكر", "J": "823910291", "BC": "ذي قار" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed13", "cols": { "A": "13", "B": "خالد", "C": "وليد", "D": "حميد", "G": "مفوض4", "H": "مبرمج", "I": "ذكر", "J": "834019281", "BC": "صلاح الدين" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed14", "cols": { "A": "14", "B": "جعفر", "C": "صادق", "D": "مهدي", "G": "مفوض5", "H": "فني اجهزة", "I": "ذكر", "J": "845019281", "BC": "كربلاء المقدسة" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed15", "cols": { "A": "15", "B": "هيثم", "C": "جميل", "D": "مظهر", "G": "مفوض6", "H": "سائق الية", "I": "ذكر", "J": "856019281", "BC": "كركوك" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed16", "cols": { "A": "16", "B": "سامر", "C": "رزاق", "D": "نعمة", "G": "مفوض7", "H": "حرس بوابة", "I": "ذكر", "J": "867019281", "BC": "ميسان" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed17", "cols": { "A": "17", "B": "فراس", "C": "ناجي", "D": "حمود", "G": "مفوض8", "H": "مسؤول بدالة", "I": "ذكر", "J": "878019281", "BC": "نينوى" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed18", "cols": { "A": "18", "B": "عادل", "C": "طالب", "D": "جاسم", "G": "رئيس عرفاء", "H": "انضباط", "I": "ذكر", "J": "889019281", "BC": "واسط" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed19", "cols": { "A": "19", "B": "حازم", "C": "سلطان", "D": "مراد", "G": "عريف", "H": "استعلامات", "I": "ذكر", "J": "890129381", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed20", "cols": { "A": "20", "B": "بلال", "C": "منذر", "D": "توفيق", "G": "نائب عريف", "H": "حماية منشآت", "I": "ذكر", "J": "901239481", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed21", "cols": { "A": "21", "B": "وسام", "C": "غانم", "D": "شاكر", "G": "شرطي اول", "H": "حماية موقعية", "I": "ذكر", "J": "912349581", "BC": "بابل" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed22", "cols": { "A": "22", "B": "عمار", "C": "فخري", "D": "رشيد", "G": "شرطي", "H": "حراسة أمنية", "I": "ذكر", "J": "923459681", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed23", "cols": { "A": "23", "B": "منى", "C": "صبحي", "D": "عبد الله", "G": "موظف1", "H": "مدير أقدم", "I": "انثى", "J": "751928371", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed24", "cols": { "A": "24", "B": "رنا", "C": "طارق", "D": "عصام", "G": "موظف2", "H": "رئيس ملاحظين", "I": "انثى", "J": "782910291", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed25", "cols": { "A": "25", "B": "إحسان", "C": "كمال", "D": "أنور", "G": "موظف3", "H": "ملاحظ", "I": "ذكر", "J": "812930192", "BC": "النجف الاشرف" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed26", "cols": { "A": "26", "B": "أزهار", "C": "موسى", "D": "يعقوب", "G": "موظف4", "H": "معاون ملاحظ", "I": "انثى", "J": "843910291", "BC": "كربلاء المقدسة" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed27", "cols": { "A": "27", "B": "سلام", "C": "جعفر", "D": "محسن", "G": "موظف5", "H": "كاتب طابعة", "I": "ذكر", "J": "864920192", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed28", "cols": { "A": "28", "B": "سهى", "C": "سالم", "D": "إبراهيم", "G": "موظف6", "H": "معاون كاتب", "I": "انثى", "J": "895019283", "BC": "بغداد" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed29", "cols": { "A": "29", "B": "نوار", "C": "فاضل", "D": "فاروق", "G": "موظف7", "H": "مدقق حسابات", "I": "ذكر", "J": "916029384", "BC": "البصرة" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed30", "cols": { "A": "30", "B": "سماح", "C": "سليم", "D": "جمال", "G": "موظف8", "H": "أمين مخزن", "I": "انثى", "J": "937102938", "BC": "ديالى" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed31", "cols": { "A": "31", "B": "برزان", "C": "هادي", "D": "رمضان", "G": "موظف9", "H": "فني تبريد", "I": "ذكر", "J": "958201928", "BC": "كركوك" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed32", "cols": { "A": "32", "B": "حيدر", "C": "باقر", "D": "سعد", "G": "موظف10", "H": "حرفي", "I": "ذكر", "J": "979301928", "BC": "ذي قار" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } },
  { "_id": "seed33", "cols": { "A": "33", "B": "مقداد", "C": "جبار", "D": "حسون", "G": "عقد", "H": "عقد تشغيلي", "I": "ذكر", "J": "990410293", "BC": "واسط" }, "lists": { "thanks": [], "penalties": [], "leaves": [], "courses": [], "allocations": [], "promotions": [], "allowances": [], "prevdirs": [] } }
];

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      initTables(dbInstance);
      return dbInstance;
    } catch (e) {
      console.error('Failed to load existing SQLite database, creating new:', e);
    }
  }

  dbInstance = new SQL.Database();
  initTables(dbInstance);
  seedInitialData(dbInstance);
  saveDb(dbInstance);
  return dbInstance;
}

function initTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      serial INTEGER,
      first_name TEXT,
      second_name TEXT,
      third_name TEXT,
      fourth_name TEXT,
      surname TEXT,
      rank TEXT,
      job_title TEXT,
      gender TEXT,
      statistical_id TEXT UNIQUE,
      birth_year TEXT,
      birth_month TEXT,
      birth_day TEXT,
      phone TEXT,
      email TEXT,
      appointment_order TEXT,
      appointment_date TEXT,
      qualification TEXT,
      agency TEXT,
      directorate_general TEXT,
      directorate_sub TEXT,
      department TEXT,
      division TEXT,
      next_promotion_date TEXT,
      next_allowance_date TEXT,
      province TEXT,
      mahalla TEXT,
      zuqaq TEXT,
      dar TEXT,
      notes TEXT,
      photo TEXT,
      raw_cols TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS employee_lists (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      list_type TEXT NOT NULL,
      data TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS employee_attachments (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      desc TEXT,
      data_url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      check_in_time TEXT,
      check_out_time TEXT,
      work_hours REAL DEFAULT 0,
      notes TEXT,
      recorded_by TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(employee_id, date),
      FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);
}

export function saveDb(db = dbInstance) {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

function seedInitialData(db: Database) {
  // Check if employees already exist
  const res = db.exec("SELECT COUNT(*) FROM employees");
  const count = res[0]?.values[0]?.[0] as number;
  if (count > 0) return;

  // Insert default admin password (1234 hash)
  // sha256 of '1234' = 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4
  db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4')");

  for (const s of SEED_DATA) {
    const cols = s.cols as Record<string, string>;
    const serial = parseInt(cols.A || '0', 10);
    const id = s._id;
    const stmt = db.prepare(`
      INSERT INTO employees (
        id, serial, first_name, second_name, third_name, fourth_name, surname,
        rank, job_title, gender, statistical_id, birth_year, birth_month, birth_day,
        phone, email, appointment_order, appointment_date, qualification,
        agency, directorate_general, directorate_sub, department, division,
        next_promotion_date, next_allowance_date, province, mahalla, zuqaq, dar,
        notes, raw_cols
      ) VALUES (
        $id, $serial, $first_name, $second_name, $third_name, $fourth_name, $surname,
        $rank, $job_title, $gender, $statistical_id, $birth_year, $birth_month, $birth_day,
        $phone, $email, $appointment_order, $appointment_date, $qualification,
        $agency, $directorate_general, $directorate_sub, $department, $division,
        $next_promotion_date, $next_allowance_date, $province, $mahalla, $zuqaq, $dar,
        $notes, $raw_cols
      )
    `);

    stmt.run({
      $id: id,
      $serial: serial,
      $first_name: cols.B || '',
      $second_name: cols.C || '',
      $third_name: cols.D || '',
      $fourth_name: cols.E || '',
      $surname: cols.F || '',
      $rank: cols.G || '',
      $job_title: cols.H || '',
      $gender: cols.I || '',
      $statistical_id: cols.J || ('stat_' + serial),
      $birth_year: cols.K || '',
      $birth_month: cols.L || '',
      $birth_day: cols.M || '',
      $phone: cols.N || '',
      $email: cols.BG || '',
      $appointment_order: cols.O || '',
      $appointment_date: cols.P || '',
      $qualification: cols.Q || '',
      $agency: cols.R || '',
      $directorate_general: cols.S || '',
      $directorate_sub: cols.T || '',
      $department: cols.U || '',
      $division: cols.V || '',
      $next_promotion_date: cols.AP || '',
      $next_allowance_date: cols.AQ || '',
      $province: cols.BC || '',
      $mahalla: cols.BD || '',
      $zuqaq: cols.BE || '',
      $dar: cols.BF || '',
      $notes: cols.BH || '',
      $raw_cols: JSON.stringify(cols)
    });
    stmt.free();

    // Insert lists
    if (s.lists) {
      for (const [listType, items] of Object.entries(s.lists)) {
        if (!Array.isArray(items)) continue;
        let order = 0;
        for (const item of items) {
          db.run(
            "INSERT INTO employee_lists (id, employee_id, list_type, data, sort_order) VALUES (?, ?, ?, ?, ?)",
            [`${id}_${listType}_${order}`, id, listType, JSON.stringify(item), order]
          );
          order++;
        }
      }
    }
  }

  // Seed sample attendance for today
  const today = new Date().toISOString().split('T')[0];
  const sampleStatuses: { [id: string]: { status: string; checkIn?: string; checkOut?: string; hours?: number; notes?: string } } = {
    seed1: { status: 'present', checkIn: '07:45', checkOut: '14:30', hours: 6.75, notes: 'حاضر بالموعد - جدول المقابلات الإدارية' },
    seed2: { status: 'present', checkIn: '08:00', checkOut: '14:15', hours: 6.25 },
    seed3: { status: 'mission', checkIn: '08:30', notes: 'إيفاد رسمي لدعم المقر العام' },
    seed4: { status: 'late', checkIn: '09:15', notes: 'تأخير بعذر مروري' },
    seed5: { status: 'leave', notes: 'إجازة اعتيادية براتب تام' },
    seed6: { status: 'absent', notes: 'غياب غير مبرر حتى اللحظة' }
  };

  for (const [empId, att] of Object.entries(sampleStatuses)) {
    db.run(`
      INSERT OR REPLACE INTO attendance (id, employee_id, date, status, check_in_time, check_out_time, work_hours, notes, recorded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      `${empId}_${today}`,
      empId,
      today,
      att.status,
      att.checkIn || null,
      att.checkOut || null,
      att.hours || 0,
      att.notes || '',
      'قسم الاتصالات والمعلوماتية'
    ]);
  }
}

export async function getAllEmployees(searchQuery = '', department = '', rank = '', province = ''): Promise<EmployeeRecord[]> {
  const db = await getDb();
  let sql = `SELECT * FROM employees WHERE 1=1 `;
  const params: any[] = [];

  if (searchQuery) {
    sql += ` AND (
      first_name LIKE ? OR second_name LIKE ? OR third_name LIKE ? OR
      surname LIKE ? OR statistical_id LIKE ? OR rank LIKE ? OR
      job_title LIKE ? OR phone LIKE ? OR department LIKE ?
    ) `;
    const q = `%${searchQuery}%`;
    params.push(q, q, q, q, q, q, q, q, q);
  }
  if (department) {
    sql += ` AND department = ? `;
    params.push(department);
  }
  if (rank) {
    sql += ` AND rank = ? `;
    params.push(rank);
  }
  if (province) {
    sql += ` AND province = ? `;
    params.push(province);
  }

  sql += ` ORDER BY serial ASC, first_name ASC `;

  const stmt = db.prepare(sql);
  stmt.bind(params);

  const employees: EmployeeRecord[] = [];

  while (stmt.step()) {
    const row = stmt.getAsObject();
    const id = row.id as string;

    let cols: Record<string, string> = {};
    try {
      cols = JSON.parse(row.raw_cols as string || '{}');
    } catch {
      cols = {};
    }

    // Ensure vital columns match table fields
    cols.A = String(row.serial || '');
    cols.B = (row.first_name as string) || '';
    cols.C = (row.second_name as string) || '';
    cols.D = (row.third_name as string) || '';
    cols.E = (row.fourth_name as string) || '';
    cols.F = (row.surname as string) || '';
    cols.G = (row.rank as string) || '';
    cols.H = (row.job_title as string) || '';
    cols.I = (row.gender as string) || '';
    cols.J = (row.statistical_id as string) || '';
    cols.K = (row.birth_year as string) || '';
    cols.L = (row.birth_month as string) || '';
    cols.M = (row.birth_day as string) || '';
    cols.N = (row.phone as string) || '';
    cols.O = (row.appointment_order as string) || '';
    cols.P = (row.appointment_date as string) || '';
    cols.Q = (row.qualification as string) || '';
    cols.R = (row.agency as string) || '';
    cols.S = (row.directorate_general as string) || '';
    cols.T = (row.directorate_sub as string) || '';
    cols.U = (row.department as string) || '';
    cols.V = (row.division as string) || '';
    cols.AP = (row.next_promotion_date as string) || '';
    cols.AQ = (row.next_allowance_date as string) || '';
    cols.BC = (row.province as string) || '';
    cols.BD = (row.mahalla as string) || '';
    cols.BE = (row.zuqaq as string) || '';
    cols.BF = (row.dar as string) || '';
    cols.BG = (row.email as string) || '';
    cols.BH = (row.notes as string) || '';

    employees.push({
      id,
      cols,
      photo: (row.photo as string) || null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      lists: {
        thanks: [],
        penalties: [],
        leaves: [],
        courses: [],
        allocations: [],
        promotions: [],
        allowances: [],
        prevdirs: []
      }
    });
  }
  stmt.free();

  // Load lists for each employee
  for (const emp of employees) {
    const listStmt = db.prepare("SELECT list_type, data FROM employee_lists WHERE employee_id = ? ORDER BY sort_order ASC");
    listStmt.bind([emp.id]);
    while (listStmt.step()) {
      const lrow = listStmt.getAsObject();
      const lt = lrow.list_type as keyof typeof emp.lists;
      try {
        const item = JSON.parse(lrow.data as string);
        if (emp.lists[lt]) {
          emp.lists[lt].push(item);
        }
      } catch {}
    }
    listStmt.free();
  }

  return employees;
}

export async function getEmployeeById(id: string): Promise<EmployeeRecord | null> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM employees WHERE id = ?");
  stmt.bind([id]);
  if (!stmt.step()) {
    stmt.free();
    return null;
  }
  const row = stmt.getAsObject();
  stmt.free();

  let cols: Record<string, string> = {};
  try {
    cols = JSON.parse(row.raw_cols as string || '{}');
  } catch {
    cols = {};
  }
  cols.A = String(row.serial || '');
  cols.B = (row.first_name as string) || '';
  cols.C = (row.second_name as string) || '';
  cols.D = (row.third_name as string) || '';
  cols.E = (row.fourth_name as string) || '';
  cols.F = (row.surname as string) || '';
  cols.G = (row.rank as string) || '';
  cols.H = (row.job_title as string) || '';
  cols.I = (row.gender as string) || '';
  cols.J = (row.statistical_id as string) || '';
  cols.K = (row.birth_year as string) || '';
  cols.L = (row.birth_month as string) || '';
  cols.M = (row.birth_day as string) || '';
  cols.N = (row.phone as string) || '';
  cols.O = (row.appointment_order as string) || '';
  cols.P = (row.appointment_date as string) || '';
  cols.Q = (row.qualification as string) || '';
  cols.R = (row.agency as string) || '';
  cols.S = (row.directorate_general as string) || '';
  cols.T = (row.directorate_sub as string) || '';
  cols.U = (row.department as string) || '';
  cols.V = (row.division as string) || '';
  cols.AP = (row.next_promotion_date as string) || '';
  cols.AQ = (row.next_allowance_date as string) || '';
  cols.BC = (row.province as string) || '';
  cols.BD = (row.mahalla as string) || '';
  cols.BE = (row.zuqaq as string) || '';
  cols.BF = (row.dar as string) || '';
  cols.BG = (row.email as string) || '';
  cols.BH = (row.notes as string) || '';

  const emp: EmployeeRecord = {
    id,
    cols,
    photo: (row.photo as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    lists: {
      thanks: [],
      penalties: [],
      leaves: [],
      courses: [],
      allocations: [],
      promotions: [],
      allowances: [],
      prevdirs: []
    },
    files: []
  };

  // Lists
  const listStmt = db.prepare("SELECT list_type, data FROM employee_lists WHERE employee_id = ? ORDER BY sort_order ASC");
  listStmt.bind([id]);
  while (listStmt.step()) {
    const lrow = listStmt.getAsObject();
    const lt = lrow.list_type as keyof typeof emp.lists;
    try {
      const item = JSON.parse(lrow.data as string);
      if (emp.lists[lt]) {
        emp.lists[lt].push(item);
      }
    } catch {}
  }
  listStmt.free();

  // Attachments
  const fileStmt = db.prepare("SELECT id, name, type, desc, data_url, created_at FROM employee_attachments WHERE employee_id = ? ORDER BY created_at ASC");
  fileStmt.bind([id]);
  while (fileStmt.step()) {
    const frow = fileStmt.getAsObject();
    emp.files?.push({
      id: frow.id as string,
      name: frow.name as string,
      type: frow.type as string,
      desc: frow.desc as string,
      dataUrl: frow.data_url as string,
      createdAt: frow.created_at as string
    });
  }
  fileStmt.free();

  return emp;
}

export async function saveEmployee(rec: EmployeeRecord): Promise<EmployeeRecord> {
  const db = await getDb();
  let id = rec.id;
  const isNew = !id;

  if (isNew) {
    id = 'rec_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    rec.id = id;
    // calculate max serial
    const res = db.exec("SELECT COALESCE(MAX(serial), 0) FROM employees");
    const maxSer = (res[0]?.values[0]?.[0] as number) || 0;
    rec.cols.A = String(maxSer + 1);
  }

  const serial = parseInt(rec.cols.A || '0', 10);
  const now = new Date().toISOString();

  // Keep first item of repeatable lists in sync with primary columns
  if (rec.lists.thanks?.[0]) {
    rec.cols.AE = rec.lists.thanks[0].desc || '';
    rec.cols.AF = rec.lists.thanks[0].duration || '';
    rec.cols.AG = rec.lists.thanks[0].num || '';
    rec.cols.AH = rec.lists.thanks[0].date || '';
  }
  if (rec.lists.penalties?.[0]) {
    rec.cols.AI = rec.lists.penalties[0].type || '';
    rec.cols.AJ = rec.lists.penalties[0].date || '';
    rec.cols.AK = rec.lists.penalties[0].amount || '';
    rec.cols.AL = rec.lists.penalties[0].num || '';
  }
  if (rec.lists.leaves?.[0]) {
    rec.cols.AM = rec.lists.leaves[0].duration || '';
    rec.cols.AN = rec.lists.leaves[0].date || '';
    rec.cols.AO = rec.lists.leaves[0].type || '';
  }
  if (rec.lists.courses?.[0]) {
    rec.cols.AR = rec.lists.courses[0].name || '';
    rec.cols.AS = rec.lists.courses[0].date || '';
  }
  if (rec.lists.allocations?.[0]) {
    rec.cols.AT = rec.lists.allocations[0].post || '';
    rec.cols.AU = rec.lists.allocations[0].amount || '';
    rec.cols.AV = rec.lists.allocations[0].degree || '';
    rec.cols.AW = rec.lists.allocations[0].degDate || '';
    rec.cols.AX = rec.lists.allocations[0].degOrder || '';
    rec.cols.AY = rec.lists.allocations[0].other || '';
    rec.cols.AZ = rec.lists.allocations[0].otherOrder || '';
    rec.cols.BA = rec.lists.allocations[0].otherDate || '';
    rec.cols.BB = rec.lists.allocations[0].adminOrder || '';
  }
  if (rec.lists.promotions?.[0]) {
    rec.cols.W = rec.lists.promotions[0].date || '';
    rec.cols.Z = rec.lists.promotions[0].num || '';
  }
  if (rec.lists.allowances?.[0]) {
    rec.cols.AA = rec.lists.allowances[0].date || '';
    rec.cols.AD = rec.lists.allowances[0].num || '';
  }
  if (rec.lists.prevdirs?.length) {
    rec.cols.BI = rec.lists.prevdirs.map(d => d.name).filter(Boolean).join('، ');
  }

  // Insert or update employee
  db.run(`
    INSERT OR REPLACE INTO employees (
      id, serial, first_name, second_name, third_name, fourth_name, surname,
      rank, job_title, gender, statistical_id, birth_year, birth_month, birth_day,
      phone, email, appointment_order, appointment_date, qualification,
      agency, directorate_general, directorate_sub, department, division,
      next_promotion_date, next_allowance_date, province, mahalla, zuqaq, dar,
      notes, photo, raw_cols, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `, [
    id,
    serial,
    rec.cols.B || '',
    rec.cols.C || '',
    rec.cols.D || '',
    rec.cols.E || '',
    rec.cols.F || '',
    rec.cols.G || '',
    rec.cols.H || '',
    rec.cols.I || '',
    rec.cols.J || ('stat_' + id),
    rec.cols.K || '',
    rec.cols.L || '',
    rec.cols.M || '',
    rec.cols.N || '',
    rec.cols.BG || '',
    rec.cols.O || '',
    rec.cols.P || '',
    rec.cols.Q || '',
    rec.cols.R || '',
    rec.cols.S || '',
    rec.cols.T || '',
    rec.cols.U || '',
    rec.cols.V || '',
    rec.cols.AP || '',
    rec.cols.AQ || '',
    rec.cols.BC || '',
    rec.cols.BD || '',
    rec.cols.BE || '',
    rec.cols.BF || '',
    rec.cols.BH || '',
    rec.photo || null,
    JSON.stringify(rec.cols),
    now
  ]);

  // Clean and insert lists
  db.run("DELETE FROM employee_lists WHERE employee_id = ?", [id]);
  if (rec.lists) {
    for (const [listType, items] of Object.entries(rec.lists)) {
      if (!Array.isArray(items)) continue;
      let order = 0;
      for (const item of items) {
        if (!item || Object.values(item).every(v => !v || String(v).trim() === '')) continue;
        db.run(
          "INSERT INTO employee_lists (id, employee_id, list_type, data, sort_order) VALUES (?, ?, ?, ?, ?)",
          [`${id}_${listType}_${order}_${Date.now()}`, id, listType, JSON.stringify(item), order]
        );
        order++;
      }
    }
  }

  // Update attachments if supplied
  if (rec.files !== undefined) {
    db.run("DELETE FROM employee_attachments WHERE employee_id = ?", [id]);
    for (const file of rec.files) {
      db.run(
        "INSERT INTO employee_attachments (id, employee_id, name, type, desc, data_url) VALUES (?, ?, ?, ?, ?, ?)",
        [file.id || ('f_' + Date.now() + Math.random()), id, file.name, file.type, file.desc || '', file.dataUrl]
      );
    }
  }

  saveDb();
  return (await getEmployeeById(id))!;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const db = await getDb();
  db.run("DELETE FROM employee_lists WHERE employee_id = ?", [id]);
  db.run("DELETE FROM employee_attachments WHERE employee_id = ?", [id]);
  db.run("DELETE FROM attendance WHERE employee_id = ?", [id]);
  db.run("DELETE FROM employees WHERE id = ?", [id]);
  saveDb();
  return true;
}

// ATTENDANCE FUNCTIONS
export async function getAttendanceByDate(date: string, department = ''): Promise<AttendanceRecord[]> {
  const db = await getDb();
  let sql = `
    SELECT 
      e.id as employee_id,
      COALESCE(e.first_name || ' ' || e.second_name || ' ' || e.third_name || ' ' || e.surname, 'بدون اسم') as employee_name,
      e.rank,
      e.department,
      e.statistical_id,
      e.photo,
      a.id as attendance_id,
      a.date,
      a.status,
      a.check_in_time,
      a.check_out_time,
      a.work_hours,
      a.notes,
      a.recorded_by
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = ?
    WHERE 1=1
  `;
  const params: any[] = [date];
  if (department) {
    sql += " AND e.department = ? ";
    params.push(department);
  }
  sql += " ORDER BY e.serial ASC ";

  const stmt = db.prepare(sql);
  stmt.bind(params);
  const records: AttendanceRecord[] = [];

  while (stmt.step()) {
    const row = stmt.getAsObject();
    records.push({
      id: (row.attendance_id as string) || `att_${row.employee_id}_${date}`,
      employeeId: row.employee_id as string,
      date,
      status: (row.status as any) || 'absent',
      checkInTime: (row.check_in_time as string) || undefined,
      checkOutTime: (row.check_out_time as string) || undefined,
      workHours: (row.work_hours as number) || 0,
      notes: (row.notes as string) || '',
      recordedBy: (row.recorded_by as string) || '',
      employeeName: (row.employee_name as string).trim(),
      rank: (row.rank as string) || '',
      department: (row.department as string) || '',
      statisticalId: (row.statistical_id as string) || '',
      photo: (row.photo as string) || null
    });
  }
  stmt.free();
  return records;
}

export async function saveAttendanceRecord(rec: {
  employeeId: string;
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  recordedBy?: string;
}): Promise<void> {
  const db = await getDb();
  let workHours = 0;
  if (rec.checkInTime && rec.checkOutTime) {
    const [inH, inM] = rec.checkInTime.split(':').map(Number);
    const [outH, outM] = rec.checkOutTime.split(':').map(Number);
    const diffMin = (outH * 60 + outM) - (inH * 60 + inM);
    if (diffMin > 0) {
      workHours = Math.round((diffMin / 60) * 100) / 100;
    }
  }

  const id = `${rec.employeeId}_${rec.date}`;
  db.run(`
    INSERT OR REPLACE INTO attendance (
      id, employee_id, date, status, check_in_time, check_out_time, work_hours, notes, recorded_by, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now')
    )
  `, [
    id,
    rec.employeeId,
    rec.date,
    rec.status,
    rec.checkInTime || null,
    rec.checkOutTime || null,
    workHours,
    rec.notes || '',
    rec.recordedBy || 'المسؤول الإداري'
  ]);
  saveDb();
}

export async function batchSaveAttendance(items: Array<{
  employeeId: string;
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}>): Promise<void> {
  const db = await getDb();
  for (const it of items) {
    await saveAttendanceRecord(it);
  }
}

// AUTOMATIC MANAGER ALERTS SYSTEM
export async function getManagerAlerts(department = ''): Promise<{ alerts: ManagerAlert[]; counts: Record<string, number> }> {
  const db = await getDb();
  const alerts: ManagerAlert[] = [];
  const today = new Date().toISOString().split('T')[0];
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. Promotion Due Alerts
  let promSql = `
    SELECT id, first_name, second_name, surname, statistical_id, rank, department, next_promotion_date
    FROM employees
    WHERE next_promotion_date IS NOT NULL AND next_promotion_date != ''
      AND next_promotion_date <= ?
  `;
  const promParams = [in30Days];
  if (department) {
    promSql += " AND department = ? ";
    promParams.push(department);
  }
  const promStmt = db.prepare(promSql);
  promStmt.bind(promParams);
  while (promStmt.step()) {
    const row = promStmt.getAsObject();
    const isOverdue = (row.next_promotion_date as string) <= today;
    alerts.push({
      id: `prom_${row.id}_${row.next_promotion_date}`,
      type: 'promotion_due',
      severity: isOverdue ? 'high' : 'medium',
      title: isOverdue ? '⚠️ استحقاق ترقية متأخر' : '📅 موعد ترقية قادم',
      message: `الموظف ${row.first_name} ${row.second_name || ''} ${row.surname || ''} (${row.rank}) مستحق للترقية بتاريخ ${row.next_promotion_date}. يرجى تدقيق ملف الخدمة ورفع جدول الترقية.`,
      employeeId: row.id as string,
      employeeName: `${row.first_name} ${row.second_name || ''} ${row.surname || ''}`.trim(),
      statisticalId: (row.statistical_id as string) || '',
      rank: (row.rank as string) || '',
      department: (row.department as string) || 'غير محدد',
      date: row.next_promotion_date as string,
      actionRequired: 'رفع جدول الترقية ومراجعة القدم والعقوبات'
    });
  }
  promStmt.free();

  // 2. Allowance Due Alerts
  let allowSql = `
    SELECT id, first_name, second_name, surname, statistical_id, rank, department, next_allowance_date
    FROM employees
    WHERE next_allowance_date IS NOT NULL AND next_allowance_date != ''
      AND next_allowance_date <= ?
  `;
  const allowParams = [in30Days];
  if (department) {
    allowSql += " AND department = ? ";
    allowParams.push(department);
  }
  const allowStmt = db.prepare(allowSql);
  allowStmt.bind(allowParams);
  while (allowStmt.step()) {
    const row = allowStmt.getAsObject();
    const isOverdue = (row.next_allowance_date as string) <= today;
    alerts.push({
      id: `allow_${row.id}_${row.next_allowance_date}`,
      type: 'allowance_due',
      severity: isOverdue ? 'high' : 'medium',
      title: isOverdue ? '⚠️ استحقاق علاوة سنوية متأخر' : '📈 موعد علاوة سنوية',
      message: `يستحق الموظف ${row.first_name} ${row.second_name || ''} ${row.surname || ''} علاوته السنوية بتاريخ ${row.next_allowance_date}.`,
      employeeId: row.id as string,
      employeeName: `${row.first_name} ${row.second_name || ''} ${row.surname || ''}`.trim(),
      statisticalId: (row.statistical_id as string) || '',
      rank: (row.rank as string) || '',
      department: (row.department as string) || 'غير محدد',
      date: row.next_allowance_date as string,
      actionRequired: 'إصدار أمر إداري بالعلاوة السنوية'
    });
  }
  allowStmt.free();

  // 3. Today's Attendance Alerts (Absences & Late arrivals)
  let attSql = `
    SELECT a.status, a.check_in_time, a.notes, e.id, e.first_name, e.second_name, e.surname, e.statistical_id, e.rank, e.department
    FROM attendance a
    JOIN employees e ON a.employee_id = e.id
    WHERE a.date = ? AND a.status IN ('absent', 'late')
  `;
  const attParams = [today];
  if (department) {
    attSql += " AND e.department = ? ";
    attParams.push(department);
  }
  const attStmt = db.prepare(attSql);
  attStmt.bind(attParams);
  while (attStmt.step()) {
    const row = attStmt.getAsObject();
    const isAbsent = row.status === 'absent';
    alerts.push({
      id: `att_${row.id}_${today}`,
      type: isAbsent ? 'absent_today' : 'late_today',
      severity: isAbsent ? 'high' : 'medium',
      title: isAbsent ? '❌ غياب اليوم' : '⏰ تأخير في الحضور',
      message: isAbsent
        ? `الموظف ${row.first_name} ${row.second_name || ''} ${row.surname || ''} (${row.rank}) مسجل كغائب اليوم ${today}.`
        : `الموظف ${row.first_name} ${row.second_name || ''} ${row.surname || ''} سجل حضور متأخراً في الساعة ${row.check_in_time || 'غير محدد'}.`,
      employeeId: row.id as string,
      employeeName: `${row.first_name} ${row.second_name || ''} ${row.surname || ''}`.trim(),
      statisticalId: (row.statistical_id as string) || '',
      rank: (row.rank as string) || '',
      department: (row.department as string) || 'غير محدد',
      date: today,
      actionRequired: isAbsent ? 'التحقق من سبب الغياب وتسجيل إجازة أو عذر قانوني' : 'متابعة أسباب التأخير'
    });
  }
  attStmt.free();

  // 4. Active Penalties with promotion delays
  let penSql = `
    SELECT e.id, e.first_name, e.second_name, e.surname, e.statistical_id, e.rank, e.department, l.data
    FROM employee_lists l
    JOIN employees e ON l.employee_id = e.id
    WHERE l.list_type = 'penalties'
  `;
  if (department) {
    penSql += " AND e.department = ? ";
  }
  const penStmt = db.prepare(penSql);
  penStmt.bind(department ? [department] : []);
  while (penStmt.step()) {
    const row = penStmt.getAsObject();
    try {
      const pData = JSON.parse(row.data as string);
      if (pData.type || pData.amount) {
        alerts.push({
          id: `pen_${row.id}_${pData.num || pData.date || Math.random()}`,
          type: 'penalty_delay',
          severity: 'info',
          title: '⚖️ عقوبة مؤثرة على خط الخدمة',
          message: `الموظف ${row.first_name} ${row.second_name || ''} مسجلة بحقه عقوبة (${pData.type || 'عقوبة'}) بمقدار تأخير (${pData.amount || 'غير محدد'}) بأمر رقم ${pData.num || '—'} بتاريخ ${pData.date || '—'}.`,
          employeeId: row.id as string,
          employeeName: `${row.first_name} ${row.second_name || ''} ${row.surname || ''}`.trim(),
          statisticalId: (row.statistical_id as string) || '',
          rank: (row.rank as string) || '',
          department: (row.department as string) || 'غير محدد',
          date: pData.date || today,
          actionRequired: 'احتساب التأخير عند إعداد جدول الترقية'
        });
      }
    } catch {}
  }
  penStmt.free();

  const counts = {
    total: alerts.length,
    high: alerts.filter(a => a.severity === 'high').length,
    promotions: alerts.filter(a => a.type === 'promotion_due').length,
    allowances: alerts.filter(a => a.type === 'allowance_due').length,
    absent: alerts.filter(a => a.type === 'absent_today').length,
    late: alerts.filter(a => a.type === 'late_today').length,
    penalties: alerts.filter(a => a.type === 'penalty_delay').length
  };

  return { alerts, counts };
}

// DASHBOARD STATS
export async function getDashboardStats() {
  const db = await getDb();
  const today = new Date().toISOString().split('T')[0];

  const empCount = (db.exec("SELECT COUNT(*) FROM employees")[0]?.values[0]?.[0] as number) || 0;
  
  // Attendance today
  const attRes = db.exec(`
    SELECT status, COUNT(*) 
    FROM attendance 
    WHERE date = '${today}' 
    GROUP BY status
  `);
  
  const attendanceCounts = {
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    mission: 0
  };

  if (attRes[0]) {
    for (const [st, cnt] of attRes[0].values) {
      const statusKey = String(st || '');
      if (statusKey in attendanceCounts) {
        attendanceCounts[statusKey as keyof typeof attendanceCounts] = Number(cnt) || 0;
      }
    }
  }

  // Departments list
  const deptsRes = db.exec("SELECT DISTINCT department FROM employees WHERE department IS NOT NULL AND department != '' ORDER BY department ASC");
  const departments = deptsRes[0]?.values.map(v => v[0] as string) || [];

  // Ranks list
  const ranksRes = db.exec("SELECT DISTINCT rank FROM employees WHERE rank IS NOT NULL AND rank != '' ORDER BY rank ASC");
  const ranks = ranksRes[0]?.values.map(v => v[0] as string) || [];

  const { counts: alertCounts } = await getManagerAlerts();

  return {
    totalEmployees: empCount,
    today,
    attendance: attendanceCounts,
    departments,
    ranks,
    alertCounts
  };
}

// PASSWORD VERIFICATION
export async function verifyPassword(pwd: string): Promise<boolean> {
  const db = await getDb();
  const res = db.exec("SELECT value FROM settings WHERE key = 'admin_password'");
  const storedHash = (res[0]?.values[0]?.[0] as string) || '';
  
  const crypto = await import('crypto');
  const hashed = crypto.createHash('sha256').update(pwd).digest('hex');
  return storedHash === hashed;
}

export async function setPassword(newPwd: string): Promise<boolean> {
  const db = await getDb();
  const crypto = await import('crypto');
  const hashed = crypto.createHash('sha256').update(newPwd).digest('hex');
  db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password', ?)", [hashed]);
  saveDb();
  return true;
}
