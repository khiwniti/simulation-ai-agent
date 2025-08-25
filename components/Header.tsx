
import React from 'react';

interface HeaderProps {
    onReset?: () => void;
    showReset?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
         <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
         <h1 className="text-xl font-bold text-white">EnsumuSpace</h1>
         <span className="text-sm text-gray-400">Unification Platform</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs font-mono px-2 py-1 bg-green-900 text-green-300 rounded">Beta</span>
        {showReset && (
            <button 
                onClick={onReset}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-md transition-colors"
                title="Start a new simulation"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.062-6.326M15 4V1l-4 4 4 4V6" />
                </svg>
                <span>Start Over</span>
            </button>
        )}
      </div>
    </header>
  );
};