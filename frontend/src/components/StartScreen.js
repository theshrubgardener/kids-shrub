import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decrypt } from '../utils';

function StartScreen() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleStartNew = () => {
    const data = { cash: 10000, holdings: {}, history: [] };
    localStorage.setItem('accountData', JSON.stringify(data));
    navigate('/dashboard');
  };

  const handleLoadAccount = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const encrypted = e.target.result;
      const decrypted = decrypt(encrypted);
      if (decrypted) {
        const data = JSON.parse(decrypted);
        localStorage.setItem('accountData', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        alert('Invalid file or decryption failed');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>ShrubFund Kids Paper Trading</h1>
      <p>Learn to trade with virtual money!</p>
      <button onClick={handleStartNew} style={{ margin: '10px', padding: '10px 20px' }}>Start New Account</button>
      <br />
      <input type="file" accept=".shrub" onChange={(e) => setFile(e.target.files[0])} style={{ margin: '10px' }} />
      <br />
      <button onClick={handleLoadAccount} disabled={!file} style={{ padding: '10px 20px' }}>Load Account</button>
    </div>
  );
}

export default StartScreen;