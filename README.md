# ShrubFund Kids - Educational Paper Trading Site

A secure, fun, educational paper-trading platform for kids to practice trading with real-time market prices.

## Features

- User authentication with pre-created accounts
- Live TradingView charts
- Real-time price updates
- Paper trading with $10,000 starting cash
- Portfolio tracking
- Trade history

## Tech Stack

- Frontend: React with React Router
- Backend: Node.js with Express
- Charts: TradingView Widget
- Hosting: GitHub Pages (frontend), Vercel (backend)

## Setup

### Prerequisites

- Node.js
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/theshrubgardener/kids-shrub.git
   cd kids-shrub
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm install --save-dev gh-pages
   cd ..
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running Locally

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```
   Backend runs on http://localhost:3001

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on http://localhost:3000

### Test Accounts

- alice / password
- bob / password
- charlie / password

## Deployment

### Frontend (GitHub Pages)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Backend (Vercel)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy backend:
   ```bash
   cd backend
   vercel
   ```

## Security

- Prices are validated against live market data
- Rate limiting on trades (1 per second per user)
- No manual price editing allowed
- All trades logged

## API Endpoints

- POST /api/login - User login
- GET /api/user/:id - Get user data
- POST /api/trade - Execute trade

## License

ISC