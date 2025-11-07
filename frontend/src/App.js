import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const hasAccount = localStorage.getItem('accountData');

  return (
    <Router>
      <Routes>
        <Route path="/" element={hasAccount ? <Navigate to="/dashboard" /> : <StartScreen />} />
        <Route path="/dashboard" element={hasAccount ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
