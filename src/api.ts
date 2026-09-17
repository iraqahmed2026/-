import { EmployeeRecord, AttendanceRecord, ManagerAlert } from './types.js';

export async function getDashboardStats() {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('فشل جلب الإحصائيات');
  return res.json();
}

export async function getEmployees(params?: { q?: string; department?: string; rank?: string; province?: string }): Promise<EmployeeRecord[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.department) query.set('department', params.department);
  if (params?.rank) query.set('rank', params.rank);
  if (params?.province) query.set('province', params.province);

  const res = await fetch(`/api/employees?${query.toString()}`);
  if (!res.ok) throw new Error('فشل جلب سجلات الموظفين');
  return res.json();
}

export async function getEmployeeById(id: string): Promise<EmployeeRecord> {
  const res = await fetch(`/api/employees/${id}`);
  if (!res.ok) throw new Error('فشل جلب بيانات الموظف');
  return res.json();
}

export async function saveEmployee(employee: Partial<EmployeeRecord>): Promise<EmployeeRecord> {
  const res = await fetch('/api/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'فشل حفظ السجل' }));
    throw new Error(err.error || 'فشل حفظ السجل');
  }
  return res.json();
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('فشل حذف الموظف');
}

export async function getAttendance(date?: string, department?: string): Promise<AttendanceRecord[]> {
  const query = new URLSearchParams();
  if (date) query.set('date', date);
  if (department) query.set('department', department);

  const res = await fetch(`/api/attendance?${query.toString()}`);
  if (!res.ok) throw new Error('فشل جلب سجل الحضور');
  return res.json();
}

export async function saveAttendance(record: {
  employeeId: string;
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  recordedBy?: string;
}): Promise<void> {
  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  if (!res.ok) throw new Error('فشل حفظ الحضور');
}

export async function batchSaveAttendance(records: Array<{
  employeeId: string;
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}>): Promise<void> {
  const res = await fetch('/api/attendance/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records })
  });
  if (!res.ok) throw new Error('فشل حفظ الحضور الجماعي');
}

export async function getManagerAlerts(department?: string): Promise<{ alerts: ManagerAlert[]; counts: Record<string, number> }> {
  const query = new URLSearchParams();
  if (department) query.set('department', department);

  const res = await fetch(`/api/alerts?${query.toString()}`);
  if (!res.ok) throw new Error('فشل جلب التنبيهات الإدارية');
  return res.json();
}

export async function downloadExcel(employeeId?: string, ids?: string[]): Promise<void> {
  const res = await fetch('/api/export/excel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, ids })
  });
  if (!res.ok) throw new Error('فشل تصدير ملف Excel');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = employeeId ? `خط_خدمة_${employeeId}.xlsx` : `سجل_الموظفين_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function downloadWord(employeeId: string, employeeName = 'موظف'): Promise<void> {
  const res = await fetch('/api/export/word', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId })
  });
  if (!res.ok) throw new Error('فشل تصدير ملف Word');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `خط_خدمة_${employeeName.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  return res.ok;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'فشل تغيير كلمة المرور' }));
    throw new Error(err.error || 'فشل تغيير كلمة المرور');
  }
}
