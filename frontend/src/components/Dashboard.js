import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import TradingViewWidget from './TradingViewWidget';
import { encrypt } from '../utils';

function Dashboard() {
  const [userData, setUserData] = useState(() => {
    const data = localStorage.getItem('accountData');
    return data ? JSON.parse(data) : null;
  });
  const [symbol, setSymbol] = useState('AAPL');
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);

  if (!userData) {
    return <Navigate to="/" />;
  }

  const getLivePrice = async (sym) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.chart.result[0].meta.regularMarketPrice;
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  };

  const handleTrade = async (action) => {
    const sym = symbol;
    const livePrice = await getLivePrice(sym);
    if (!livePrice) {
      alert('Unable to fetch price');
      return;
    }

    const user = { ...userData };

    if (action === 'buy') {
      const cost = qty * livePrice;
      if (user.cash < cost) {
        alert('Insufficient funds');
        return;
      }
      user.cash -= cost;
      if (!user.holdings[sym]) {
        user.holdings[sym] = { shares: 0, avgCost: 0 };
      }
      const totalShares = user.holdings[sym].shares + qty;
      const totalCost = user.holdings[sym].avgCost * user.holdings[sym].shares + cost;
      user.holdings[sym].shares = totalShares;
      user.holdings[sym].avgCost = totalCost / totalShares;
    } else if (action === 'sell') {
      if (!user.holdings[sym] || user.holdings[sym].shares < qty) {
        alert('Insufficient shares');
        return;
      }
      const proceeds = qty * livePrice;
      user.cash += proceeds;
      user.holdings[sym].shares -= qty;
      if (user.holdings[sym].shares === 0) {
        delete user.holdings[sym];
      }
    }

    const trade = { action, symbol: sym, price: livePrice, qty, timestamp: new Date().toISOString() };
    user.history.push(trade);
    setUserData(user);
    localStorage.setItem('accountData', JSON.stringify(user));
  };

  const handleSave = () => {
    const encrypted = encrypt(userData);
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'account.shrub';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>ShrubFund Kids Dashboard</h1>
      <div style={{display: 'flex'}}>
        <div style={{flex: '0 0 70%', height: '400px'}}>
          <TradingViewWidget />
        </div>
        <div style={{flex: '0 0 30%', padding: '10px'}}>
          <div>Cash: ${userData.cash.toFixed(2)}</div>
          <h3>Holdings</h3>
          <table>
            <thead>
              <tr><th>Symbol</th><th>Shares</th><th>Avg Cost</th></tr>
            </thead>
            <tbody>
              {Object.entries(userData.holdings).map(([sym, h]) => (
                <tr key={sym}><td>{sym}</td><td>{h.shares}</td><td>${h.avgCost.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
          <h3>Trade History</h3>
          <ul>
            {userData.history.slice(-5).map((trade, i) => (
              <li key={i}>{trade.action} {trade.qty} {trade.symbol} at ${trade.price.toFixed(2)}</li>
            ))}
          </ul>
          <h3>Trade Panel</h3>
          <div>Symbol: <input value={symbol} onChange={(e) => setSymbol(e.target.value)} /></div>
          <div>Price: ${price.toFixed(2)} <button onClick={async () => {
            const p = await getLivePrice(symbol);
            if (p) setPrice(p);
          }}>Update Price</button></div>
          <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} min="1" />
          <button onClick={() => handleTrade('buy')}>Buy</button>
          <button onClick={() => handleTrade('sell')}>Sell</button>
          <br />
          <button onClick={handleSave}>Save Account</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;