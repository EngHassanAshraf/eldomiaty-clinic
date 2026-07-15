'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { paymentMethodsApi } from '@/lib/api/payment-methods';
import {
  ApiError,
  PaymentMethodSettingRecord,
  PaymentMethodSettingUpdate,
} from '@/lib/api/types';
import { PAYMENT_METHOD_LABELS } from '@/lib/payment/labels';
import SkeletonList from '@/components/ui/SkeletonList';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';

type EditForm = {
  displayName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
  isActive: boolean;
};

function toForm(record: PaymentMethodSettingRecord): EditForm {
  return {
    displayName: record.displayName,
    accountName: record.accountName ?? '',
    accountNumber: record.accountNumber ?? '',
    instructions: record.instructions ?? '',
    isActive: record.isActive,
  };
}

function toPayload(form: EditForm): PaymentMethodSettingUpdate {
  return {
    displayName: form.displayName.trim(),
    accountName: form.accountName.trim() || null,
    accountNumber: form.accountNumber.trim() || null,
    instructions: form.instructions.trim() || null,
    isActive: form.isActive,
  };
}

export default function PaymentMethodsTab() {
  const { accessToken } = useAuth();
  const [methods, setMethods] = useState<PaymentMethodSettingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<PaymentMethodSettingRecord | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await paymentMethodsApi.listActive();
      setMethods(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'فشل تحميل طرق الدفع';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (record: PaymentMethodSettingRecord) => {
    setEditing(record);
    setForm(toForm(record));
  };

  const closeEdit = () => {
    if (saving) return;
    setEditing(null);
    setForm(null);
  };

  const handleSave = async () => {
    if (!accessToken || !editing || !form) return;
    if (!form.displayName.trim()) {
      toast.error('اسم العرض مطلوب');
      return;
    }
    setSaving(true);
    try {
      const updated = await paymentMethodsApi.update(editing.method, toPayload(form));
      setMethods((prev) => prev.map((m) => (m.method === updated.method ? updated : m)));
      toast.success('تم تحديث طريقة الدفع');
      closeEdit();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'فشل تحديث طريقة الدفع');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonList count={5} className="h-12" />
      </div>
    );
  }

  if (error) return <div className="text-center py-8 text-[#8a6a6a]">{error}</div>;
  if (methods.length === 0) {
    return <div className="text-center py-8 text-[#8a6a6a]">لا توجد طرق دفع</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#fad4db]/40">
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">الطريقة</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">اسم العرض</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">رقم الحساب</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">الحالة</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.method} className="border-b border-[#fad4db]/20 hover:bg-[#fff0f3]/30 transition-colors">
                <td className="py-3 px-4 text-[#2d1a1a]">{PAYMENT_METHOD_LABELS[m.method]}</td>
                <td className="py-3 px-4 text-[#2d1a1a]">{m.displayName}</td>
                <td className="py-3 px-4 text-[#8a6a6a] text-xs" dir="ltr">
                  {m.accountNumber ?? '—'}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      m.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {m.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => openEdit(m)}
                    disabled={saving}
                    className="text-[#8a6a6a] hover:text-[#e8294a] transition-colors disabled:opacity-50"
                    title="تعديل"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={closeEdit}
          role="presentation"
        >
          <div
            className="card-base glass w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-black text-[#2d1a1a]">
              تعديل {PAYMENT_METHOD_LABELS[editing.method]}
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-semibold text-[#2d1a1a]">
                  اسم العرض
                </label>
                <input
                  id="displayName"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accountName" className="text-sm font-semibold text-[#2d1a1a]">
                  اسم الحساب
                </label>
                <input
                  id="accountName"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="accountNumber" className="text-sm font-semibold text-[#2d1a1a]">
                  رقم الحساب
                </label>
                <input
                  id="accountNumber"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  disabled={saving}
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="instructions" className="text-sm font-semibold text-[#2d1a1a]">
                  التعليمات
                </label>
                <textarea
                  id="instructions"
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  disabled={saving}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#6b4c4c] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  disabled={saving}
                  className="w-4 h-4 accent-[#e8294a]"
                />
                نشط (يظهر للمستخدمين)
              </label>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-rose py-2.5 text-sm disabled:opacity-60"
              >
                {saving ? 'جارى الحفظ...' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex-1 btn-outline-rose py-2.5 text-sm disabled:opacity-60"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
