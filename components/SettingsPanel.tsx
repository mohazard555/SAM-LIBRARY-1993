import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { AppSettings, Category } from '../types';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, setSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  
  const [categoriesJson, setCategoriesJson] = useState(JSON.stringify(settings.categories, null, 2));
  const [promotionsJson, setPromotionsJson] = useState(JSON.stringify(settings.promotionalAds, null, 2));

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');

  const [selectedBookForAd, setSelectedBookForAd] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: keyof AppSettings, field: string) => {
    const value = e.target.value;
    setLocalSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.type === 'number' ? Number(value) : value
      }
    }));
  };
  
  const handleAddCategory = () => {
    if (!newCategoryTitle || !newCategoryEmoji) {
      alert('يرجى إدخال عنوان وأيقونة للقسم الجديد.');
      return;
    }
    const newCategory: Category = {
      id: `c${Date.now()}`,
      title: newCategoryTitle,
      emoji: newCategoryEmoji,
      books: [],
    };
    const updatedCategories = [...localSettings.categories, newCategory];
    setLocalSettings(prev => ({ ...prev, categories: updatedCategories }));
    setCategoriesJson(JSON.stringify(updatedCategories, null, 2));
    setNewCategoryTitle('');
    setNewCategoryEmoji('');
  };

  const handlePartAdSettingChange = (partIndex: number, field: 'watchUrl' | 'adUrl' | 'adDuration', value: string) => {
    if (!selectedBookForAd) return;
    const [catIndex, bookIndex] = selectedBookForAd.split('-').map(Number);

    setLocalSettings(prevSettings => {
        const newCategories = prevSettings.categories.map((cat, cIdx) => {
            if (cIdx !== catIndex) return cat;
            return {
                ...cat,
                books: cat.books.map((book, bIdx) => {
                    if (bIdx !== bookIndex) return book;
                    return {
                        ...book,
                        parts: book.parts.map((part, pIdx) => {
                            if (pIdx !== partIndex) return part;
                            const finalValue = field === 'adDuration' ? (value === '' ? undefined : Number(value)) : value;
                            return { ...part, [field]: finalValue };
                        })
                    };
                })
            };
        });
        setCategoriesJson(JSON.stringify(newCategories, null, 2));
        return { ...prevSettings, categories: newCategories };
    });
};


  const handleSave = () => {
    try {
      const parsedCategories = JSON.parse(categoriesJson);
      const parsedPromotions = JSON.parse(promotionsJson);
      const newSettings = { ...localSettings, categories: parsedCategories, promotionalAds: parsedPromotions };
      setSettings(newSettings);
      setLocalSettings(newSettings);
      alert('تم حفظ الإعدادات بنجاح!');
      onClose();
    } catch (error) {
      alert('خطأ في تنسيق بيانات JSON. يرجى التحقق من صحة البيانات في قسم الأقسام أو الإعلانات الترويجية.');
      console.error("JSON parsing error:", error);
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(settings, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'settings.json';
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const importedSettings = JSON.parse(text);
            setSettings(importedSettings);
            setLocalSettings(importedSettings);
            setCategoriesJson(JSON.stringify(importedSettings.categories, null, 2));
            setPromotionsJson(JSON.stringify(importedSettings.promotionalAds, null, 2));
            alert('تم استيراد الإعدادات بنجاح!');
          }
        } catch (error) {
          alert('ملف JSON غير صالح أو تالف.');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleReplaceAll = () => {
    if(!findText) {
        alert("يرجى إدخال النص المراد البحث عنه.");
        return;
    }
    const settingsString = JSON.stringify(localSettings);
    const newSettingsString = settingsString.replace(new RegExp(findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replaceText);
    const newSettingsObject = JSON.parse(newSettingsString);
    setLocalSettings(newSettingsObject);
    setCategoriesJson(JSON.stringify(newSettingsObject.categories, null, 2));
    setPromotionsJson(JSON.stringify(newSettingsObject.promotionalAds, null, 2));
    alert(`تم استبدال "${findText}" بـ "${replaceText}" في جميع الإعدادات.`);
  }

  const handleGistSync = async (action: 'load' | 'save') => {
    const { rawUrl, token } = localSettings.gistSync;
    if(!rawUrl || (action === 'save' && !token)) {
      alert("يرجى إدخال رابط Gist Raw URL و Token للمزامنة.");
      return;
    }

    try {
        const urlParts = rawUrl.match(/gist\.githubusercontent\.com\/[^/]+\/([^/]+)\/raw\/(?:[^/]+\/)?(.+)/);
        if (!urlParts || urlParts.length < 3) throw new Error("رابط Gist Raw URL غير صالح.");
        
        const gistId = urlParts[1];
        const filename = urlParts[2];
        const apiUrl = `https://api.github.com/gists/${gistId}`;

        if (action === 'load') {
            const response = await fetch(rawUrl);
            if(!response.ok) throw new Error(`فشل تحميل البيانات: ${response.statusText}`);
            const data = await response.json();
            setSettings(data);
            setLocalSettings(data);
            setCategoriesJson(JSON.stringify(data.categories, null, 2));
            setPromotionsJson(JSON.stringify(data.promotionalAds, null, 2));
            alert("تم تحميل الإعدادات من Gist بنجاح.");
        } else { // save
            const contentToSave = JSON.stringify(localSettings, null, 2);
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    files: {
                        [filename]: {
                            content: contentToSave,
                        },
                    },
                }),
            });
            if(!response.ok) throw new Error(`فشل حفظ البيانات: ${response.statusText}`);
            alert("تم حفظ الإعدادات في Gist بنجاح.");
        }
    } catch(error) {
        alert(`حدث خطأ أثناء المزامنة: ${error.message}`);
        console.error("Gist Sync Error:", error);
    }
  };


  const InputField: React.FC<{label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?:string}> = ({label, value, onChange, type = 'text', placeholder}) => (
    <div>
        <label className="block mb-1 font-semibold text-slate-300">{label}</label>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"/>
    </div>
  )

  const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
     <details className="p-6 bg-slate-800 rounded-lg border border-slate-700" open>
        <summary className="text-xl font-bold text-sky-400 cursor-pointer">{title}</summary>
        <div className="mt-4 border-t border-slate-700 pt-4">
            {children}
        </div>
     </details>
  )
  
  const selectedBookData = selectedBookForAd ? localSettings.categories[Number(selectedBookForAd.split('-')[0])].books[Number(selectedBookForAd.split('-')[1])] : null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 p-4 md:p-8 overflow-y-auto">
      <div className="container mx-auto max-w-4xl text-slate-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-amber-400">لوحة الإعدادات</h2>
            <button onClick={onClose} className="text-3xl text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <div className="space-y-6">
            <Section title="الإعدادات العامة">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <InputField label="اسم الموقع" value={localSettings.siteName} onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})} />
                </div>
            </Section>
            
            <Section title="إدارة البيانات">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleExport} className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-md font-bold transition-colors">تصدير الإعدادات (JSON)</button>
                    <div>
                        <label htmlFor="import-file" className="w-full text-center block p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold transition-colors cursor-pointer">استيراد الإعدادات (JSON)</label>
                        <input id="import-file" type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </div>
                </div>
            </Section>
            
            <Section title="المزامنة عبر الإنترنت (GitHub Gist)">
                 <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      1. الصق Gist Raw URL ليكون مصدر بيانات الموقع.<br/>
                      2. أنشئ Personal Access Token (Classic) من GitHub مع صلاحية `gist` فقط.<br/>
                      3. الصق الـ Token في الحقل الثاني لتمكين الحفظ والمزامنة.
                    </p>
                    <InputField label="رابط Gist Raw للمزامنة" placeholder="https://gist.githubusercontent.com/..." value={localSettings.gistSync.rawUrl} onChange={(e) => handleInputChange(e, 'gistSync', 'rawUrl')} />
                    <InputField label="GitHub Personal Access Token" type="password" placeholder="****************************************" value={localSettings.gistSync.token} onChange={(e) => handleInputChange(e, 'gistSync', 'token')} />
                    <div className="flex gap-4">
                        <button onClick={() => handleGistSync('load')} className="flex-1 p-3 bg-sky-600 hover:bg-sky-700 rounded-md font-bold transition-colors">تحميل من Gist</button>
                        <button onClick={() => handleGistSync('save')} className="flex-1 p-3 bg-purple-600 hover:bg-purple-700 rounded-md font-bold transition-colors">حفظ إلى Gist</button>
                    </div>
                 </div>
            </Section>

            <Section title="استبدال قيم التطبيق">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <InputField label="بحث عن" value={findText} onChange={(e) => setFindText(e.target.value)} />
                    <InputField label="استبدال بـ" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} />
                    <button onClick={handleReplaceAll} className="p-3 bg-red-600 hover:bg-red-700 rounded-md font-bold transition-colors">استبدال الكل</button>
                </div>
            </Section>

            <Section title="إعدادات الإعلان الافتراضي">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="رابط الإعلان (URL)" value={localSettings.ad.url} onChange={(e) => handleInputChange(e, 'ad', 'url')} />
                    <InputField label="مدة المشاهدة (ثواني)" type="number" value={localSettings.ad.duration} onChange={(e) => handleInputChange(e, 'ad', 'duration')} />
                </div>
            </Section>

            <Section title="إعدادات الإعلانات المخصصة للحكايات">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="book-select" className="block mb-1 font-semibold text-slate-300">اختر حكاية لتعديل إعداداتها</label>
                        <select
                            id="book-select"
                            value={selectedBookForAd}
                            onChange={(e) => setSelectedBookForAd(e.target.value)}
                            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                        >
                            <option value="">-- اختر حكاية --</option>
                            {localSettings.categories.map((cat, catIndex) => 
                                cat.books.map((book, bookIndex) => (
                                    <option key={book.id} value={`${catIndex}-${bookIndex}`}>
                                        {cat.title} - {book.title}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    {selectedBookData && (
                        <div className="space-y-4 border-t border-slate-700 pt-4">
                            {selectedBookData.parts.map((part, partIndex) => (
                                <div key={part.id} className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                                    <h4 className="font-bold text-lg text-amber-400 mb-2">{part.title}</h4>
                                    <div className="space-y-2">
                                        <InputField label="رابط المشاهدة (يوتيوب)" placeholder="https://youtube.com/..." value={part.watchUrl || ''} onChange={(e) => handlePartAdSettingChange(partIndex, 'watchUrl', e.target.value)} />
                                        <InputField label="رابط الإعلان النهائي" placeholder={settings.ad.url} value={part.adUrl || ''} onChange={(e) => handlePartAdSettingChange(partIndex, 'adUrl', e.target.value)} />
                                        <InputField label="مدة الإعلان (ثواني)" type="number" placeholder={String(settings.ad.duration)} value={part.adDuration ?? ''} onChange={(e) => handlePartAdSettingChange(partIndex, 'adDuration', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>
            
             <Section title="إضافة قسم جديد">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <InputField label="عنوان القسم" value={newCategoryTitle} onChange={(e) => setNewCategoryTitle(e.target.value)} />
                    <InputField label="أيقونة (Emoji)" value={newCategoryEmoji} onChange={(e) => setNewCategoryEmoji(e.target.value)} />
                    <button onClick={handleAddCategory} className="p-3 bg-green-600 hover:bg-green-700 rounded-md font-bold transition-colors">إضافة قسم</button>
                </div>
            </Section>

            <Section title="معلومات المطور">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="اسم المطور" value={localSettings.developer.name} onChange={(e) => handleInputChange(e, 'developer', 'name')} />
                    <InputField label="البريد الإلكتروني" value={localSettings.developer.email} onChange={(e) => handleInputChange(e, 'developer', 'email')} />
                    <InputField label="نص حقوق النشر" value={localSettings.developer.copyright} onChange={(e) => handleInputChange(e, 'developer', 'copyright')} />
                </div>
            </Section>
            
            <Section title="صفحة 'حول الموقع'">
                 <InputField label="عنوان الصفحة" value={localSettings.about.title} onChange={(e) => setLocalSettings({...localSettings, about: {...localSettings.about, title: e.target.value}})} />
                 <div className="mt-4">
                    <label className="block mb-1 font-semibold text-slate-300">محتوى الصفحة</label>
                    <textarea value={localSettings.about.content} onChange={(e) => setLocalSettings({...localSettings, about: {...localSettings.about, content: e.target.value}})} rows={5} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"></textarea>
                 </div>
            </Section>
            
            <Section title="الإعلانات الترويجية (JSON)">
                <p className="text-sm text-slate-400 mb-4">
                    أضف أو عدّل الإعلانات التي تظهر في الصفحة الرئيسية.
                </p>
                <textarea dir="ltr" className="w-full h-64 p-3 bg-slate-900 border border-slate-600 rounded-md text-green-300 font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" value={promotionsJson} onChange={(e) => setPromotionsJson(e.target.value)} />
            </Section>
            
            <Section title="الأقسام والكتب (JSON)">
                <p className="text-sm text-slate-400 mb-4">
                   يمكنك تعديل الأقسام والكتب. كل كتاب يحتوي على مصفوفة 'parts'. كل جزء له 'id', 'title', 'adUrl', و 'content'.
                </p>
                <textarea dir="ltr" className="w-full h-96 p-3 bg-slate-900 border border-slate-600 rounded-md text-green-300 font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" value={categoriesJson} onChange={(e) => setCategoriesJson(e.target.value)} />
            </Section>
        </div>

        <div className="mt-8 flex justify-end gap-4">
             <button onClick={handleSave} className="px-8 py-3 bg-sky-600 hover:bg-sky-700 rounded-md font-bold transition-colors">حفظ التغييرات</button>
             <button onClick={onClose} className="px-8 py-3 bg-slate-600 hover:bg-slate-700 rounded-md font-bold transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;