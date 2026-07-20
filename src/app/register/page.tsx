'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import toast from 'react-hot-toast';
import { ApiError } from '@/lib/api/types';
import Link from 'next/link';
import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';
import {
  getPasswordRequirements,
  validatePassword,
  validatePasswordMatch,
} from '@/lib/auth/validate-password';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();
  const t = UI[locale];
  const isRTL = locale === 'ar';

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,         setLoading]         = useState(false);

  // Show the checklist once the user starts typing in the password field
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Confirm-field error only (password errors are shown via the checklist)
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // ── Derived state ──────────────────────────────────────────────────────

  const requirements   = getPasswordRequirements(password, locale);
  const passwordValid  = requirements.every((r) => r.met);
  const hasErrors      = !passwordValid || !!confirmError;

  // ── Handlers ──────────────────────────────────────────────────────────

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordTouched(true);
    // Re-validate confirm match whenever password changes
    if (confirmPassword) {
      setConfirmError(validatePasswordMatch(value, confirmPassword, locale));
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmError(validatePasswordMatch(password, value, locale));
  };

  const handleConfirmBlur = () => {
    if (confirmPassword) {
      setConfirmError(validatePasswordMatch(password, confirmPassword, locale));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show checklist if the user somehow submits without touching the field
    setPasswordTouched(true);

    // Final gate — re-run validators synchronously
    const matchErr = validatePasswordMatch(password, confirmPassword, locale);
    setConfirmError(matchErr);

    if (!passwordValid || matchErr) return;

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      toast.success(locale === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
      router.push('/');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '';
      if (msg === 'exist') {
        toast.error(locale === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already exists');
      } else if (msg === 'miss-match') {
        setConfirmError(t.passwordMismatch);
      } else {
        toast.error(
          msg ||
          (locale === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred. Please try again.')
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Shared class helpers ───────────────────────────────────────────────

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border bg-white/80 text-[#2d1a1a] text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
      hasError
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-[#fad4db]/60 focus:border-[#e8294a]/50 focus:ring-[#e8294a]/10'
    }`;

  return (
    <div className="min-h-screen bg-hero-premium flex items-center justify-center px-4 py-25 md:pb-0">
      <div className="w-full max-w-md">
        <div className="card-base glass p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-[#2d1a1a]">{t.registerTitle}</h1>
            <p className="text-sm text-[#8a6a6a] mt-1">{t.registerMsg}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">
                {t.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className={inputClass(false)}
                placeholder={t.fullName}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={inputClass(false)}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            {/* Password + requirements checklist */}
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                disabled={loading}
                className={inputClass(passwordTouched && !passwordValid)}
                placeholder="••••••••"
                dir="ltr"
              />

              {/* Requirements checklist — shown once the user starts typing */}
              {passwordTouched && (
                <ul className="mt-2 space-y-1" aria-label={locale === 'ar' ? 'متطلبات كلمة المرور' : 'Password requirements'}>
                  {requirements.map((req) => (
                    <li
                      key={req.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors duration-150 ${
                        req.met ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {/* Icon */}
                      <span
                        className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          req.met
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        aria-hidden="true"
                      >
                        {req.met ? '✓' : '✗'}
                      </span>
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-[#6b4c4c] mb-1.5">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleConfirmChange(e.target.value)}
                onBlur={handleConfirmBlur}
                required
                disabled={loading}
                className={inputClass(!!confirmError)}
                placeholder="••••••••"
                dir="ltr"
              />
              {confirmError && (
                <p className="mt-1.5 text-xs text-red-500" role="alert">
                  {confirmError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || hasErrors}
              className="btn-secondary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t.registerLoading : t.registerButton}
            </button>
          </form>

          <p className="text-center text-sm text-[#8a6a6a]">
            {t.haveAcc}{'  '}
            <Link href="/login" className="text-[#e8294a] font-semibold hover:underline">
              {t.loginButton}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
