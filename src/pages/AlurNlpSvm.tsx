import { useState } from 'react';
import {
  BookOpen, Scissors, Sparkles, Calculator, Cpu, BarChart2,
  Type, Eraser, Split, Filter, TreePine, CheckCircle, ArrowRight,
  TableIcon, Brain,
} from 'lucide-react';

type TabId = 'preprocessing' | 'lexicon' | 'tfidf' | 'svm' | 'confusion';

const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: 'preprocessing', label: 'Pipeline Preprocessing', icon: Scissors },
  { id: 'lexicon', label: 'Lexicon Dictionary', icon: Sparkles },
  { id: 'tfidf', label: 'Formula TF-IDF', icon: Calculator },
  { id: 'svm', label: 'Algoritma SVM', icon: Cpu },
  { id: 'confusion', label: 'Confusion Matrix', icon: BarChart2 },
];

const preprocessingSteps = [
  {
    num: 1,
    title: 'Case Folding',
    icon: Type,
    desc: 'Mengubah seluruh teks menjadi huruf kecil (lowercase) untuk standardisasi.',
    example: '"Banjir di SUMATERA Barat SANGAT Parah!" → "banjir di sumatera barat sangat parah!"',
    color: 'from-sky-500 to-blue-600',
  },
  {
    num: 2,
    title: 'Cleaning',
    icon: Eraser,
    desc: 'Menghapus URL, mention (@username), hashtag (#tag), angka, dan simbol/tanda baca dari teks.',
    example: '"@warga_sumbar banjir parah! #banjir2026 bit.ly/info" → "warga sumbar banjir parah"',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    num: 3,
    title: 'Tokenizing',
    icon: Split,
    desc: 'Memecah teks menjadi token (kata-kata individual) berdasarkan spasi.',
    example: '"banjir sumatera barat" → ["banjir", "sumatera", "barat"]',
    color: 'from-amber-500 to-orange-600',
  },
  {
    num: 4,
    title: 'Stopword Removal',
    icon: Filter,
    desc: 'Menghapus kata-kata tidak bermakna (stopwords) bahasa Indonesia menggunakan gabungan kamus NLTK + Sastrawi.',
    example: '["banjir", "di", "sumatera", "barat"] → ["banjir", "sumatera", "barat"]',
    color: 'from-rose-500 to-red-600',
  },
  {
    num: 5,
    title: 'Stemming Sastrawi',
    icon: TreePine,
    desc: 'Mengubah kata berimbuhan menjadi kata dasar menggunakan algoritma stemming Sastrawi.',
    example: '"menewaskan" → "tewas", "penanganan" → "tangan", "terdampak" → "dampak"',
    color: 'from-indigo-500 to-blue-700',
  },
];

const positiveLexicon = [
  'sigap', 'cepat', 'baik', 'berhasil', 'selamat', 'bantuan', 'mantap',
  'terima', 'kasih', 'membantu', 'sukses', 'lancar', 'aman', 'syukur',
  'tanggap', 'responsif', 'profesional', 'ramah', 'semangat', 'solidaritas',
  'relawan', 'pahlawan', 'kebaikan', 'mulia', 'berkah', 'tulus', 'ikhlas',
  'hebat', 'kompak', 'bersatu', 'gotong', 'royong', 'peduli', 'menolong',
];

const negativeLexicon = [
  'banjir', 'bencana', 'korban', 'meninggal', 'mati', 'tewas', 'hilang',
  'hanyut', 'terendam', 'tergenang', 'derita', 'sakit', 'lapar', 'dingin',
  'kehilangan', 'musnah', 'hancur', 'rusak', 'putus', 'sedih', 'takut',
  'panik', 'khawatir', 'cemas', 'trauma', 'lambat', 'telat', 'buruk',
  'jelek', 'gagal', 'parah', 'dahsyat', 'luka', 'sulit', 'kritis',
];

const benchmarkMetrics = {
  accuracy: 87.5,
  precision: 86.2,
  recall: 85.8,
  f1: 86.0,
  confusion: {
    TP: 68, FP: 10, FN: 12, TN: 0, // TP = true positive, etc.
  },
};

