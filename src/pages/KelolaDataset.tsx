import { useState, useMemo, useRef } from 'react';
import {
  Database, Search, Upload, FileSpreadsheet, RefreshCw, Printer,
  Pencil, Trash2, Download, ChevronLeft, ChevronRight, X,
  AlertCircle, CheckCircle, FileDown, TableIcon,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useDataset } from '@/contexts/DatasetContext';
import { useAuth } from '@/contexts/AuthContext';
import { SentimentBadge } from '@/components/SentimentBadge';
import { type SentimentLabel, preprocess } from '@/lib/nlp';
import { type RawTweet } from '@/lib/dataset';

const ROWS_PER_PAGE = 50;

export default function KelolaDataset() {
  const { dataset, stats, runAutoLabeling, updateLabel, deleteRow, replaceDataset, addRows } = useDataset();
  const { username } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState<SentimentLabel>('Netral');
  const [labelingLoading, setLabelingLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const filteredDataset = useMemo(() => {
    if (!searchQuery.trim()) return dataset;
    const q = searchQuery.toLowerCase();
    return dataset.filter(
      (row) =>
        row.isiTweet.toLowerCase().includes(q) ||
        row.username.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q) ||
        row.label.toLowerCase().includes(q)
    );
  }, [dataset, searchQuery]);

  const totalPages = Math.ceil(filteredDataset.length / ROWS_PER_PAGE);
  const paginatedData = filteredDataset.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleRunLabeling = () => {
    setLabelingLoading(true);
    setTimeout(() => {
      runAutoLabeling();
      setLabelingLoading(false);
    }, 1200);
  };

  const handleEdit = (id: string, currentLabel: SentimentLabel) => {
    setEditingId(id);
    setEditLabel(currentLabel);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateLabel(editingId, editLabel);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(`Hapus data ${id}? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteRow(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadTemplate = () => {
    const template = [
      { id: 'TW-0001', tanggal: '01 Januari 2026', username: 'contoh_user', isiTweet: 'Contoh tweet tentang banjir di Sumatera' },
      { id: 'TW-0002', tanggal: '02 Januari 2026', username: 'contoh_user2', isiTweet: 'Contoh tweet lain tentang banjir' },
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_dataset_banjir_sumatera_raw.csv';
    link.click();
  };

  const parseFile = (file: File) => {
    setUploadStatus({ type: 'idle', message: 'Memproses file...' });

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processParsedData(results.data as Record<string, string>[]);
        },
        error: () => {
          setUploadStatus({ type: 'error', message: 'Gagal membaca file CSV. Pastikan format sesuai template.' });
        },
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);
          processParsedData(jsonData);
        } catch {
          setUploadStatus({ type: 'error', message: 'Gagal membaca file Excel. Pastikan format sesuai template.' });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setUploadStatus({ type: 'error', message: 'Format file tidak didukung. Gunakan .csv atau .xlsx' });
    }
  };

  const processParsedData = (data: Record<string, string>[]) => {
    if (!data || data.length === 0) {
      setUploadStatus({ type: 'error', message: 'File kosong atau tidak memiliki data.' });
      return;
    }

    const rows: RawTweet[] = data.map((row, index) => {
      const isiTweet = row.isiTweet || row['Isi Tweet'] || row.tweet || row.text || row['Text'] || '';
      return {
        id: row.id || row.ID || row['ID Tweet'] || `UP-${(index + 1).toString().padStart(4, '0')}`,
        tanggal: row.tanggal || row.Tanggal || row.date || new Date().toLocaleDateString('id-ID'),
        username: row.username || row.Username || row.user || 'unknown',
        isiTweet,
        cleanedTweet: preprocess(isiTweet).finalText,
        label: (row.label || row.Label || row['Label Sentimen'] || 'Netral') as SentimentLabel,
      };
    }).filter((r) => r.isiTweet.trim().length > 0);

    if (rows.length === 0) {
      setUploadStatus({ type: 'error', message: 'Tidak ada data valid dengan kolom isi tweet.' });
      return;
    }

    replaceDataset(rows);
    setUploadStatus({ type: 'success', message: `Berhasil memproses ${rows.length} data dan menjalankan auto-labeling!` });
    setCurrentPage(1);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current?.classList.remove('border-emerald-500', 'bg-emerald-50');
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Repositori &amp; Pengolahan Dataset Mentah</h1>
              <p className="text-emerald-100 text-sm font-mono">dataset_banjir_sumatera_raw.csv</p>
            </div>
          </div>
          <p className="text-emerald-50 max-w-3xl">
            Kelola dataset 400 tweet banjir Sumatera, jalankan auto-labeling berbasis lexicon,
            dan impor data baru dari file CSV/Excel.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            Logged in sebagai: <span className="font-bold">{username}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-8 h-8 text-sky-600" />
              <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Total Raw Data</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">P</span>
              </div>
              <span className="text-3xl font-bold text-emerald-600">{stats.positif}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Total Positif</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">N</span>
              </div>
              <span className="text-3xl font-bold text-red-600">{stats.negatif}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Total Negatif</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">U</span>
              </div>
              <span className="text-3xl font-bold text-amber-600">{stats.netral}</span>
            </div>
            <p className="text-sm font-medium text-slate-600">Total Netral</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 no-print">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Cari berdasarkan tweet, username, ID, atau label..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import CSV/Excel
              </button>
              <button
                onClick={handleRunLabeling}
                disabled={labelingLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {labelingLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Auto-Labeling Lexicon
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Cetak Rekap
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-3 py-3 text-left font-semibold text-slate-600 w-12">No</th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-600 w-24">ID Tweet</th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-600 w-32">Tanggal</th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-600 w-28">Username</th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-600">Isi Tweet (Raw)</th>
                  <th className="px-3 py-3 text-left font-semibold text-slate-600">Cleaned Tweet</th>
                  <th className="px-3 py-3 text-center font-semibold text-slate-600 w-28">Label</th>
                  <th className="px-3 py-3 text-center font-semibold text-slate-600 w-24 no-print">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-3 py-3 text-slate-500 text-xs">
                        {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-600">{row.id}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{row.tanggal}</td>
                      <td className="px-3 py-3 text-xs">
                        <span className="font-medium text-sky-700">@{row.username}</span>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-700 max-w-xs">
                        <div className="truncate" title={row.isiTweet}>{row.isiTweet}</div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500 max-w-xs">
                        <div className="truncate font-mono" title={row.cleanedTweet}>{row.cleanedTweet}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {editingId === row.id ? (
                          <select
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value as SentimentLabel)}
                            onBlur={handleSaveEdit}
                            className="text-xs px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            autoFocus
                          >
                            <option value="Positif">Positif</option>
                            <option value="Negatif">Negatif</option>
                            <option value="Netral">Netral</option>
                          </select>
                        ) : (
                          <SentimentBadge label={row.label} />
                        )}
                      </td>
                      <td className="px-3 py-3 no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(row.id, row.label)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Edit Label"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-3 py-12 text-center text-slate-400">
                      <TableIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>Tidak ada data yang cocok dengan pencarian.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredDataset.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 gap-3 no-print">
              <p className="text-xs text-slate-500">
                Menampilkan {(currentPage - 1) * ROWS_PER_PAGE + 1}–
                {Math.min(currentPage * ROWS_PER_PAGE, filteredDataset.length)} dari{' '}
                {filteredDataset.length} data
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                  let page = i + 1;
                  if (totalPages > 8 && currentPage > 4) {
                    page = currentPage - 4 + i;
                    if (page > totalPages) page = totalPages - (7 - i);
                  }
                  if (page < 1) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-sky-600" />
                Import Dataset Raw (CSV/Excel)
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadStatus({ type: 'idle', message: '' });
                }}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Drag & Drop Area */}
              <div
                ref={dragRef}
                onDragOver={(e) => {
                  e.preventDefault();
                  dragRef.current?.classList.add('border-emerald-500', 'bg-emerald-50');
                }}
                onDragLeave={() => {
                  dragRef.current?.classList.remove('border-emerald-500', 'bg-emerald-50');
                }}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">
                  Tarik &amp; lepas file di sini, atau klik untuk memilih
                </p>
                <p className="text-xs text-slate-500 mt-1">Mendukung format .csv dan .xlsx</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Upload Status */}
              {uploadStatus.type === 'success' && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 animate-fade-in">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {uploadStatus.message}
                </div>
              )}
              {uploadStatus.type === 'error' && (
                <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {uploadStatus.message}
                </div>
              )}

              {/* Template Download */}
              <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <p className="text-xs text-sky-700 font-medium mb-2">
                  Format kolom yang diharapkan:
                </p>
                <p className="text-xs text-sky-600 font-mono mb-3">
                  id, tanggal, username, isiTweet
                </p>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-sky-300 text-sky-700 text-xs font-semibold rounded-lg hover:bg-sky-100 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Unduh Format Template CSV Mentah
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Mengimpor file baru akan menggantikan dataset saat ini. Sistem otomatis
                  menjalankan preprocessing NLP dan Lexicon Auto-Labeling pada data baru.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadStatus({ type: 'idle', message: '' });
                }}
                className="btn-outline"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
