import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import PatientsList from './pages/PatientsList';
import TreatmentPage from './pages/TreatmentPage'; // ✅ import TreatmentPage

function App() {
  return (
    <Router>
      {/* Navigation bar */}
      <nav style={{ padding: '10px', marginBottom: '20px', background: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Patients</Link>
        <Link to="/treatment" style={{ marginRight: '10px' }}>Treatment</Link>
        <Link to="/signin" style={{ marginRight: '10px' }}>Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<PatientsList />} />
        <Route path="/treatment" element={<TreatmentPage />} /> {/* ✅ Treatment route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
