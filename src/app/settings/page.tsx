'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings2, ShieldCheck, Building2, MessageCircleMore, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLocale } from '@/lib/LocaleContext';

interface FormState {
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  clinicName: string;
  whatsappNumber: string;
}

function FieldCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SwitchField({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[18px] border border-gray-200 bg-[#FFF8FB] p-4">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex h-11 w-16 items-center rounded-full border border-gray-200 bg-white p-1 transition-all duration-200"
        aria-pressed={checked}
      >
        {checked ? <ToggleRight className="ml-auto h-8 w-8 text-[#E91E63]" /> : <ToggleLeft className="h-8 w-8 text-gray-400" />}
      </button>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-[12px] border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#3A8DDE]"
      />
    </label>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { locale } = useLocale();
  const isRTL = locale === 'ar';
  const [form, setForm] = useState<FormState>({
    registrationEnabled: true,
    maintenanceMode: false,
    clinicName: 'عيادة دكتور محمد الدمياطي',
    whatsappNumber: '+201066746007',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router, user?.role]);

  if (isLoading || !user) {
    return null;
  }

  const handleSave = () => {
    setIsSaving(true);
    window.setTimeout(() => setIsSaving(false), 600);
  };

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-4 py-24 text-[#2d1a1a] sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E91E63]/10 text-[#E91E63]">
              <Settings2 size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3A8DDE]">{locale === 'ar' ? 'الإعدادات' : 'Site Settings'}</p>
              <h1 className="text-2xl font-bold sm:text-3xl">{locale === 'ar' ? 'إدارة إعدادات الموقع' : 'Manage Site Settings'}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#E91E63] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d0175b]"
          >
            <Save size={16} />
            {isSaving ? (locale === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <FieldCard
              title={locale === 'ar' ? 'عام' : 'General'}
              description={locale === 'ar' ? 'تحكم في التسجيل والوصول العام إلى الموقع.' : 'Control registration and the site availability.'}
            >
              <SwitchField
                label={locale === 'ar' ? 'التسجيل مفعل' : 'Registration Enabled'}
                description={locale === 'ar' ? 'السماح للمستخدمين الجدد بإنشاء حسابات.' : 'Allow new users to create accounts.'}
                checked={form.registrationEnabled}
                onChange={(value) => setForm((current) => ({ ...current, registrationEnabled: value }))}
              />
              <SwitchField
                label={locale === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
                description={locale === 'ar' ? 'إظهار صفحة الصيانة العامة مؤقتًا.' : 'Temporarily show the public maintenance page.'}
                checked={form.maintenanceMode}
                onChange={(value) => setForm((current) => ({ ...current, maintenanceMode: value }))}
              />
            </FieldCard>

            <FieldCard
              title={locale === 'ar' ? 'العيادة' : 'Clinic'}
              description={locale === 'ar' ? 'تحديث بيانات العيادة التي تظهر في الموقع.' : 'Update the clinic information shown throughout the site.'}
            >
              <TextField
                label={locale === 'ar' ? 'اسم العيادة' : 'Clinic Name'}
                value={form.clinicName}
                onChange={(value) => setForm((current) => ({ ...current, clinicName: value }))}
                placeholder={locale === 'ar' ? 'أدخل اسم العيادة' : 'Enter clinic name'}
              />
              <TextField
                label={locale === 'ar' ? 'رقم واتساب العيادة' : 'WhatsApp Number'}
                value={form.whatsappNumber}
                onChange={(value) => setForm((current) => ({ ...current, whatsappNumber: value }))}
                placeholder={locale === 'ar' ? 'أدخل رقم واتساب' : 'Enter WhatsApp number'}
              />
            </FieldCard>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3A8DDE]/10 text-[#3A8DDE]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{locale === 'ar' ? 'ماذا سيتغير؟' : 'What will change?'}</h2>
                  <p className="text-sm text-gray-500">{locale === 'ar' ? 'سيتم ربط هذه الإعدادات بالـ API لاحقًا.' : 'These settings are prepared for future API integration.'}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Building2 size={15} className="text-[#E91E63]" />{locale === 'ar' ? 'إعدادات العيادة' : 'Clinic details'}</li>
                <li className="flex items-center gap-2"><MessageCircleMore size={15} className="text-[#E91E63]" />{locale === 'ar' ? 'تحديث واتساب' : 'WhatsApp contact'}</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
