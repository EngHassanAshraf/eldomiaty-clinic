'use client';

import { useState } from 'react';
import { Settings2, ShieldCheck, Building2, MessageCircleMore, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useLocale } from '@/lib/LocaleContext';
import { UI } from '@/lib/i18n';

interface FormState {
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  clinicName: string;
  whatsappNumber: string;
}

function FieldCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
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
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#3A8DDE]"
      />
    </label>
  );
}

export default function SettingsPage() {
  const { isLoading, user } = useRequireAuth({ requiredRole: 'ADMIN', redirectTo: '/' });
  const { locale } = useLocale();
  const t = UI[locale];
  const isRTL = locale === 'ar';
  const [form, setForm] = useState<FormState>({
    registrationEnabled: true,
    maintenanceMode: false,
    clinicName: 'عيادة دكتور محمد الدمياطي',
    whatsappNumber: '+201066746007',
  });
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  const handleSave = () => {
    setIsSaving(true);
    window.setTimeout(() => setIsSaving(false), 600);
  };

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-4 py-35 text-[#2d1a1a] sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E91E63]/10 text-[#E91E63]">
              <Settings2 size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3A8DDE]">{t.siteSettings}</p>
              <h1 className="text-2xl font-bold sm:text-3xl">{t.manageSiteSettings}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E91E63] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#d0175b]"
          >
            <Save size={16} />
            {isSaving ? t.saving : t.saveChanges}
          </button>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <FieldCard
              title={t.general}
              description={t.controlRegistration}
            >
              <SwitchField
                label={t.registrationEnabled}
                description={t.allowNewUsers}
                checked={form.registrationEnabled}
                onChange={(value) => setForm((current) => ({ ...current, registrationEnabled: value }))}
              />
              <SwitchField
                label={t.maintenanceMode}
                description={t.maintenanceModeDesc}
                checked={form.maintenanceMode}
                onChange={(value) => setForm((current) => ({ ...current, maintenanceMode: value }))}
              />
            </FieldCard>

            <FieldCard
              title={t.clinic}
              description={t.clinicInfoDesc}
            >
              <TextField
                label={t.clinicName}
                value={form.clinicName}
                onChange={(value) => setForm((current) => ({ ...current, clinicName: value }))}
                placeholder={t.enterClinicName}
              />
              <TextField
                label={t.whatsappNumber}
                value={form.whatsappNumber}
                onChange={(value) => setForm((current) => ({ ...current, whatsappNumber: value }))}
                placeholder={t.enterWhatsappNumber}
              />
            </FieldCard>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3A8DDE]/10 text-[#3A8DDE]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{t.whatWillChange}</h2>
                  <p className="text-sm text-gray-500">{t.futureApiIntegration}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Building2 size={15} className="text-[#E91E63]" />{t.clinicDetails}</li>
                <li className="flex items-center gap-2"><MessageCircleMore size={15} className="text-[#E91E63]" />{t.whatsappContact}</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
