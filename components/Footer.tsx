
import React from 'react';
import { useSettings } from '../context/SettingsContext';
import Logo from './icons/Logo';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { developer, siteName, colors } = settings;

  return (
    <footer className="bg-slate-950/50 text-slate-400 mt-12 py-8 px-6">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Logo className={`w-8 h-8 ${colors.primary}`} />
          <p className="font-bold text-lg text-slate-300">{siteName}</p>
        </div>
        <div className="flex justify-center items-center gap-x-4 gap-y-2 flex-wrap mb-4">
          <p>
            <span className="font-semibold">المطور:</span> {developer.name}
          </p>
          <p>
            <span className="font-semibold">البريد الإلكتروني:</span>{' '}
            <a href={`mailto:${developer.email}`} className="hover:text-sky-400 transition-colors">
              {developer.email}
            </a>
          </p>
        </div>
        <p className="text-sm">{developer.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
