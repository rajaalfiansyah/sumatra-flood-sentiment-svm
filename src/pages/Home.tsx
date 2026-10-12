import { Link } from 'react-router-dom';
import {
  Search, FileText, CheckCircle, Database, Calculator, BookOpen,
  GraduationCap, BrainCircuit, ArrowRight, Cpu, Layers, Scissors,
  BarChart2, PieChart, Sparkles, TrendingUp,
} from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';
import { SentimentBadge } from '@/components/SentimentBadge';
import {
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

const SENTIMENT_COLORS = {
  Positif: '#10b981',
  Negatif: '#ef4444',
  Netral: '#f59e0b',
};

const workflowSteps = [
  { num: 1, title: 'Input Raw CSV', desc: 'Dataset 400 tweet banjir Sumatera', icon: FileText, color: 'from-sky-500 to-blue-600' },
  { num: 2, title: 'Preprocessing NLP', desc: 'Cleaning, Tokenizing, Stopword, Stemming Sastrawi', icon: Scissors, color: 'from-emerald-500 to-teal-600' },
  { num: 3, title: 'Lexicon Auto-Labeling', desc: 'Klasifikasi otomatis positif/negatif/netral', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
  { num: 4, title: 'TF-IDF Matrix', desc: 'Pembobotan TF-IDF dengan L2 Normalization', icon: Calculator, color: 'from-sky-500 to-indigo-600' },
  { num: 5, title: 'Training SVM Linier', desc: 'Kernel linier dengan split 80:20', icon: Cpu, color: 'from-emerald-500 to-emerald-700' },
  { num: 6, title: 'Confusion Matrix', desc: 'Evaluasi Akurasi, Precision, Recall, F1-Score', icon: BarChart2, color: 'from-blue-500 to-sky-700' },
];

const stats = [
  { value: '400', label: 'Raw Data', sublabel: 'Dataset Tweet Banjir', icon: Database, color: 'from-sky-500 to-blue-600' },
  { value: '80:20', label: 'Split Ratio', sublabel: 'Data Latih & Uji', icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
  { value: '5', label: 'Tahap Preprocessing', sublabel: 'Cleaning hingga Stemming', icon: Scissors, color: 'from-amber-500 to-orange-600' },
  { value: '3', label: 'Kelas Sentimen', sublabel: 'Positif, Negatif, Netral', icon: Layers, color: 'from-rose-500 to-red-600' },
];

export default function Home() {
  const { stats: dsStats } = useDataset();

  const pieData = [
    { name: 'Positif', value: dsStats.positif, color: SENTIMENT_COLORS.Positif },
    { name: 'Negatif', value: dsStats.negatif, color: SENTIMENT_COLORS.Negatif },
    { name: 'Netral', value: dsStats.netral, color: SENTIMENT_COLORS.Netral },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-sky-100/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full text-sm font-semibold text-emerald-700 mb-6">
                <GraduationCap className="w-4 h-4" />
                Skripsi Sistem Informasi UMSU 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight text-balance mb-6">
                Sistem Analisis Sentimen{' '}
                <span className="gradient-text">Bencana Banjir Sumatera</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 text-balance">
                Klasifikasi opini publik dari media sosial X/Twitter terkait peristiwa banjir di
                Sumatera menggunakan Natural Language Processing (NLP) dan metode{' '}
                <span className="font-semibold text-slate-800">Support Vector Machine (SVM)</span>{' '}
 dengan kernel linier.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Dataset 400 Raw Data', 'Support Vector Machine (SVM)', 'Lexicon Auto-Labeling', 'Sastrawi Stemmer', 'Split 80:20'].map((badge) => (
                  <span key={badge} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/simulasi" className="btn-primary text-base">
                  <Search className="w-5 h-5" />
                  Uji Sentimen Teks Sekarang
                </Link>
                <Link to="/alur-nlp-svm" className="btn-secondary text-base">
                  <BookOpen className="w-5 h-5" />
                  Lihat Alur SVM & Metrik
                </Link>
              </div>
            </div>

            {/* Hero Visual - Pie Chart Widget */}
            <div className="animate-fade-in-up animate-delay-200">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Distribusi Sentimen Dataset</h3>
                    <p className="text-xs text-slate-500">Hasil Lexicon Auto-Labeling</p>
                  </div>
                </div>

                <div className="relative h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={300}
                        animationDuration={800}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                        }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-slate-800">{dsStats.total}</span>
                    <span className="text-xs text-slate-500">Total Data</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  {pieData.map((item) => (
                    <div key={item.name} className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-medium text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NLP & SVM Workflow Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 border border-sky-200 rounded-full text-sm font-semibold text-sky-700 mb-4">
            <BrainCircuit className="w-4 h-4" />
            Alur Metodologi
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
            Pipeline NLP &amp; SVM Workflow
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Enam tahap pemrosesan dari raw data tweet hingga evaluasi model klasifikasi sentimen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-4 right-4 text-6xl font-bold text-slate-100 select-none">
                  {step.num}
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 relative z-10">{step.title}</h3>
                <p className="text-sm text-slate-600 relative z-10">{step.desc}</p>
                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-r from-emerald-600 to-sky-600 rounded-3xl overflow-hidden p-8 lg:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Coba Mesin Prediksi Sentimen Real-Time
              </h2>
              <p className="text-emerald-50 mb-6">
                Masukkan opini atau tweet tentang banjir Sumatera dan lihat bagaimana SVM
                mengklasifikasikannya secara instan.
              </p>
              <Link
                to="/simulasi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-emerald-50 transition-all"
              >
                <Search className="w-5 h-5" />
                Mulai Pengujian Sekarang
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                <SentimentBadge label="Positif" size="md" />
                <span className="text-white text-sm">Opini mendukung/memuasi tindakan</span>
              </div>
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                <SentimentBadge label="Negatif" size="md" />
                <span className="text-white text-sm">Keluhan, duka, atau kritik</span>
              </div>
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                <SentimentBadge label="Netral" size="md" />
                <span className="text-white text-sm">Informasi faktual/berita</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
