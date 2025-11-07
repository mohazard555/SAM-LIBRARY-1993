import React from 'react';
import { useSettings } from '../context/SettingsContext';
import Logo from './icons/Logo';
import { Cog8ToothIcon } from './icons/Cog8ToothIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { GiftIcon } from './icons/GiftIcon';

interface HeaderProps {
  onSettingsClick: () => void;
  onAboutClick: () => void;
  onPromotionsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onAboutClick, onPromotionsClick }) => {
  const { settings } = useSettings();

  return (
    <header className="py-4 px-6 md:px-10 shadow-lg bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo className={`w-10 h-10 ${settings.colors.primary}`} />
          <h1 className={`text-xl md:text-2xl font-bold ${settings.colors.primary}`}>
            {settings.siteName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={onPromotionsClick}
            className="relative p-2 rounded-full hover:bg-slate-700 transition-colors duration-300"
            aria-label="Special Offers"
          >
            <GiftIcon className={`w-7 h-7 ${settings.colors.text}`} />
            {settings.promotionalAds && settings.promotionalAds.length > 0 && (
              <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-slate-800"></span>
            )}
          </button>
          <button
            onClick={onAboutClick}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-300"
            aria-label="About"
          >
            <InformationCircleIcon className={`w-7 h-7 ${settings.colors.text}`} />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-300"
            aria-label="Open Settings"
          >
            <Cog8ToothIcon className={`w-7 h-7 ${settings.colors.text}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
