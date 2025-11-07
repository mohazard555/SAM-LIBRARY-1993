
import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { settings } = useSettings();
  const { about } = settings;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-lg text-slate-200 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${settings.colors.primary}`}>{about.title}</h2>
            <button onClick={onClose} className="text-3xl text-slate-400 hover:text-white">&times;</button>
        </div>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{about.content}</p>
        <div className="text-right mt-6">
            <button
                onClick={onClose}
                className="px-6 py-2 rounded-md font-semibold bg-slate-700 hover:bg-slate-600 transition-colors duration-300"
            >
                إغلاق
            </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
