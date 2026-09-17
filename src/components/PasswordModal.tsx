import React, { useState } from 'react';
import { Lock, KeyRound, X, CheckCircle, AlertCircle } from 'lucide-react';
import { changePassword } from '../api.js';

interface PasswordModalProps {
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة مع تأكيدها');
      return;
    }
    if (newPassword.length < 4) {
      setError('يجب ألا تقل كلمة المرور عن 4 خانات');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'فشل تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold">تغيير كلمة مرور النظام</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>تم تغيير كلمة المرور بنجاح!</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">كلمة المرور الحالية</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="الافتراضية: 123456"
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'جارٍ الحفظ...' : 'تحديث كلمة المرور'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
