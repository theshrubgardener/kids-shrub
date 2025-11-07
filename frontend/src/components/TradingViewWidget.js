import React, { useEffect, useRef } from 'react';

function TradingViewWidget({ onSymbolChange, onPriceUpdate }) {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": "NASDAQ:AAPL",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "autosize": true
      }`;
    container.current.appendChild(script);

    const interval = setInterval(() => {
      if (container.current) {
        const priceEl = container.current.querySelector('.valueValue-l31H9iuA');
        const symbolEl = container.current.querySelector('.js-button-text.text-GwQQdU8S.text-cq__ntSC');
        if (priceEl && onPriceUpdate) {
          const price = parseFloat(priceEl.textContent);
          if (!isNaN(price)) {
            onPriceUpdate(price);
          }
        }
        if (symbolEl && onSymbolChange) {
          const symbol = symbolEl.textContent;
          if (symbol) {
            onSymbolChange(symbol);
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onSymbolChange, onPriceUpdate]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank"><span className="blue-text">AAPL stock chart</span></a><span className="trademark"> by TradingView</span></div>
    </div>
  );
}

export default TradingViewWidget;