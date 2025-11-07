import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { AppSettings } from '../types';

const initialBooks = {
  arabic: [
    { 
      id: 'ar1', 
      title: 'ثلاثية غرناطة', 
      author: 'رضوى عاشور', 
      coverColor: 'bg-teal-100', 
      parts: [
        { id: 'ar1p1', title: 'الجزء الأول: غرناطة', watchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', adUrl: 'https://example.com/ad-granada', content: 'محتوى الجزء الأول من رواية ثلاثية غرناطة...' },
        { id: 'ar1p2', title: 'الجزء الثاني: مريمة', adUrl: 'https://example.com/ad-mariam', content: 'محتوى الجزء الثاني...' },
        { id: 'ar1p3', title: 'الجزء الثالث: الرحيل', adUrl: 'https://example.com/ad-departure', content: 'محتوى الجزء الثالث...' },
      ] 
    },
    { 
      id: 'ar2', 
      title: 'أولاد حارتنا', 
      author: 'نجيب محفوظ', 
      coverColor: 'bg-amber-100', 
      parts: [
        { id: 'ar2p1', title: 'قراءة الرواية', adUrl: '', content: 'محتوى رواية أولاد حارتنا...' }
      ]
    },
  ],
  world: [
    { 
      id: 'en1', 
      title: 'مئة عام من العزلة', 
      author: 'غابرييل غارسيا ماركيز', 
      coverColor: 'bg-purple-100', 
      parts: [
        { id: 'en1p1', title: 'قراءة الرواية', adUrl: '', content: 'محتوى رواية مئة عام من العزلة...' }
      ]
    },
  ],
  children: [
    { 
      id: 'ch1', 
      title: 'مغامرات سندباد', 
      author: 'تراث', 
      coverColor: 'bg-green-100', 
      parts: [
        { id: 'ch1p1', title: 'قراءة القصة', adUrl: '', content: 'محتوى قصة مغامرات سندباد...' }
      ] 
    },
  ],
  romance: [
    { 
      id: 'ro1', 
      title: 'كبرياء وهوى', 
      author: 'جين أوستن', 
      coverColor: 'bg-pink-100', 
      parts: [
        { id: 'ro1p1', title: 'قراءة الرواية', adUrl: '', content: 'محتوى رواية كبرياء وهوى...' }
      ]
    },
  ],
  mystery: [
    { 
      id: 'my1', 
      title: 'جريمة في قطار الشرق', 
      author: 'أجاثا كريستي', 
      coverColor: 'bg-gray-200', 
      parts: [
        { id: 'my1p1', title: 'قراءة الرواية', adUrl: '', content: 'محتوى رواية جريمة في قطار الشرق...' }
      ]
    },
  ],
  dev: [
    { 
      id: 'dv1', 
      title: 'العادات السبع للناس الأكثر فعالية', 
      author: 'ستيفن كوفي', 
      coverColor: 'bg-sky-100', 
      parts: [
        { id: 'dv1p1', title: 'قراءة الكتاب', adUrl: '', content: 'محتوى كتاب العادات السبع...' }
      ]
    },
  ],
};

const DEFAULT_SETTINGS: AppSettings = {
  siteName: "مكتبة الحكايات",
  colors: {
    background: "bg-slate-900",
    text: "text-slate-200",
    primary: "text-amber-400",
    secondary: "text-sky-400",
    cardBg: "bg-slate-800",
  },
  ad: {
    url: "https://google.com",
    duration: 20,
  },
  developer: {
    name: "مطور عربي",
    email: "dev@arabcode.com",
    copyright: "جميع الحقوق محفوظة © مكتبة الحكايات 2025",
  },
  categories: [
    { id: 'c1', title: 'الروايات العربية', emoji: '📚', books: initialBooks.arabic },
    { id: 'c2', title: 'الروايات العالمية', emoji: '🌍', books: initialBooks.world },
    { id: 'c3', title: 'قصص الأطفال', emoji: '🧒', books: initialBooks.children },
    { id: 'c4', title: 'الأدب الرومانسي', emoji: '💖', books: initialBooks.romance },
    { id: 'c5', title: 'الغموض والخيال', emoji: '🕵️‍♂️', books: initialBooks.mystery },
    { id: 'c6', 'title': 'التنمية البشرية', emoji: '🧠', books: initialBooks.dev },
  ],
  promotionalAds: [
    { id: 'p1', imageUrl: 'https://placehold.co/600x300/0ea5e9/ffffff?text=إعلان+ترويجي', title: 'عرض خاص', description: 'اكتشف مجموعتنا الجديدة من كتب الخيال العلمي بخصم 20%!', linkUrl: '#' },
    { id: 'p2', imageUrl: 'https://placehold.co/600x300/f59e0b/ffffff?text=كتاب+الشهر', title: 'رواية الشهر', description: 'انضم لآلاف القراء واستمتع بالرواية الأكثر مبيعاً هذا الشهر.', linkUrl: '#' }
  ],
  about: {
    title: "حول مكتبة الحكايات",
    content: "مكتبة الحكايات هي منصة عربية تهدف إلى نشر المعرفة وتشجيع القراءة عبر توفير مجموعة واسعة من الكتب والروايات من مختلف الثقافات والعصور. نحن نؤمن بأن القراءة هي نافذة تطل على عوالم جديدة، ونسعى لجعل هذه التجربة متاحة وممتعة للجميع.\n\nندعم استمرارية الموقع من خلال نموذج إعلاني بسيط لا يؤثر على تجربة المستخدم، مما يتيح لنا تقديم المحتوى مجاناً. شكراً لدعمكم!"
  },
  gistSync: {
    rawUrl: "",
    token: ""
  }
};

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};