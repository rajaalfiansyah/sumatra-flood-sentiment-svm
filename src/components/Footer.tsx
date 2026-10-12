import { Link } from 'react-router-dom';
import { BrainCircuit, Cpu, Database, Layers, Scissors, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-600 rounded-xl flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-white text-sm">SENTIMEN-BANJIR-UMSU</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sistem Analisis Sentimen Publik Terhadap Bencana Banjir Sumatera Berbasis NLP
              &amp; Support Vector Machine.
            </p>
          </div>

          {/* Center - Quick Info */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Informasi Teknis</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> SVM Kernel Linier
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" /> Pembobotan TF-IDF
              </li>
              <li className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-400" /> Stemming Sastrawi
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" /> Dataset 400 Raw CSV
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Lexicon Auto-Labeling
              </li>
            </ul>
          </div>

          {/* Right - Researcher Info */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Peneliti</h4>
            <div className="text-sm text-slate-400 space-y-1">
              <p className="font-medium text-slate-200">Wahyudha</p>
              <p>NIM: 2209101067</p>
              <p>Sistem Informasi</p>
              <p>FIKTI UMSU Medan</p>
              <p className="text-emerald-400 font-medium">Tahun 2026</p>
            </div>
            <Link
              to="/tentang"
              className="inline-block mt-3 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              Lihat profil penelitian &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Copyright &copy; 2026 - Skripsi Sistem Informasi UMSU | Wahyudha (2209101067)
          </p>
        </div>
      </div>
    </footer>
  );
}
