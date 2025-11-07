# ShrubFund Kids - Educational Paper Trading Site

A fun, educational paper-trading platform for kids to practice trading with real-time market prices. Fully client-side with encrypted local account files.

## Features

- Start new account or load existing encrypted account file
- Live TradingView charts with auto-sync symbol and price updates
- Paper trading with $10,000 starting cash
- Portfolio tracking with holdings table
- Trade history
- Encrypted account files (.shrub) for saving progress

## Tech Stack

- Frontend: React with React Router
- Charts: TradingView Widget API
- Data Storage: Encrypted local files
- Hosting: GitHub Pages

## How It Works

1. **Start New Account:** Creates a new account with $10,000 cash
2. **Load Account:** Upload a previously saved .shrub file to resume trading
3. **Trade:** View live charts, enter quantity, buy/sell stocks
4. **Save:** Download encrypted account file to preserve progress

Prices are fetched in real-time from Yahoo Finance. Account data is stored locally and encrypted for security.

## Deployment

The site is deployed on GitHub Pages at https://theshrubgardener.github.io/kids-shrub

To deploy updates:

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   npm install --save-dev gh-pages
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

3. In GitHub repo settings, ensure Pages serves from gh-pages branch

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/theshrubgardener/kids-shrub.git
   cd kids-shrub/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

## Security

- Account files are encrypted using AES encryption
- No personal data stored online
- Prices fetched directly from Yahoo Finance
- All trading logic runs client-side

## License

ISC