const express = require('express');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.json());

const tradeLimits = {};

let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

// Save users to file
function saveUsers() {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

// Get live price from Yahoo Finance
async function getLivePrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await axios.get(url);
    const price = response.data.chart.result[0].meta.regularMarketPrice;
    return price;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}

// POST /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.id === username && u.password === password);
  if (user) {
    res.json({ userId: user.id, cash: user.cash, holdings: user.holdings, history: user.history });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// GET /api/user/:id
app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json({ cash: user.cash, holdings: user.holdings, history: user.history });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// POST /api/trade
app.post('/api/trade', async (req, res) => {
  const { action, symbol, price, qty, userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (tradeLimits[userId] && Date.now() - tradeLimits[userId] < 1000) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  tradeLimits[userId] = Date.now();

  const livePrice = await getLivePrice(symbol);
  if (!livePrice) {
    return res.status(500).json({ error: 'Unable to fetch live price' });
  }

  const tolerance = 0.005; // 0.5%
  if (Math.abs(livePrice - price) / price > tolerance) {
    return res.status(400).json({ error: 'Price mismatch', livePrice });
  }

  if (action === 'buy') {
    const cost = qty * livePrice;
    if (user.cash < cost) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    user.cash -= cost;
    if (!user.holdings[symbol]) {
      user.holdings[symbol] = { shares: 0, avgCost: 0 };
    }
    const totalShares = user.holdings[symbol].shares + qty;
    const totalCost = user.holdings[symbol].avgCost * user.holdings[symbol].shares + cost;
    user.holdings[symbol].shares = totalShares;
    user.holdings[symbol].avgCost = totalCost / totalShares;
  } else if (action === 'sell') {
    if (!user.holdings[symbol] || user.holdings[symbol].shares < qty) {
      return res.status(400).json({ error: 'Insufficient shares' });
    }
    const proceeds = qty * livePrice;
    user.cash += proceeds;
    user.holdings[symbol].shares -= qty;
    if (user.holdings[symbol].shares === 0) {
      delete user.holdings[symbol];
    }
  }

  const trade = { action, symbol, price: livePrice, qty, timestamp: new Date().toISOString() };
  user.history.push(trade);
  console.log('Trade executed:', trade);
  saveUsers();
  res.json({ cash: user.cash, holdings: user.holdings, history: user.history });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});