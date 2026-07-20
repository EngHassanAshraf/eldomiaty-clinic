'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { filesApi } from '@/lib/api/files';
import { FileRecord, ApiError } from '@/lib/api/types';
import SkeletonList from '@/components/ui/SkeletonList';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import toast from 'react-hot-toast';
import { Lock, FileText } from 'lucide-react';

export default function FilesPage() {
  const { accessToken, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    const load = async () => {
      try {
        const data = await filesApi.getFiles();
        setFiles(data);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'فشل تحميل الملفات';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [accessToken, authLoading]);

  return (
    <div className="min-h-screen bg-section-a section-padding">
      <div className="max-w-7xl mx-auto py-25 px-4 sm:px-6">
        <div className="section-header">
          <span className="badge-rose">المحتوى الطبي</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2d1a1a] mt-3 mb-2 tracking-tight">
            الملفات <span className="text-grad-rose">المتاحة</span>
          </h1>
          <div className="divider-rose" />
        </div>

        <ErrorBoundary>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <SkeletonList count={6} className="h-40" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-[#8a6a6a]">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-[#8a6a6a]">لا توجد ملفات متاحة حالياً</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => router.push(`/files/${file.id}`)}
                  className="card-base p-6 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="grad-rose rounded-xl p-2.5 shrink-0 group-hover:scale-110 transition-transform duration-250">
                      <FileText size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#2d1a1a] text-sm leading-tight group-hover:text-[#e8294a] transition-colors">
                        {file.title}
                      </h3>
                      {file.description && (
                        <p className="text-xs text-[#8a6a6a] mt-1 line-clamp-2">{file.description}</p>
                      )}
                    </div>
                  </div>
                  {file.isPaidContent && (
                    <div className="flex items-center gap-1.5 text-xs text-[#e8294a] font-medium">
                      <Lock size={12} />
                      محتوى مدفوع
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
