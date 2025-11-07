import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  const [symbol, setSymbol] = useState('AAPL');
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (window.TradingView) {
      new window.TradingView.widget({
        container: 'chart',
        symbol: 'NASDAQ:AAPL',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        height: 400,
        onSymbolChange: (symbol) => setSymbol(symbol),
        onChartReady: (widget) => {
          widget.subscribeToRealtimePrice((price) => setPrice(price));
        },
      });
    }
  }, []);

  const handleTrade = async (action) => {
    const sym = symbol.split(':')[1] || symbol;
    const response = await fetch('http://localhost:3001/api/trade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, symbol: sym, price, qty: parseInt(qty), userId: userData.userId }),
    });
    if (response.ok) {
      const data = await response.json();
      setUserData(data);
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      const error = await response.json();
      alert(error.error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{display: 'flex'}}>
        <div id="chart" style={{flex: '0 0 70%', height: '400px'}}></div>
        <div style={{flex: '0 0 30%', padding: '10px'}}>
          <div>Cash: ${userData.cash}</div>
          <div>Holdings: <pre>{JSON.stringify(userData.holdings, null, 2)}</pre></div>
          <div>History: <pre>{JSON.stringify(userData.history, null, 2)}</pre></div>
          <div>
            <h3>Trade Panel</h3>
            <div>Symbol: {symbol}</div>
            <div>Price: ${price.toFixed(2)}</div>
            <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} min="1" />
            <button onClick={() => handleTrade('buy')}>Buy</button>
            <button onClick={() => handleTrade('sell')}>Sell</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;