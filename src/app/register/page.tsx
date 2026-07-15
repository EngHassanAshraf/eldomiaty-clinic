'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import toast from 'react-hot-toast';
import { ApiError } from '@/lib/api/types';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      toast.success('تم إنشاء الحساب بنجاح');
      router.push('/');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'حدث خطأ، حاول مرة أخرى';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-premium flex items-center justify-center px-4 py-25 md:pb-0">
      <div className="w-full max-w-md">
        <div className="card-base glass p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#2d1a1a]">إنشاء حساب جديد</h1>
            <p className="text-sm text-[#8a6a6a] mt-1">أنشئ حسابك للوصول إلى المحتوى الطبي</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border border-[#fad4db]/60 bg-white/80 text-[#2d1a1a] text-sm focus:outline-none focus:border-[#e8294a]/50 focus:ring-2 focus:ring-[#e8294a]/10 transition-all disabled:opacity-60"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">
                كلمة المرور (8 أحرف على الأقل)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-[#fad4db]/60 bg-white/80 text-[#2d1a1a] text-sm focus:outline-none focus:border-[#e8294a]/50 focus:ring-2 focus:ring-[#e8294a]/10 transition-all disabled:opacity-60"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-secondary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'جارى الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="text-center text-sm text-[#8a6a6a]">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-[#e8294a] font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
