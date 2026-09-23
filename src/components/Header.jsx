import React from 'react';

export default function Header({ isConnected }) {
  return (
    <header className="w-full bg-cardbg border-b border-bordercolor px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-wide">
          AeroAqua <span className="text-accentblue">v2</span>
        </h1>
        <p className="text-xs text-gray-400">Adaptive IoT Telemetry & PMMSY Compliance Engine</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-400">Hardware Status:</span>
        <div className="flex items-center gap-2 bg-darkbg px-3 py-1 rounded-full border border-bordercolor">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-accentgreen animate-pulse' : 'bg-accentred'}`}></div>
          <span className={`text-xs font-bold ${isConnected ? 'text-accentgreen' : 'text-accentred'}`}>
            {isConnected ? 'ONLINE (LIVE)' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </header>
  );
}