'use client';
import { use } from 'react';
import { useAuth } from '@/contexts/auth-context';
import PdfViewer from '@/components/PdfViewer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-section-b section-padding flex items-center justify-center">
        <div className="text-[#8a6a6a]">جارى التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-section-b section-padding">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/files" className="inline-flex items-center gap-2 text-sm text-[#8a6a6a] hover:text-[#e8294a] transition-colors mb-6">
          <ArrowRight size={16} />
          العودة إلى الملفات
        </Link>
        <PdfViewer fileId={id} isPaid={user?.isPaid ?? false} />
      </div>
    </div>
  );
}
