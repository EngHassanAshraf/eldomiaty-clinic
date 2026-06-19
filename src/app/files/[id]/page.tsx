'use client';
import { use, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { filesApi } from '@/lib/api/files';
import { ApiError, FileRecord } from '@/lib/api/types';
import PdfViewer from '@/components/PdfViewer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function FileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading: authLoading, refreshAuth } = useAuth();
  const [file, setFile] = useState<FileRecord | null>(null);
  const [userIsPaid, setUserIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const load = async () => {
      try {
        const user = await refreshAuth();
        setUserIsPaid(user?.isPaid ?? false);
        const data = await filesApi.getFile(id);
        setFile(data);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'فشل تحميل الملف';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, authLoading, refreshAuth]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-section-b section-padding flex items-center justify-center">
        <div className="text-[#8a6a6a]">جارى التحميل...</div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen bg-section-b section-padding flex items-center justify-center">
        <div className="text-[#8a6a6a]">الملف غير موجود</div>
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
        <PdfViewer
          fileId={id}
          isPaidContent={file.isPaidContent}
          userIsPaid={userIsPaid}
        />
      </div>
    </div>
  );
}