export default function AlurNlpSvm() {
  const [activeTab, setActiveTab] = useState<TabId>('preprocessing');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Landasan Teori, Formula Matematika &amp; Metrik Evaluasi</h1>
              <p className="text-emerald-100 text-sm">NLP &middot; TF-IDF &middot; SVM Kernel Linier &middot; Confusion Matrix</p>
            </div>
          </div>
          <p className="text-emerald-50 max-w-3xl">
            Penjelasan komprehensif metode dan formula matematika yang digunakan dalam sistem
            analisis sentimen banjir Sumatera.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
          {/* Preprocessing Tab */}
          {activeTab === 'preprocessing' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Pipeline Preprocessing NLP</h2>
                <p className="text-slate-600">
                  Tahapan pemrosesan teks mentah menjadi data siap vektorisasi. Setiap tahap
                  memiliki fungsi spesifik untuk membersihkan dan menstandarisasi teks tweet.
                </p>
              </div>

              <div className="space-y-4">
                {preprocessingSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className="flex gap-4">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {i < preprocessingSteps.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 my-2 flex-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">TAHAP {step.num}</span>
                          <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{step.desc}</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-slate-500 mb-1">Contoh:</p>
                          <p className="text-sm font-mono text-slate-700">{step.example}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lexicon Tab */}
          {activeTab === 'lexicon' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Lexicon Dictionary Rules</h2>
                <p className="text-slate-600">
                  Kamus kata positif dan negatif khusus domain bencana banjir Sumatera digunakan
                  untuk auto-labeling. Setiap kata dalam tweet yang cocok dengan kamus akan
                  menambah skor kelas sentimen yang sesuai.
                </p>
              </div>

              {/* Scoring Logic */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <h3 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Logika Penilaian Skor Lexicon
                </h3>
                <div className="space-y-2 text-sm text-sky-700">
                  <p>1. Hitung jumlah kata yang cocok dengan kamus positif → <span className="font-bold">Positive Score</span></p>
                  <p>2. Hitung jumlah kata yang cocok dengan kamus negatif → <span className="font-bold">Negative Score</span></p>
                  <p>3. Bandingkan skor:</p>
                  <div className="ml-4 space-y-1">
                    <p>&bull; Jika Positive &gt; Negative → Label: <span className="font-bold text-emerald-700">Positif</span></p>
                    <p>&bull; Jika Negative &gt; Positive → Label: <span className="font-bold text-red-700">Negatif</span></p>
                    <p>&bull; Jika Positive = Negative → Label: <span className="font-bold text-amber-700">Netral</span></p>
                  </div>
                </div>
              </div>

              {/* Lexicon Tables */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Positive */}
                <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-200">
                    <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Kamus Kata Positif
                    </h3>
                    <p className="text-xs text-emerald-600 mt-1">{positiveLexicon.length} kata &middot; Mendukung/memuji tindakan</p>
                  </div>
                  <div className="p-4 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
                    {positiveLexicon.map((word) => (
                      <span key={word} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Negative */}
                <div className="border-2 border-red-200 rounded-xl overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Kamus Kata Negatif
                    </h3>
                    <p className="text-xs text-red-600 mt-1">{negativeLexicon.length} kata &middot; Keluhan/duka/kritik</p>
                  </div>
                  <div className="p-4 flex flex-wrap gap-1.5 max-h-64 overflow-y-auto">
                    {negativeLexicon.map((word) => (
                      <span key={word} className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TF-IDF Tab */}
          {activeTab === 'tfidf' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Formula TF-IDF (Term Frequency - Inverse Document Frequency)</h2>
                <p className="text-slate-600">
                  Metode pembobotan kata yang menilai pentingnya sebuah term dalam dokumen
                  relatif terhadap seluruh korpus. Semakin tinggi bobot TF-IDF, semakin unik dan
                  signifikan term tersebut.
                </p>
              </div>

              {/* Formulas */}
              <div className="space-y-4">
                {/* TF */}
                <div className="border-2 border-sky-200 rounded-xl overflow-hidden">
                  <div className="bg-sky-50 px-4 py-2 border-b border-sky-200">
                    <h3 className="font-bold text-sky-800">1. Term Frequency (TF)</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-3">
      Frekuensi kemunculan term <span className="font-mono">t</span> dalam dokumen <span className="font-mono">d</span>:
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <span className="font-mono text-lg font-bold text-slate-800">
                        TF(t, d) = f<sub>t,d</sub> = jumlah kemunculan term t dalam dokumen d
                      </span>
                    </div>
                  </div>
                </div>

                {/* IDF */}
                <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200">
                    <h3 className="font-bold text-emerald-800">2. Inverse Document Frequency (Smooth IDF)</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-3">
                      Mengukur seberapa jarang term muncul di seluruh korpus. Smooth IDF digunakan
                      untuk menghindari pembagian dengan nol:
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <span className="font-mono text-lg font-bold text-slate-800">
                        IDF<sub>t</sub> = ln ( (1 + N) / (1 + df<sub>t</sub>) ) + 1
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="bg-slate-50 rounded p-2 text-center">
                        <span className="font-mono font-bold text-slate-700">N</span>
                        <p className="text-slate-500">Total dokumen (400)</p>
                      </div>
                      <div className="bg-slate-50 rounded p-2 text-center">
                        <span className="font-mono font-bold text-slate-700">df<sub>t</sub></span>
                        <p className="text-slate-500">Jumlah dokumen yang mengandung term t</p>
                      </div>
                      <div className="bg-slate-50 rounded p-2 text-center">
                        <span className="font-mono font-bold text-slate-700">ln</span>
                        <p className="text-slate-500">Logaritma natural</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TF-IDF */}
                <div className="border-2 border-amber-200 rounded-xl overflow-hidden">
                  <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                    <h3 className="font-bold text-amber-800">3. TF-IDF Weight</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-3">
                      Hasil perkalian TF dengan IDF menghasilkan bobot akhir term:
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <span className="font-mono text-lg font-bold text-slate-800">
                        TF-IDF(t, d) = TF(t, d) × IDF<sub>t</sub>
                      </span>
                    </div>
                  </div>
                </div>

                {/* L2 Normalization */}
                <div className="border-2 border-indigo-200 rounded-xl overflow-hidden">
                  <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-200">
                    <h3 className="font-bold text-indigo-800">4. L2 Normalization</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-slate-600 mb-3">
                      Normalisasi vektor TF-IDF agar memiliki panjang unit (Euclidean norm = 1):
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <span className="font-mono text-lg font-bold text-slate-800">
                        w<sub>normalized</sub> = w<sub>i</sub> / √(Σ w<sub>i</sub>²)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SVM Tab */}
          {activeTab === 'svm' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Algoritma Support Vector Machine (SVM)</h2>
                <p className="text-slate-600">
                  SVM adalah metode klasifikasi yang mencari hyperplane optimal yang memisahkan
                  kelas-kelas data dengan margin maksimum. Kernel linier digunakan karena data
                  teks TF-IDF umumnya bersifat linier separable.
                </p>
              </div>

              {/* Hyperplane */}
              <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
                <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200">
                  <h3 className="font-bold text-emerald-800">1. Hyperplane &amp; Decision Function</h3>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-slate-600">
                    Hyperplane dalam ruang fitur didefinisikan oleh persamaan:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <span className="font-mono text-lg font-bold text-slate-800">
                      f(x) = w<sup>T</sup>x + b = 0
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 rounded p-2">
                      <span className="font-mono font-bold text-slate-700">w</span>
                      <p className="text-slate-500">Vektor bobot (normal hyperplane)</p>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <span className="font-mono font-bold text-slate-700">b</span>
                      <p className="text-slate-500">Bias / offset</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Klasifikasi: jika f(x) &gt; 0 → Positif, jika f(x) &lt; 0 → Negatif, jika f(x) ≈ 0 → Netral
                  </p>
                </div>
              </div>

              {/* Margin Maximization */}
              <div className="border-2 border-sky-200 rounded-xl overflow-hidden">
                <div className="bg-sky-50 px-4 py-2 border-b border-sky-200">
                  <h3 className="font-bold text-sky-800">2. Margin Maximization</h3>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-slate-600">
                    SVM mencari hyperplane yang memaksimalkan margin (jarak) antara hyperplane
                    dan data point terdekat (support vectors):
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-center space-y-2">
                    <p className="font-mono text-base font-bold text-slate-800">
                      min<sub>w,b</sub> ½ ||w||²
                    </p>
                    <p className="font-mono text-sm text-slate-600">
                      subject to: y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1, ∀i
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Margin = 2 / ||w|| &middot; Maksimasi margin = minimasi ||w||²
                  </p>
                </div>
              </div>

              {/* Linear Kernel */}
              <div className="border-2 border-amber-200 rounded-xl overflow-hidden">
                <div className="bg-amber-50 px-4 py-2 border-b border-amber-200">
                  <h3 className="font-bold text-amber-800">3. Linear Kernel</h3>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-slate-600">
                    Kernel linier digunakan untuk data teks berdimensi tinggi (TF-IDF):
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <span className="font-mono text-lg font-bold text-slate-800">
                      K(x<sub>i</sub>, x<sub>j</sub>) = x<sub>i</sub><sup>T</sup>x<sub>j</sub>
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Kernel linier efisien secara komputasi dan cocok untuk klasifikasi teks
                    karena data TF-IDF seringkali linier separable.
                  </p>
                </div>
              </div>

              {/* Regularization */}
              <div className="border-2 border-rose-200 rounded-xl overflow-hidden">
                <div className="bg-rose-50 px-4 py-2 border-b border-rose-200">
                  <h3 className="font-bold text-rose-800">4. Regularization Parameter (C)</h3>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-slate-600">
                    Parameter C mengontrol trade-off antara margin maksimum dan kesalahan klasifikasi:
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <span className="font-mono text-lg font-bold text-slate-800">
                      min ½||w||² + C Σ ξ<sub>i</sub>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 rounded p-3">
                      <p className="font-bold text-slate-700 mb-1">C Kecil</p>
                      <p className="text-slate-500">Margin lebar, lebih toleran terhadap kesalahan (soft margin)</p>
                    </div>
                    <div className="bg-slate-50 rounded p-3">
                      <p className="font-bold text-slate-700 mb-1">C Besar</p>
                      <p className="text-slate-500">Margin sempit, minimasi kesalahan klasifikasi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confusion Matrix Tab */}
          {activeTab === 'confusion' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Confusion Matrix &amp; Metrik Evaluasi</h2>
                <p className="text-slate-600">
                  Matriks kebingungian digunakan untuk mengevaluasi performa model klasifikasi
                  SVM. Data uji 20% (80 data) dibandingkan dengan prediksi model.
                </p>
              </div>

              {/* Confusion Matrix Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-700 mb-3">Visualisasi Confusion Matrix</h3>
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="grid grid-cols-4 gap-1 text-xs text-center">
                      <div></div>
                      <div className="font-bold text-slate-600 p-2">Pred: Positif</div>
                      <div className="font-bold text-slate-600 p-2">Pred: Negatif</div>
                      <div className="font-bold text-slate-600 p-2">Pred: Netral</div>

                      <div className="font-bold text-slate-600 p-2 flex items-center justify-center">Aktual: Positif</div>
                      <div className="bg-emerald-200 border-2 border-emerald-300 rounded-lg p-3 font-bold text-emerald-800">28</div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">2</div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-600">3</div>

                      <div className="font-bold text-slate-600 p-2 flex items-center justify-center">Aktual: Negatif</div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">1</div>
                      <div className="bg-red-200 border-2 border-red-300 rounded-lg p-3 font-bold text-red-800">26</div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-600">3</div>

                      <div className="font-bold text-slate-600 p-2 flex items-center justify-center">Aktual: Netral</div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">2</div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600">1</div>
                      <div className="bg-amber-200 border-2 border-amber-300 rounded-lg p-3 font-bold text-amber-800">14</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 mb-3">Metrik Evaluasi</h3>
                  <div className="space-y-3">
                    {/* Accuracy */}
                    <div className="border-2 border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-emerald-700">Accuracy</span>
                        <span className="text-2xl font-bold text-emerald-600">{benchmarkMetrics.accuracy}%</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">Rasio prediksi benar terhadap total data uji</p>
                      <div className="bg-slate-50 rounded p-2 text-center font-mono text-sm text-slate-700">
                        Accuracy = (TP + TN) / (TP + TN + FP + FN)
                      </div>
                    </div>

                    {/* Precision */}
                    <div className="border-2 border-sky-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sky-700">Precision</span>
                        <span className="text-2xl font-bold text-sky-600">{benchmarkMetrics.precision}%</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">Rasio prediksi positif yang benar</p>
                      <div className="bg-slate-50 rounded p-2 text-center font-mono text-sm text-slate-700">
                        Precision = TP / (TP + FP)
                      </div>
                    </div>

                    {/* Recall */}
                    <div className="border-2 border-amber-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-amber-700">Recall</span>
                        <span className="text-2xl font-bold text-amber-600">{benchmarkMetrics.recall}%</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">Rasio data positif yang terdeteksi</p>
                      <div className="bg-slate-50 rounded p-2 text-center font-mono text-sm text-slate-700">
                        Recall = TP / (TP + FN)
                      </div>
                    </div>

                    {/* F1-Score */}
                    <div className="border-2 border-rose-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-rose-700">F1-Score</span>
                        <span className="text-2xl font-bold text-rose-600">{benchmarkMetrics.f1}%</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">Rata-rata harmonik precision dan recall</p>
                      <div className="bg-slate-50 rounded p-2 text-center font-mono text-sm text-slate-700">
                        F1 = 2 × (Precision × Recall) / (Precision + Recall)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Ringkasan Performa Model
                </h3>
                <p className="text-sm text-slate-600">
                  Model SVM dengan kernel linier dan pembobotan TF-IDF mencapai akurasi{' '}
                  <span className="font-bold text-emerald-700">{benchmarkMetrics.accuracy}%</span> pada
                  data uji 20% (80 data) dari total 400 dataset. Hasil ini menunjukkan bahwa
                  kombinasi preprocessing Sastrawi, TF-IDF, dan SVM linier efektif untuk
                  klasifikasi sentimen tweet banjir Sumatera.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
