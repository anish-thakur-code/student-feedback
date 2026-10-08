import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SubmissionSuccess from './pages/SubmissionSuccess.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thanks" element={<SubmissionSuccess />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
