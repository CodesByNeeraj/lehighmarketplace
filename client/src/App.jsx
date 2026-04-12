import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';

// student pages
import Landing from './pages/student/landing.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/landing" element={<Landing />} />
         
          {/* Student routes */}

          {/* Admin routes */}

          {/* Redirects: if someone visit the base url, redirect them to /login*/}
          <Route path="/" element={<Navigate to="/landing" replace />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
