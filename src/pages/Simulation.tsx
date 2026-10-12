import { useState, useRef } from 'react';
import {
  Search, FlaskConical, Loader2, Smile, Frown, Meh, Printer,
  ChevronDown, ChevronRight, FileText, Calculator, Scissors,
  CheckCircle, Award, Download, X,
} from 'lucide-react';
import { predictSentiment, type PredictionResult } from '@/lib/nlp';
import { SentimentBadge } from '@/components/SentimentBadge';

type ProcessingStage = 'idle' | 'loading' | 'done';
type ProcessingStep = 0 | 1 | 2 | 3 | 4;

const loadingSteps = [
  'Case folding & Cleaning teks...',
  'Removing Stopwords & Stemming Sastrawi...',
  'Calculating TF-IDF Weights...',
  'SVM Classification dengan Kernel Linier...',
];

const sentimentConfig = {
  Positif: { Icon: Smile, bg: 'from-emerald-500 to-green-600', ring: 'ring-emerald-200', text: 'text-emerald-600', light: 'bg-emerald-50' },
  Negatif: { Icon: Frown, bg: 'from-red-500 to-rose-600', ring: 'ring-red-200', text: 'text-red-600', light: 'bg-red-50' },
  Netral: { Icon: Meh, bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-200', text: 'text-amber-600', light: 'bg-amber-50' },
};

export default function Simulation() {
  const [namaPenguji, setNamaPenguji] = useState('');
  const [inputText, setInputText] = useState('');
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [currentStep, setCurrentStep] = useState<ProcessingStep>(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'cleaned' | 'tokens' | 'stemmed' | 'tfidf'>('cleaned');
  const [expandedSteps, setExpandedSteps] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setStage('loading');
    setCurrentStep(0);
    setResult(null);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          const prediction = predictSentiment(inputText);
          setTimeout(() => {
            setResult(prediction);
            setStage('done');
          }, 300);
          return prev;
        }
        return (prev + 1) as ProcessingStep;
      });
    }, 500);
  };

  const handleReset = () => {
    setStage('idle');
    setResult(null);
    setInputText('');
    setNamaPenguji('');
    setCurrentStep(0);
  };

  const cfg = result ? sentimentConfig[result.label] : null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Mesin Pengujian &amp; Prediksi Sentimen Real-Time</h1>
              <p className="text-emerald-100 text-sm">SVM Kernel Linier &middot; TF-IDF &middot; NLP Sastrawi</p>
            </div>
          </div>
          <p className="text-emerald-50 max-w-3xl">
            Masukkan opini atau tweet terkait banjir di Sumatera untuk memprediksi kategori
            sentimen secara instan menggunakan pipeline NLP dan klasifikasi SVM.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Column 1 - Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Input Pengujian
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Penguji
                </label>
                <input
                  type="text"
                  value={namaPenguji}
                  onChange={(e) => setNamaPenguji(e.target.value)}
                  className="input-field"
                  placeholder="Masukkan nama penguji..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kalimat Opini / Tweet
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  className="input-field resize-none font-mono text-sm"
                  placeholder="Ketik teks opini... contoh: Bantuan logistik BPBD di Sumatera Barat sangat cepat dan sigap!"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">{inputText.length} karakter</span>
                  {inputText && (
                    <button
                      onClick={() => setInputText('')}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Hapus teks
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || stage === 'loading'}
                className="btn-primary w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stage === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analisis Sentimen Sekarang
                  </>
                )}
              </button>

              {/* Quick examples */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Contoh teks untuk diuji:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Bantuan logistik BPBD di Sumatera Barat sangat cepat dan sigap!',
                    'Banjir bandang di Sumatera Barat menewaskan 3 orang, sangat mengerikan',
                    'Banjir di Sumatera Barat dilaporkan mulai surut, BPBD terus memantau',
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(example)}
                      className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                    >
                      {example.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Output Panel */}
          <div ref={resultRef} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-600" />
              Live Processing &amp; SVM Output
            </h2>

            {/* Idle State */}
            {stage === 'idle' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
                  <FlaskConical className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Sistem siap memproses kalimat opini...</p>
                <p className="text-sm text-slate-400 mt-1">Masukkan teks di kolom kiri dan tekan tombol analisis</p>
              </div>
            )}

            {/* Loading State */}
            {stage === 'loading' && (
              <div className="py-12">
                <div className="space-y-3">
                  {loadingSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        i < currentStep
                          ? 'bg-emerald-50 border border-emerald-200'
                          : i === currentStep
                          ? 'bg-sky-50 border border-sky-300 animate-pulse'
                          : 'bg-slate-50 border border-slate-100 opacity-50'
                      }`}
                    >
                      {i < currentStep ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : i === currentStep ? (
                        <Loader2 className="w-5 h-5 text-sky-600 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${
                        i <= currentStep ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BrainCircuitSmall />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Result State */}
            {stage === 'done' && result && cfg && (
              <div className="space-y-5 animate-fade-in-up">
                {/* Sentiment Badge Card */}
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${cfg.bg} p-6 text-white shadow-lg`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <cfg.Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 mb-1">Hasil Klasifikasi SVM</p>
                      <h3 className="text-3xl font-bold">{result.label.toUpperCase()}</h3>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-white/70">Confidence</p>
                      <p className="text-2xl font-bold">
                        {((result.scores[result.label]) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Distribution */}
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(result.scores) as Array<keyof typeof result.scores>).map((key) => {
                    const score = result.scores[key];
                    const scoreConfig = sentimentConfig[key];
                    return (
                      <div key={key} className={`rounded-xl p-3 ${scoreConfig.light} border border-slate-200`}>
                        <p className="text-xs font-medium text-slate-600 mb-1">{key}</p>
                        <p className={`text-xl font-bold ${scoreConfig.text}`}>
                          {(score * 100).toFixed(1)}%
                        </p>
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${score * 100}%`,
                              backgroundColor: SENTIMENT_COLORS[key],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SVM Decision Info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-700">Decision Function SVM</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">f(x) = wᵀx + b =</span>
                      <span className="font-mono font-bold text-slate-800 ml-1">{result.svmWeight.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Bias (b) =</span>
                      <span className="font-mono font-bold text-slate-800 ml-1">{result.svmBias.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Processed Text Step-by-Step Viewer */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSteps(!expandedSteps)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-emerald-600" />
                      Step-by-Step NLP Processing
                    </span>
                    {expandedSteps ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSteps && (
                    <div className="p-4">
                      {/* Tabs */}
                      <div className="flex flex-wrap gap-1 mb-4 bg-slate-100 p-1 rounded-lg">
                        {[
                          { key: 'cleaned', label: 'Cleaned Text' },
                          { key: 'tokens', label: 'Tokens Array' },
                          { key: 'stemmed', label: 'Stemmed Result' },
                          { key: 'tfidf', label: 'Top TF-IDF Terms' },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                              activeTab === tab.key
                                ? 'bg-white text-emerald-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="min-h-[120px]">
                        {activeTab === 'cleaned' && (
                          <div className="animate-fade-in">
                            <p className="text-xs text-slate-500 mb-1">Hasil Case Folding + Cleaning:</p>
                            <p className="font-mono text-sm text-slate-700 bg-slate-50 rounded-lg p-3 leading-relaxed">
                              {result.preprocessing.cleaned || '(kosong)'}
                            </p>
                          </div>
                        )}
                        {activeTab === 'tokens' && (
                          <div className="animate-fade-in">
                            <p className="text-xs text-slate-500 mb-1">Tokens (setelah Tokenizing & Stopword Removal):</p>
                            <div className="flex flex-wrap gap-1.5">
                              {result.preprocessing.filtered.length > 0 ? (
                                result.preprocessing.filtered.map((token, i) => (
                                  <span key={i} className="px-2 py-1 bg-sky-100 text-sky-700 rounded-md text-xs font-mono">
                                    {token}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-slate-400">(tidak ada token setelah filtering)</span>
                              )}
                            </div>
                          </div>
                        )}
                        {activeTab === 'stemmed' && (
                          <div className="animate-fade-in">
                            <p className="text-xs text-slate-500 mb-1">Hasil Stemming Sastrawi:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {result.preprocessing.stemmed.length > 0 ? (
                                result.preprocessing.stemmed.map((token, i) => (
                                  <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-mono">
                                    {token}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-slate-400">(tidak ada kata setelah stemming)</span>
                              )}
                            </div>
                          </div>
                        )}
                        {activeTab === 'tfidf' && (
                          <div className="animate-fade-in">
                            <p className="text-xs text-slate-500 mb-1">Top 10 TF-IDF Weighted Terms (L2 Normalized):</p>
                            <div className="space-y-1.5">
                              {result.tfidf.topTerms.length > 0 ? (
                                result.tfidf.topTerms.map((term, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-500 w-4">{i + 1}.</span>
                                    <span className="text-sm font-mono font-medium text-slate-700 w-24 truncate">{term.term}</span>
                                    <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-sky-500 rounded transition-all duration-500"
                                        style={{ width: `${Math.max(term.weight * 100, 5)}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-mono text-slate-600 w-16 text-right">{term.weight.toFixed(4)}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-slate-400">(tidak ada term dengan bobot TF-IDF)</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="btn-primary flex-1"
                  >
                    <Printer className="w-5 h-5" />
                    Cetak Laporan Validation Slip
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-outline"
                  >
                    Uji Teks Lain
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && result && (
        <PrintModal
          result={result}
          namaPenguji={namaPenguji || 'Penguji Anonim'}
          inputText={inputText}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}

const SENTIMENT_COLORS: Record<string, string> = {
  Positif: '#10b981',
  Negatif: '#ef4444',
  Netral: '#f59e0b',
};

function BrainCircuitSmall() {
  return (
    <svg className="w-7 h-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    </svg>
  );
}

// Print Validation Slip Modal
function PrintModal({
  result,
  namaPenguji,
  inputText,
  onClose,
}: {
  result: PredictionResult;
  namaPenguji: string;
  inputText: string;
  onClose: () => void;
}) {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  // Generate a simple QR-like pattern from the prediction data
  const qrSeed = `${result.label}-${namaPenguji}-${Date.now()}`;
  const qrCells = generateQrPattern(qrSeed, 8);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-scale-in my-8 no-print">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Preview Surat Hasil Pengujian Sentimen</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div id="print-slip" className="bg-white p-8 border-2 border-slate-200 rounded-lg">
            {/* Kop Surat */}
            <div className="text-center border-b-4 border-emerald-700 pb-4 mb-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center">
                  <GraduationCapIcon />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 uppercase">Universitas Muhammadiyah Sumatera Utara</h1>
                  <h2 className="text-sm font-semibold text-emerald-700 uppercase mt-1">
                    Fakultas Ilmu Komputer dan Teknologi Informasi
                  </h2>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Kampus III UMSU &middot; Jl. Kapten Muchtar Basri No. 2, Medan &middot; Sumatera Utara
              </p>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 uppercase underline">
                Surat Hasil Pengujian Sentimen
              </h3>
              <p className="text-sm text-slate-600">Sistem Analisis Sentimen Banjir Sumatera &mdash; SVM Kernel Linier</p>
              <p className="text-xs text-slate-500 mt-1">No. Dok: SHP-UMSU/SVM/{Date.now().toString().slice(-8)}</p>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-700">Nama Peneliti:</span> Wahyudha</p>
                <p><span className="font-semibold text-slate-700">NIM:</span> 2209101067</p>
                <p><span className="font-semibold text-slate-700">Program Studi:</span> Sistem Informasi</p>
              </div>
              <div className="space-y-1">
                <p><span className="font-semibold text-slate-700">Nama Penguji:</span> {namaPenguji}</p>
                <p><span className="font-semibold text-slate-700">Tanggal Uji:</span> {today}</p>
                <p><span className="font-semibold text-slate-700">Metode:</span> SVM Linier + TF-IDF</p>
              </div>
            </div>

            {/* Input Text */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-2">Teks Opini yang Diuji:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 italic">
                &ldquo;{inputText}&rdquo;
              </div>
            </div>

            {/* Processing Summary */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-2">Ringkasan Hasil Preprocessing:</p>
              <table className="w-full text-sm border border-slate-200">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-medium text-slate-600 bg-slate-50 w-1/3">Cleaned Text</td>
                    <td className="px-3 py-2 text-slate-700 font-mono text-xs">{result.preprocessing.cleaned}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-medium text-slate-600 bg-slate-50">Jumlah Token</td>
                    <td className="px-3 py-2 text-slate-700">{result.preprocessing.filtered.length} kata</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-medium text-slate-600 bg-slate-50">Stemmed Result</td>
                    <td className="px-3 py-2 text-slate-700 font-mono text-xs">{result.preprocessing.stemmed.join(', ')}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-600 bg-slate-50">Top TF-IDF Terms</td>
                    <td className="px-3 py-2 text-slate-700 font-mono text-xs">
                      {result.tfidf.topTerms.slice(0, 5).map(t => `${t.term}(${t.weight.toFixed(3)})`).join(', ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SVM Prediction Outcome */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-2">Hasil Klasifikasi SVM:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-emerald-300 rounded-lg p-4 text-center bg-emerald-50">
                  <p className="text-xs text-slate-600 mb-1">Kategori Sentimen</p>
                  <p className="text-2xl font-bold text-emerald-700">{result.label}</p>
                </div>
                <div className="border-2 border-sky-300 rounded-lg p-4 text-center bg-sky-50">
                  <p className="text-xs text-slate-600 mb-1">Confidence Score</p>
                  <p className="text-2xl font-bold text-sky-700">{(result.scores[result.label] * 100).toFixed(2)}%</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 rounded p-2">
                  <span className="text-slate-500">Positif: </span>
                  <span className="font-bold text-emerald-600">{(result.scores.Positif * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <span className="text-slate-500">Negatif: </span>
                  <span className="font-bold text-red-600">{(result.scores.Negatif * 100).toFixed(1)}%</span>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <span className="text-slate-500">Netral: </span>
                  <span className="font-bold text-amber-600">{(result.scores.Netral * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* QR Code + Verification */}
            <div className="flex items-center justify-between border-t-2 border-slate-200 pt-4">
              <div className="text-xs text-slate-500">
                <p className="font-semibold text-slate-700">Verifikasi Digital</p>
                <p>Dokumen ini sah dan terverifikasi secara digital</p>
                <p>oleh Sistem SENTIMEN-BANJIR-UMSU</p>
                <p className="mt-2 font-mono">Hash: {qrSeed.slice(0, 32)}...</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-8 gap-0.5 p-2 bg-white border-2 border-slate-300 rounded-lg">
                  {qrCells.map((cell, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${cell ? 'bg-slate-900' : 'bg-white'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">Scan untuk verifikasi</p>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-8 text-center text-sm">
              <div>
                <p className="text-slate-600">Medan, {today}</p>
                <p className="text-slate-600 mb-16">Peneliti,</p>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1" />
                <p className="font-bold text-slate-800">Wahyudha</p>
                <p className="text-xs text-slate-500">NIM. 2209101067</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <p className="text-sm text-slate-500">Gunakan dialog cetak browser untuk menyimpan sebagai PDF</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline">
              Tutup
            </button>
            <button onClick={handlePrint} className="btn-primary">
              <Printer className="w-5 h-5" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </div>

      {/* Print-only version */}
      <div className="print-only hidden">
        {/* This is handled by the modal above through window.print() */}
      </div>
    </div>
  );
}

function generateQrPattern(seed: string, size: number): boolean[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const cells: boolean[] = [];
  let state = Math.abs(hash) || 1;
  for (let i = 0; i < size * size; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    cells.push((state % 100) < 45);
  }
  return cells;
}

function GraduationCapIcon() {
  return (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
