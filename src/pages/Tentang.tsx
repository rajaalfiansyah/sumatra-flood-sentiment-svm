import {
  GraduationCap, BookOpen, Target, Lightbulb, Cpu, Users,
  ShieldCheck, MapPin, Calendar, Award, FlaskConical, Building2,
  BrainCircuit,
} from 'lucide-react';

export default function Tentang() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Profil Penelitian Skripsi &amp; Peneliti</h1>
              <p className="text-emerald-100 text-sm">Sistem Informasi &middot; FIKTI &middot; UMSU Medan &middot; 2026</p>
            </div>
          </div>
          <p className="text-emerald-50 max-w-3xl">
            Informasi lengkap mengenai latar belakang penelitian, metodologi, dan profil
            peneliti sistem analisis sentimen banjir Sumatera.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Biodata Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-20">
              {/* Profile Header */}
              <div className="bg-gradient-to-br from-emerald-600 to-sky-600 p-6 text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Wahyudha</h2>
                <p className="text-emerald-100 text-sm">Peneliti Skripsi</p>
              </div>

              {/* Biodata Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">NIM</p>
                    <p className="text-sm font-semibold text-slate-800">2209101067</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Program Studi</p>
                    <p className="text-sm font-semibold text-slate-800">Sistem Informasi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Fakultas</p>
                    <p className="text-sm font-semibold text-slate-800">Ilmu Komputer dan Teknologi Informasi (FIKTI)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Perguruan Tinggi</p>
                    <p className="text-sm font-semibold text-slate-800">Universitas Muhammadiyah Sumatera Utara (UMSU) Medan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Tahun Penelitian</p>
                    <p className="text-sm font-semibold text-slate-800">2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Research Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Research Title */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-800">Judul Penelitian</h2>
              </div>
              <h3 className="text-base font-semibold text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200">
                &ldquo;Analisis Sentimen Publik Terhadap Peristiwa Banjir di Sumatera Berdasarkan
                Media Sosial Menggunakan Metode Support Vector Machine (SVM)&rdquo;
              </h3>
            </div>

            {/* Background */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-800">Latar Belakang Penelitian</h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Sumatera merupakan salah satu pulau di Indonesia yang rawan terjadi bencana
                  banjir, baik banjir sungai maupun banjir bandang. Peristiwa banjir yang berulang
                  menimbulkan berbagai reaksi dan opini dari masyarakat yang tersebar luas di
                  media sosial, khususnya platform X (Twitter).
                </p>
                <p>
                  Media sosial telah menjadi kanal ekspresi publik yang signifikan, di mana
                  masyarakat menyampaikan keluhan, dukungan, informasi, hingga kritik terhadap
                  penanganan bencana. Analisis sentimen terhadap opini publik ini dapat memberikan
                  wawasan berharga bagi lembaga penanganan bencana seperti BNPB dan BPBD dalam
                  memahami persepsi dan kebutuhan masyarakat.
                </p>
                <p>
                  Dengan menerapkan Natural Language Processing (NLP) dan metode machine learning
                  seperti Support Vector Machine (SVM), penelitian ini bertujuan mengklasifikasikan
                  opini publik ke dalam kategori Positif, Negatif, dan Netral secara otomatis dan
                  akurat.
                </p>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-800">Tujuan Penelitian</h2>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  'Menerapkan pipeline NLP lengkap (Cleaning, Tokenizing, Stopword Removal, Stemming Sastrawi) untuk preprocessing tweet banjir Sumatera.',
                  'Mengimplementasikan Lexicon-based Auto Labeling untuk klasifikasi awal sentimen positif, negatif, dan netral.',
                  'Menerapkan pembobotan TF-IDF dengan L2 Normalization untuk representasi vektor teks.',
                  'Membangun model klasifikasi SVM dengan kernel linier dan split data 80:20 untuk pelatihan dan pengujian.',
                  'Mengevaluasi performa model menggunakan Confusion Matrix (Accuracy, Precision, Recall, F1-Score).',
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-xs font-bold">{i + 1}</span>
                    </div>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Methodology */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-800">Metodologi Penelitian</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-800 text-sm">NLP Pipeline</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Case Folding, Cleaning, Tokenizing, Stopword Removal (NLTK + Sastrawi),
                    Stemming Sastrawi.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    <h3 className="font-semibold text-slate-800 text-sm">Lexicon Labeling</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Kamus kata positif/negatif domain bencana untuk auto-labeling 400 data tweet.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-slate-800 text-sm">TF-IDF Vectorizer</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Pembobotan TF-IDF dengan smooth IDF dan L2 Normalization untuk vektor fitur.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-rose-600" />
                    <h3 className="font-semibold text-slate-800 text-sm">SVM Kernel Linier</h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Klasifikasi SVM dengan kernel linier, split 80:20, evaluasi Confusion Matrix.
                  </p>
                </div>
              </div>
            </div>

            {/* Implications */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-800">Implikasi &amp; Manfaat</h2>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  Hasil penelitian ini dapat dimanfaatkan oleh lembaga penanganan bencana
                  <span className="font-semibold text-slate-800"> BNPB </span> dan
                  <span className="font-semibold text-slate-800"> BPBD </span>
                  untuk:
                </p>
                <ul className="space-y-1.5 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">&#9679;</span>
                    <span>Memantau sentimen publik secara real-time saat terjadi banjir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">&#9679;</span>
                    <span>Mengidentifikasi keluhan dan kritik untuk perbaikan layanan tanggap bencana</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">&#9679;</span>
                    <span>Mengukur efektivitas distribusi bantuan melalui umpan balik publik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">&#9679;</span>
                    <span>Mendukung pengambilan keputusan berbasis data dalam mitigasi bencana</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
