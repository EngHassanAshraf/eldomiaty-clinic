'use client';
import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import UsersTab from './components/UsersTab';
import PaymentsTab from './components/PaymentsTab';
import PaymentMethodsTab from './components/PaymentMethodsTab';
import FilesTab from './components/FilesTab';
import { Users, CreditCard, FileText, Wallet } from 'lucide-react';

type Tab = 'users' | 'payments' | 'paymentMethods' | 'files';

const TABS = [
  { id: 'users' as Tab, label: 'المستخدمون', icon: Users },
  { id: 'payments' as Tab, label: 'طلبات الدفع', icon: CreditCard },
  { id: 'paymentMethods' as Tab, label: 'طرق الدفع', icon: Wallet },
  { id: 'files' as Tab, label: 'الملفات', icon: FileText },
];

export default function DashboardPage() {
  const { isLoading, user } = useRequireAuth({ requiredRole: 'ADMIN', redirectTo: '/', replace: false });
  const [activeTab, setActiveTab] = useState<Tab>('users');

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-section-a section-padding flex items-center justify-center">
        <div className="text-[#8a6a6a]">جارى التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-a section-padding">
      <div className="max-w-7xl mx-auto px-4 py-25 sm:px-6">
        <div className="section-header">
          <span className="badge-rose">لوحة التحكم</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            إدارة <span className="text-grad-rose">العيادة</span>
          </h1>
          <div className="divider-rose" />
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'grad-rose text-white shadow-rose bg-secondary border border-[#fad4db]/60 cursor-pointer'
                  : 'bg-white/80 text-(--secondary) border border-[#fad4db]/60 hover:border-[#e8294a]/40 hover:text-[#e8294a] cursor-pointer'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="card-base glass p-6">
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'paymentMethods' && <PaymentMethodsTab />}
          {activeTab === 'files' && <FilesTab />}
        </div>
      </div>
    </div>
  );
}
