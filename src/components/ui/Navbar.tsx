import type React from 'react';
import { useState } from 'react';
import Button from './Button';

interface NavbarProps {
  activeTab?: 'farm' | 'pools' | 'agents' | 'portfolio';
  onTabChange?: (tab: 'farm' | 'pools' | 'agents' | 'portfolio') => void;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'farm',
  onTabChange = () => {},
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTabClick = (tab: 'farm' | 'pools' | 'agents' | 'portfolio') => {
    onTabChange(tab);
    setIsDropdownOpen(false);
  };

  const tabs = [
    { id: 'farm', label: 'Farm' },
    { id: 'pools', label: 'Pools' },
    { id: 'agents', label: 'Agents' },
    { id: 'portfolio', label: 'Portfolio' },
  ] as const;

  return (
    <nav className="flex items-center justify-between p-4 w-full max-w-7xl mx-auto">
      <div className="flex items-center">
        <div className="flex items-center mr-8">
          <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path
              d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z"
              fill="#5D34FF"
            />
            <path
              d="M101.053 67.0068C101.053 57.7308 93.6057 50.2734 84.3297 50.2734C80.0284 50.2734 76.1259 51.853 73.2065 54.491C68.0079 50.5526 61.2773 48.1279 53.8693 48.1279C39.152 48.1279 27.2315 59.6471 26.9424 74.0855C26.6436 89.0728 40.9012 101.328 55.9857 100.951C64.0583 100.72 71.3039 97.6017 76.5256 92.6716C79.6538 95.3592 83.8149 97.0093 88.3662 97.0093C97.6421 97.0093 105.09 89.552 105.09 80.2759C105.09 75.4552 103.236 71.0239 100.229 67.7753C100.783 67.2315 101.053 66.6282 101.053 66.0349V67.0068Z"
              fill="white"
            />
          </svg>
          <span className="font-bold text-xl">DobSwap</span>
        </div>

        <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="md:hidden relative">
          <button
            className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-xl"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
          >
            <span className="font-medium">{tabs.find(tab => tab.id === activeTab)?.label}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5L6 8L9 5" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg py-1 z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button variant="connect">
        Connect Wallet
      </Button>
    </nav>
  );
};

export default Navbar;
