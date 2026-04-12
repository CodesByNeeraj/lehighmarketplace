import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/student/landing.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
