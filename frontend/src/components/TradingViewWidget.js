import React, { useEffect, useRef } from 'react';

function TradingViewWidget({ onSymbolChange, onPriceUpdate }) {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView && container.current) {
        new window.TradingView.widget({
          container: container.current,
          symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          height: "100%",
          backgroundColor: "#0F0F0F",
          gridColor: "rgba(242, 242, 242, 0.06)",
          onSymbolChange: onSymbolChange,
          onChartReady: (widget) => {
            widget.subscribeToRealtimePrice(onPriceUpdate);
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onSymbolChange, onPriceUpdate]);

  return (
    <div ref={container} style={{ height: "100%", width: "100%" }} />
  );
}

export default TradingViewWidget;