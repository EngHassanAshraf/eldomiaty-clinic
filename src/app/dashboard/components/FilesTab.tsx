'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { filesApi } from '@/lib/api/files';
import { FileRecord, ApiError } from '@/lib/api/types';
import SkeletonList from '@/components/ui/SkeletonList';
import toast from 'react-hot-toast';
import { Trash2, Pencil, Upload, X, Check } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { UI } from "@/lib/i18n";

export default function FilesTab() {
  const { accessToken } = useAuth();
  const { locale } = useLocale();
  const t = UI[locale];
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPaidContent, setIsPaidContent] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPaid, setEditIsPaid] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    loadFiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const loadFiles = async () => {
    try {
      const data = await filesApi.getFiles();
      setFiles(data);
    } catch {
      toast.error(t.filesLoadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    const previewFile = previewInputRef.current?.files?.[0];
    if (!file) { toast.error(t.selectPdfFile); return; }
    if (file.type !== 'application/pdf') { toast.error(t.fileMustBePdf); return; }
    if (file.size > 50 * 1024 * 1024) { toast.error(t.fileSizeLimit); return; }
    if (isPaidContent) {
      if (!previewFile) { toast.error(t.selectPreviewFile); return; }
      if (previewFile.type !== 'application/pdf') { toast.error(t.previewMustBePdf); return; }
      if (previewFile.size > 50 * 1024 * 1024) { toast.error(t.previewSizeLimit); return; }
    }

    const formData = new FormData();
    formData.append('file', file);
    if (isPaidContent && previewFile) formData.append('previewFile', previewFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isPaidContent', String(isPaidContent));

    setUploading(true);
    try {
      const newFile = await filesApi.upload(formData);
      setFiles((prev) => [newFile, ...prev]);
      setTitle(''); setDescription(''); setIsPaidContent(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (previewInputRef.current) previewInputRef.current.value = '';
      toast.success(t.fileUploadedSuccess);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t.fileUploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteConfirm)) return;
    const prev = files;
    setFiles((f) => f.filter((x) => x.id !== id)); // optimistic
    try {
      await filesApi.delete(id);
      toast.success(t.fileDeletedSuccess);
    } catch (err) {
      setFiles(prev); // revert
      toast.error(err instanceof ApiError ? err.message : t.fileDeleteFailed);
    }
  };

  const startEdit = (file: FileRecord) => {
    setEditingId(file.id);
    setEditTitle(file.title);
    setEditDescription(file.description || '');
    setEditIsPaid(file.isPaidContent);
  };

  const handleEdit = async (id: string) => {
    const prev = files;
    const updated = { title: editTitle, description: editDescription, isPaidContent: editIsPaid };
    setFiles((f) => f.map((x) => x.id === id ? { ...x, ...updated } : x)); // optimistic
    setEditingId(null);
    try {
      await filesApi.update(id, updated);
      toast.success(t.fileUpdatedSuccess);
    } catch (err) {
      setFiles(prev); // revert
      toast.error(err instanceof ApiError ? err.message : t.fileUpdateFailed);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <form onSubmit={handleUpload} className="space-y-4 p-5 bg-[#fff8f9] rounded-2xl border border-[#fad4db]/40">
        <h3 className="font-bold text-[#2d1a1a] text-sm">{t.uploadNewFile}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            placeholder={t.fileTitle} aria-label={t.fileTitle} disabled={uploading}
            className="px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60"
          />
          <input
            type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder={t.fileDescription} aria-label={t.fileDescription} disabled={uploading}
            className="px-3 py-2.5 rounded-xl border border-[#fad4db]/60 bg-white text-sm text-[#2d1a1a] focus:outline-none focus:border-[#e8294a]/50 disabled:opacity-60"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={fileInputRef} type="file" accept="application/pdf" aria-label={t.selectFile} disabled={uploading}
            className="text-sm text-[#6b4c4c] file:btn-rose file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:cursor-pointer" />
          {isPaidContent && (
            <input ref={previewInputRef} type="file" accept="application/pdf" aria-label={t.selectPreview} disabled={uploading}
              className="text-sm text-[#6b4c4c] file:btn-rose file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:cursor-pointer" />
          )}
          <label className="flex items-center gap-2 text-sm text-[#6b4c4c] cursor-pointer">
            <input type="checkbox" checked={isPaidContent} onChange={(e) => setIsPaidContent(e.target.checked)}
              className="w-4 h-4 accent-[#e8294a]" />
            {t.paidContent}
          </label>
          <button type="submit" disabled={uploading} className="btn-rose text-sm px-4 py-2 gap-1.5 disabled:opacity-60">
            <Upload size={14} />
            {uploading ? t.uploadingFile : t.uploadFile}
          </button>
        </div>
      </form>

      {/* Files list */}
      {loading ? (
        <div className="space-y-3"><SkeletonList count={3} className="h-14" /></div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-[#8a6a6a]">{t.noFilesFound}</div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#fad4db]/40">
              {editingId === file.id ? (
                <>
                  <div className="flex-1 grid sm:grid-cols-2 gap-2">
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      aria-label={t.updateTitle} className="px-3 py-1.5 rounded-lg border border-[#fad4db]/60 text-sm text-[#2d1a1a] focus:outline-none" />
                    <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                      aria-label={t.updateDescription} placeholder={t.description} className="px-3 py-1.5 rounded-lg border border-[#fad4db]/60 text-sm text-[#2d1a1a] focus:outline-none" />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-[#6b4c4c] cursor-pointer shrink-0">
                    <input type="checkbox" checked={editIsPaid} onChange={(e) => setEditIsPaid(e.target.checked)} className="accent-[#e8294a]" />
                    {t.paidContent}
                  </label>
                  <button onClick={() => handleEdit(file.id)} className="text-emerald-600 hover:text-emerald-700 transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-[#8a6a6a] hover:text-[#2d1a1a] transition-colors">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#2d1a1a] truncate">{file.title}</p>
                    {file.description && <p className="text-xs text-[#8a6a6a] truncate">{file.description}</p>}
                  </div>
                  {file.isPaidContent && (
                    <span className="text-xs text-[#e8294a] font-medium shrink-0">{t.paidContent}</span>
                  )}
                  <button onClick={() => startEdit(file)} className="text-[#8a6a6a] hover:text-[#e8294a] transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(file.id)} className="text-[#8a6a6a] hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
