
import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { Book } from '../types';

interface AdModalProps {
  book: Book;
  onClose: () => void;
  onAdFinished: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ book, onClose, onAdFinished }) => {
  const { settings } = useSettings();
  const [countdown, setCountdown] = useState(settings.ad.duration);
  const adUrl = book.adUrl || settings.ad.url;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const isAdWatched = countdown <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md text-center text-slate-200 border border-slate-700">
        <h2 className={`text-2xl font-bold mb-2 ${settings.colors.primary}`}>{book.title}</h2>
        <p className="mb-4">لدعم المكتبة، يرجى مشاهدة الإعلان لفتح الكتاب.</p>
        
        <div className="my-6">
          {countdown > 0 ? (
            <div>
              <p className="text-lg">سيتم تفعيل الرابط خلال:</p>
              <p className="text-5xl font-bold my-2 text-sky-400">{countdown}</p>
              <p>ثوانٍ</p>
            </div>
          ) : (
            <p className="text-lg text-green-400">شكرًا لدعمك! يمكنك الآن المتابعة.</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={adUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onAdFinished}
            className={`w-full px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
              !isAdWatched
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600 text-white animate-pulse'
            }`}
            aria-disabled={!isAdWatched}
          >
            الانتقال إلى الإعلان
          </a>
          <button
            onClick={onClose}
            disabled={!isAdWatched}
            className="w-full px-6 py-3 rounded-md font-semibold bg-slate-700 hover:bg-slate-600 transition-colors duration-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdModal;