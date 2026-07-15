'use client';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { paymentRequestsApi } from '@/lib/api/payment-requests';
import { PaymentRequestRecord, PaymentStatus, ApiError } from '@/lib/api/types';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, paymentStatusClass } from '@/lib/payment/labels';
import SkeletonList from '@/components/ui/SkeletonList';
import toast from 'react-hot-toast';
import { Check, Eye, X } from 'lucide-react';

type ReviewAction = 'approve' | 'reject';

export default function PaymentsTab() {
  const { accessToken } = useAuth();
  const [requests, setRequests] = useState<PaymentRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [review, setReview] = useState<{ id: string; action: ReviewAction } | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const load = useCallback(async () => {
    if (!accessToken) return;
    try {
      const data = await paymentRequestsApi.listForAdmin(accessToken);
      setRequests(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'فشل تحميل طلبات الدفع';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleViewScreenshot = async (id: string) => {
    if (!accessToken) return;
    try {
      const { url } = await paymentRequestsApi.getScreenshotUrl(id, accessToken);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'فشل تحميل الصورة');
    }
  };

  const openReview = (id: string, action: ReviewAction) => {
    setAdminNotes('');
    setReview({ id, action });
  };

  const closeReview = () => {
    if (actingId) return;
    setReview(null);
    setAdminNotes('');
  };

  const handleReviewSubmit = async () => {
    if (!accessToken || !review) return;
    const { id, action } = review;
    const notes = adminNotes.trim() || undefined;
    setActingId(id);
    try {
      const updated =
        action === 'approve'
          ? await paymentRequestsApi.approve(id, accessToken, notes)
          : await paymentRequestsApi.reject(id, accessToken, notes);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success(action === 'approve' ? 'تمت الموافقة على الطلب' : 'تم رفض الطلب');
      setReview(null);
      setAdminNotes('');
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : action === 'approve'
            ? 'فشلت الموافقة'
            : 'فشل الرفض'
      );
    } finally {
      setActingId(null);
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
  if (requests.length === 0) {
    return <div className="text-center py-8 text-[#8a6a6a]">لا توجد طلبات دفع</div>;
  }

  const isSubmitting = review !== null && actingId === review.id;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#fad4db]/40">
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">المستخدم</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">طريقة الدفع</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">الحالة</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">التاريخ</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">ملاحظات</th>
              <th className="text-right py-3 px-4 font-semibold text-[#6b4c4c]">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-[#fad4db]/20 hover:bg-[#fff0f3]/30 transition-colors">
                <td className="py-3 px-4 text-[#2d1a1a] text-xs" dir="ltr">
                  {r.userEmail ?? r.userId}
                </td>
                <td className="py-3 px-4 text-[#2d1a1a]">{PAYMENT_METHOD_LABELS[r.method]}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paymentStatusClass(r.status)}`}>
                    {PAYMENT_STATUS_LABELS[r.status]}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#8a6a6a] text-xs">
                  {new Date(r.createdAt).toLocaleDateString('ar-EG')}
                </td>
                <td className="py-3 px-4 text-[#8a6a6a] text-xs max-w-[200px]">
                  {r.adminNotes ? (
                    <span className="line-clamp-2" title={r.adminNotes}>
                      {r.adminNotes}
                    </span>
                  ) : (
                    <span className="text-[#c4a0a0]">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewScreenshot(r.id)}
                      disabled={actingId === r.id}
                      className="text-[#8a6a6a] hover:text-[#e8294a] transition-colors disabled:opacity-50"
                      title="عرض لقطة الشاشة"
                    >
                      <Eye size={16} />
                    </button>
                    {r.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          onClick={() => openReview(r.id, 'approve')}
                          disabled={actingId === r.id}
                          className="text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                          title="موافقة"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openReview(r.id, 'reject')}
                          disabled={actingId === r.id}
                          className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="رفض"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {review && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={closeReview}
          role="presentation"
        >
          <div
            className="card-base glass w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-dialog-title"
          >
            <h3 id="review-dialog-title" className="text-lg font-black text-[#2d1a1a]">
              {review.action === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
            </h3>
            <p className="text-sm text-[#8a6a6a] leading-relaxed">
              {review.action === 'approve'
                ? 'سيتم تفعيل اشتراك المستخدم بعد الموافقة على الطلب.'
                : 'سيتم رفض طلب الدفع. يمكنك إضافة سبب اختياري للمستخدم.'}
            </p>
            <div className="space-y-2">
              <label htmlFor="admin-notes" className="text-sm font-semibold text-[#2d1a1a]">
                ملاحظات الإدارة (اختياري)
              </label>
              <textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                disabled={isSubmitting}
                rows={3}
                placeholder={
                  review.action === 'approve'
                    ? 'ملاحظة للمستخدم...'
                    : 'سبب الرفض...'
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60 resize-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 ${
                  review.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {isSubmitting
                  ? 'جارى التنفيذ...'
                  : review.action === 'approve'
                    ? 'موافقة'
                    : 'رفض'}
              </button>
              <button
                type="button"
                onClick={closeReview}
                disabled={isSubmitting}
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
