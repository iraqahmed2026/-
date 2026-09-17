import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getAllEmployees,
  getEmployeeById,
  saveEmployee,
  deleteEmployee,
  getAttendanceByDate,
  saveAttendanceRecord,
  batchSaveAttendance,
  getManagerAlerts,
  getDashboardStats,
  verifyPassword,
  setPassword
} from './server/db.js';
import { exportEmployeesToExcel, exportEmployeeToWord } from './server/export.js';

const app = express();
const PORT = 3000;

// Increase payload limit for base64 employee photos and attachments
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ----------------- API ROUTES ----------------- //

// 1. Dashboard Stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Employees CRUD
app.get('/api/employees', async (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const dept = (req.query.department as string) || '';
    const rank = (req.query.rank as string) || '';
    const province = (req.query.province as string) || '';

    const employees = await getAllEmployees(q, dept, rank, province);
    res.json(employees);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const emp = await getEmployeeById(req.params.id);
    if (!emp) return res.status(404).json({ error: 'الموظف غير موجود' });
    res.json(emp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const saved = await saveEmployee(req.body);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await deleteEmployee(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Attendance Management
app.get('/api/attendance', async (req, res) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const dept = (req.query.department as string) || '';
    const records = await getAttendanceByDate(date, dept);
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, notes, recordedBy } = req.body;
    await saveAttendanceRecord({ employeeId, date, status, checkInTime, checkOutTime, notes, recordedBy });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance/batch', async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid batch attendance data' });
    }
    await batchSaveAttendance(records);
    res.json({ success: true, count: records.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Department Manager Alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const dept = (req.query.department as string) || '';
    const alertsData = await getManagerAlerts(dept);
    res.json(alertsData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Exports (Excel & Word)
app.post('/api/export/excel', async (req, res) => {
  try {
    const { employeeId, ids } = req.body;
    let employees = [];

    if (employeeId) {
      const emp = await getEmployeeById(employeeId);
      if (!emp) return res.status(404).json({ error: 'Employee not found' });
      employees = [emp];
      const buf = exportEmployeesToExcel(employees, true);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=khadma_${encodeURIComponent(emp.cols.B || 'record')}.xlsx`);
      return res.send(buf);
    } else {
      employees = await getAllEmployees();
      if (Array.isArray(ids) && ids.length) {
        employees = employees.filter(e => ids.includes(e.id));
      }
      const buf = exportEmployeesToExcel(employees, false);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=service_records_all.xlsx`);
      return res.send(buf);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/export/word', async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId is required for Word export' });

    const emp = await getEmployeeById(employeeId);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });

    const buf = await exportEmployeeToWord(emp);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=khadma_${encodeURIComponent(emp.cols.B || 'record')}.docx`);
    return res.send(buf);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Authentication & Password Control
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    const ok = await verifyPassword(password || '');
    if (!ok) {
      return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ok = await verifyPassword(currentPassword || '');
    if (!ok) {
      return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'يجب أن لا تقل كلمة المرور عن 4 خانات' });
    }
    await setPassword(newPassword);
    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- VITE / STATIC MIDDLEWARE ----------------- //
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
