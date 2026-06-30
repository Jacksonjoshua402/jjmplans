import { useState, useRef } from 'react';
import { Download, Upload, HardDrive, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ALL_STORAGE_KEYS = [
  'mydayplan-activities',
  'mydayplan-targets',
  'mydayplan-pillars',
  'mydayplan-messages',
  'mydayplan-prophecies',
  'mydayplan-confessions',
  'mydayplan-books',
  'mydayplan-courses',
  'mydayplan-prayer',
];

export function exportAllData(): string {
  const backup: Record<string, any> = {
    _meta: {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'My Day Plan — JJM 2026',
    },
  };
  ALL_STORAGE_KEYS.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) backup[key] = JSON.parse(raw);
    } catch { /* skip */ }
  });
  return JSON.stringify(backup, null, 2);
}

export function importAllData(json: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(json);
    if (!data._meta) return { success: false, message: 'Invalid backup file — missing metadata' };
    let count = 0;
    ALL_STORAGE_KEYS.forEach(key => {
      if (data[key]) {
        localStorage.setItem(key, JSON.stringify(data[key]));
        count++;
      }
    });
    return { success: true, message: `Restored ${count} data section${count !== 1 ? 's' : ''}. Reload the page to see changes.` };
  } catch {
    return { success: false, message: 'Failed to parse backup file. Make sure it is a valid JSON file.' };
  }
}

interface DataManagerProps {
  onClose: () => void;
}

export default function DataManager({ onClose }: DataManagerProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `MyDayPlan-Backup-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus({ type: 'success', message: 'Backup downloaded! Save this file safely (Google Drive, etc.)' });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = importAllData(text);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
    if (fileRef.current) fileRef.current.value = '';
    if (result.success) {
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleSaveToGoogleDrive = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `MyDayPlan-Backup-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
    // After download, open Google Drive
    setTimeout(() => {
      window.open('https://drive.google.com/drive/my-drive', '_blank');
    }, 500);
    setStatus({ type: 'success', message: 'File downloaded! Now upload it to the Google Drive window that opened.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-10 overflow-y-auto animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fixed" />
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0f1f3d] to-[#0a1528] rounded-2xl shadow-2xl border border-slate-700/50 my-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50">
          <X size={18} />
        </button>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <HardDrive size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-400/70 font-bold tracking-[0.2em] uppercase">DATA MANAGEMENT</p>
              <h3 className="text-lg font-bold text-white">Backup & Restore</h3>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Your data is stored in your browser. To prevent data loss, export a backup file and save it to Google Drive or your device.
          </p>

          {/* Status message */}
          {status && (
            <div className={`flex items-start gap-3 p-3 rounded-xl border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
              {status.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />}
              <p className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{status.message}</p>
            </div>
          )}

          {/* Export */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.15em] text-slate-400 uppercase">Export (Save your data)</h4>
            <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/40 text-white text-sm font-medium transition-all hover:bg-slate-800/80 group">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                <Download size={18} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Download Backup File</p>
                <p className="text-xs text-slate-400">Save as .json file to your device</p>
              </div>
            </button>
            <button onClick={handleSaveToGoogleDrive} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-blue-500/40 text-white text-sm font-medium transition-all hover:bg-slate-800/80 group">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-blue-400"><path d="M12 2L2 19.5h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 19.5L12 13l3.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="text-left">
                <p className="font-semibold">Save to Google Drive</p>
                <p className="text-xs text-slate-400">Download file, then upload to Drive</p>
              </div>
            </button>
          </div>

          {/* Import */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.15em] text-slate-400 uppercase">Import (Restore your data)</h4>
            <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-800/50 border border-dashed border-slate-700/60 hover:border-amber-500/40 text-white text-sm font-medium transition-all hover:bg-slate-800/80 group">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-all">
                <Upload size={18} className="text-amber-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Load Backup File</p>
                <p className="text-xs text-slate-400">Select a .json backup file to restore</p>
              </div>
            </button>
            <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
          </div>

          <p className="text-[11px] text-slate-500 text-center pt-2">
            💡 Tip: Export your data regularly and upload the file to Google Drive for safe keeping.
          </p>
        </div>
      </div>
    </div>
  );
}
