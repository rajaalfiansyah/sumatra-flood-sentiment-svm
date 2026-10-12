import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DatasetProvider } from '@/contexts/DatasetContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Simulation from '@/pages/Simulation';
import KelolaDataset from '@/pages/KelolaDataset';
import AlurNlpSvm from '@/pages/AlurNlpSvm';
import Tentang from '@/pages/Tentang';

function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <AuthProvider>
      <DatasetProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar onLoginClick={() => setLoginOpen(true)} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/simulasi" element={<Simulation />} />
                <Route
                  path="/kelola-dataset"
                  element={
                    <ProtectedRoute>
                      <KelolaDataset />
                    </ProtectedRoute>
                  }
                />
                <Route path="/alur-nlp-svm" element={<AlurNlpSvm />} />
                <Route path="/tentang" element={<Tentang />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
        </BrowserRouter>
      </DatasetProvider>
    </AuthProvider>
  );
}

export default App;
