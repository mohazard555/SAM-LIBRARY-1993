import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { ContentPart } from '../types';

interface AdModalProps {
  part: ContentPart;
  bookTitle: string;
  onClose: () => void;
  onAdFinished: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ part, bookTitle, onClose, onAdFinished }) => {
  const { settings } = useSettings();

  const adConfig = useMemo(() => {
    const getRandomItem = (arr: string[] | undefined): string | undefined => {
      if (!arr || arr.length === 0) return undefined;
      const filteredArr = arr.filter(item => item && item.trim() !== '');
      if (filteredArr.length === 0) return undefined;
      return filteredArr[Math.floor(Math.random() * filteredArr.length)];
    };
    
    const watchUrl = part.watchUrl || getRandomItem(settings.ad.youtubeUrls);
    const adUrl = part.adUrl || getRandomItem(settings.ad.urlList) || settings.ad.url;

    return {
      duration: part.adDuration ?? settings.ad.duration,
      watchUrl: watchUrl,
      adUrl: adUrl,
    };
  }, [part, settings]);


  const [countdown, setCountdown] = useState(adConfig.duration);
  const [countdownStarted, setCountdownStarted] = useState(!adConfig.watchUrl);

  useEffect(() => {
    if (countdown > 0 && countdownStarted) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, countdownStarted]);

  const handleWatchClick = () => {
    if (adConfig.watchUrl) {
      window.open(adConfig.watchUrl, '_blank', 'noopener,noreferrer');
    }
    setCountdownStarted(true);
  };

  const isAdWatched = countdown <= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md text-center text-slate-200 border border-slate-700">
        <h2 className={`text-2xl font-bold mb-1 ${settings.colors.primary}`}>{bookTitle}</h2>
        <p className="mb-4 text-slate-400">{part.title}</p>
        
        {!countdownStarted && adConfig.watchUrl ? (
          <>
            <p className="my-6">لدعم المكتبة، يرجى مشاهدة الفيديو أولاً لفتح المحتوى.</p>
            <button
              onClick={handleWatchClick}
              className="w-full px-6 py-3 rounded-md font-semibold transition-all duration-300 bg-red-600 hover:bg-red-700 text-white"
            >
              مشاهدة الفيديو المطلوب
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">لدعم المكتبة، يرجى الانتظار ثم الانتقال للإعلان لفتح المحتوى.</p>
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
          </>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <a
            href={adConfig.adUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onAdFinished}
            className={`w-full px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
              !isAdWatched
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600 text-white animate-pulse'
            }`}
            aria-disabled={!isAdWatched}
            style={{ pointerEvents: isAdWatched ? 'auto' : 'none' }}
          >
            الانتقال إلى الإعلان
          </a>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-md font-semibold bg-slate-700 hover:bg-slate-600 transition-colors duration-300"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdModal;