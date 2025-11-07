import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface PromotionsModalProps {
  onClose: () => void;
}

const PromotionsModal: React.FC<PromotionsModalProps> = ({ onClose }) => {
  const { settings } = useSettings();
  const { promotionalAds, colors } = settings;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl text-slate-200 border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className={`text-2xl font-bold ${colors.primary} flex items-center gap-2`}>
                <span>📢</span>
                العروض الخاصة
            </h2>
            <button onClick={onClose} className="text-3xl text-slate-400 hover:text-white">&times;</button>
        </div>
        
        {(!promotionalAds || promotionalAds.length === 0) ? (
            <p className="text-slate-400 text-center py-8">لا توجد عروض خاصة حالياً.</p>
        ) : (
             <div className="overflow-y-auto space-y-4 pr-2">
                {promotionalAds.map(ad => (
                    <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900/50 block rounded-lg overflow-hidden group transition-transform transform hover:scale-[1.02]">
                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className={`font-bold text-lg ${colors.primary}`}>{ad.title}</h3>
                            <p className="text-slate-400 text-sm">{ad.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        )}

        <div className="text-right mt-6 flex-shrink-0">
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

export default PromotionsModal;
