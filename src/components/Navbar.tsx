import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Home, FlaskConical, Database, BookOpen, GraduationCap,
  LogIn, LogOut, Menu, X, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/simulasi', label: 'Simulasi Prediksi', icon: FlaskConical },
  { to: '/kelola-dataset', label: 'Kelola Dataset', icon: Database, protected: true },
  { to: '/alur-nlp-svm', label: 'Alur NLP & SVM', icon: BookOpen },
  { to: '/tentang', label: 'Tentang Penelitian', icon: GraduationCap },
];

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-800 text-sm leading-tight block">
                Analisis Sentimen Banjir
              </span>
              <span className="text-xs text-emerald-600 font-semibold">UMSU 2026</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const showLink = !link.protected || isAuthenticated;
              if (!showLink) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {link.protected && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                </Link>
              );
            })}
          </div>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                  <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <span className="text-sm font-medium text-emerald-700">admin_fikti</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Login Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white animate-fade-in-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const showLink = !link.protected || isAuthenticated;
              if (!showLink) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                  {link.protected && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-200">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar (admin_fikti)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onLoginClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Login Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
