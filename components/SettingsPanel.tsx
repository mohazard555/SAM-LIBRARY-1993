
import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { AppSettings, Book, Category, PromotionalAd } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface SettingsPanelProps {
  onClose: () => void;
}

const colorOptions = [
    { name: 'رمادي فاتح', value: 'bg-slate-100' },
    { name: 'أحمر فاتح', value: 'bg-red-100' },
    { name: 'برتقالي فاتح', value: 'bg-orange-100' },
    { name: 'كهرماني فاتح', value: 'bg-amber-100' },
    { name: 'أصفر فاتح', value: 'bg-yellow-100' },
    { name: 'ليموني فاتح', value: 'bg-lime-100' },
    { name: 'أخضر فاتح', value: 'bg-green-100' },
    { name: 'زمردي فاتح', value: 'bg-emerald-100' },
    { name: 'تركواز فاتح', value: 'bg-teal-100' },
    { name: 'سماوي فاتح', value: 'bg-sky-100' },
    { name: 'أزرق فاتح', value: 'bg-blue-100' },
    { name: 'نيلي فاتح', value: 'bg-indigo-100' },
    { name: 'بنفسجي فاتح', value: 'bg-violet-100' },
    { name: 'أرجواني فاتح', value: 'bg-purple-100' },
    { name: 'فوشي فاتح', value: 'bg-fuchsia-100' },
    { name: 'وردي فاتح', value: 'bg-pink-100' },
    { name: 'وردي داكن فاتح', value: 'bg-rose-100' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, setSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  
  const [categoriesJson, setCategoriesJson] = useState(JSON.stringify(settings.categories, null, 2));

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');

  const [selectedBookKey, setSelectedBookKey] = useState('');
  const [bookEditForm, setBookEditForm] = useState<{title: string; author: string; coverColor: string} | null>(null);

  const [newPromoAd, setNewPromoAd] = useState<Omit<PromotionalAd, 'id'>>({ title: '', description: '', imageUrl: '', linkUrl: '' });
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    coverColor: 'bg-slate-100',
    categoryId: '',
    content: '',
    partTitle: 'قراءة الرواية',
  });

  useEffect(() => {
    setCategoriesJson(JSON.stringify(localSettings.categories, null, 2));
  }, [localSettings.categories]);

  useEffect(() => {
    if (selectedBookKey) {
        const [catIndex, bookIndex] = selectedBookKey.split('-').map(Number);
        const book = localSettings.categories[catIndex]?.books[bookIndex];
        if (book) {
            setBookEditForm({
                title: book.title,
                author: book.author,
                coverColor: book.coverColor
            });
        }
    } else {
        setBookEditForm(null);
    }
  }, [selectedBookKey, localSettings.categories]);


  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    ...keys: string[]
) => {
    const { value } = e.target;
    setLocalSettings(prev => {
        const newState = JSON.parse(JSON.stringify(prev)); // Deep copy for nested objects
        let currentLevel: any = newState;
        
        for (let i = 0; i < keys.length - 1; i++) {
            currentLevel = currentLevel[keys[i]];
        }
        
        currentLevel[keys[keys.length - 1]] = value;
        return newState;
    });
};

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCategoriesJson(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 2 ميجابايت.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const applyJsonToSettings = () => {
    try {
      const parsedCategories = JSON.parse(categoriesJson);
      if (Array.isArray(parsedCategories)) {
        setLocalSettings(prev => ({ ...prev, categories: parsedCategories }));
        alert('تم تحديث الأقسام بنجاح!');
      } else {
        throw new Error("Invalid format: Must be an array of categories.");
      }
    } catch (error) {
      alert('خطأ في تنسيق JSON. يرجى التحقق منه والمحاولة مرة أخرى.');
      console.error("JSON parsing error:", error);
    }
  };
  
  const handleFindAndReplace = () => {
      if (!findText) {
          alert("يرجى إدخال النص المراد البحث عنه.");
          return;
      }
      const updatedCategoriesJson = categoriesJson.replaceAll(findText, replaceText);
      setCategoriesJson(updatedCategoriesJson);
      alert(`تم استبدال "${findText}" بـ "${replaceText}" في جميع المحتويات.`);
  };

  const handleAddCategory = () => {
      if (!newCategoryTitle || !newCategoryEmoji) {
          alert('يرجى إدخال عنوان ورمز تعبيري للقسم الجديد.');
          return;
      }
      const newCategory: Category = {
          id: `c${Date.now()}`,
          title: newCategoryTitle,
          emoji: newCategoryEmoji,
          books: []
      };
      const updatedCategories = [...localSettings.categories, newCategory];
      setLocalSettings(prev => ({ ...prev, categories: updatedCategories }));
      setNewCategoryTitle('');
      setNewCategoryEmoji('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    if(!categoryId) return;
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا القسم وجميع الكتب الموجودة فيه؟")) {
        const updatedCategories = localSettings.categories.filter(cat => cat.id !== categoryId);
        setLocalSettings(prev => ({ ...prev, categories: updatedCategories }));
    }
  };

  const handleSave = () => {
    try {
      const parsedCategories = JSON.parse(categoriesJson);
      if (Array.isArray(parsedCategories)) {
        const finalSettings = {...localSettings, categories: parsedCategories};
        setSettings(finalSettings);
        localStorage.setItem('librarySettings', JSON.stringify(finalSettings));
        alert('تم حفظ الإعدادات بنجاح!');
        onClose();
      } else {
         throw new Error("Invalid JSON format for categories.");
      }
    } catch (error) {
       alert('خطأ في تنسيق JSON الخاص بالأقسام. يرجى التحقق منه والمحاولة مرة أخرى قبل الحفظ.');
    }
  };
  
  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة الإعدادات إلى الوضع الافتراضي؟ سيتم فقدان جميع التغييرات.')) {
        localStorage.removeItem('librarySettings');
        window.location.reload();
    }
  };

  const handleAddPromoAd = () => {
      if (!newPromoAd.title || !newPromoAd.imageUrl || !newPromoAd.linkUrl) {
          alert('يرجى ملء حقول العنوان والصورة والرابط المستهدف للإعلان.');
          return;
      }
      const adToAdd: PromotionalAd = { ...newPromoAd, id: `p${Date.now()}` };
      setLocalSettings(prev => ({
          ...prev,
          promotionalAds: [...prev.promotionalAds, adToAdd]
      }));
      setNewPromoAd({ title: '', description: '', imageUrl: '', linkUrl: '' });
  };

  const handleDeletePromoAd = (adId: string) => {
      setLocalSettings(prev => ({
          ...prev,
          promotionalAds: prev.promotionalAds.filter(ad => ad.id !== adId)
      }));
  };

  const handleBookEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (bookEditForm) {
          setBookEditForm({
              ...bookEditForm,
              [e.target.name]: e.target.value
          });
      }
  };

  const handleUpdateBook = () => {
      if (!selectedBookKey || !bookEditForm) return;
      const [catIndex, bookIndex] = selectedBookKey.split('-').map(Number);
      
      setLocalSettings(prev => {
        const updatedCategories = [...prev.categories];
        const bookToUpdate = updatedCategories[catIndex].books[bookIndex];
        
        updatedCategories[catIndex].books[bookIndex] = {
            ...bookToUpdate,
            title: bookEditForm.title,
            author: bookEditForm.author,
            coverColor: bookEditForm.coverColor
        };
        return { ...prev, categories: updatedCategories };
      });
      alert('تم تحديث معلومات الحكاية بنجاح.');
  };
  
  const handleDeleteBook = () => {
      if (!selectedBookKey) return;
      if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الحكاية؟')) {
          const [catIndex, bookIndex] = selectedBookKey.split('-').map(Number);
          setLocalSettings(prev => {
              const updatedCategories = [...prev.categories];
              updatedCategories[catIndex].books.splice(bookIndex, 1);
              return { ...prev, categories: updatedCategories };
          });
          setSelectedBookKey('');
      }
  };

  const handleNewBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.categoryId || !newBook.content) {
        alert('يرجى ملء جميع حقول الحكاية الجديدة.');
        return;
    }

    const newBookObject: Book = {
        id: `b${Date.now()}`,
        title: newBook.title,
        author: newBook.author,
        coverColor: newBook.coverColor,
        clickCount: 0,
        parts: [
            {
                id: `p${Date.now()}`,
                title: newBook.partTitle || 'الجزء الأول',
                adUrl: '',
                content: newBook.content
            }
        ]
    };

    setLocalSettings(prev => {
        const updatedCategories = prev.categories.map(cat => {
            if (cat.id === newBook.categoryId) {
                return { ...cat, books: [...cat.books, newBookObject] };
            }
            return cat;
        });
        return { ...prev, categories: updatedCategories };
    });

    alert(`تمت إضافة حكاية "${newBook.title}" بنجاح!`);
    setNewBook({
        title: '', author: '', coverColor: 'bg-slate-100', categoryId: '', content: '', partTitle: 'قراءة الرواية',
    });
  };
  
  const handleExportSettings = () => {
    try {
        const settingsJson = JSON.stringify(localSettings, null, 2);
        const blob = new Blob([settingsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'library-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export settings:", error);
        alert("فشل تصدير الإعدادات.");
    }
  };

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const result = event.target?.result;
              if (typeof result === 'string') {
                  const importedSettings = JSON.parse(result);
                  if (importedSettings.siteName && Array.isArray(importedSettings.categories)) {
                      setLocalSettings(importedSettings);
                      alert("تم استيراد الإعدادات بنجاح. لا تنسَ الحفظ.");
                  } else {
                      throw new Error("Invalid settings file format.");
                  }
              }
          } catch (error) {
              console.error("Failed to import settings:", error);
              alert("فشل استيراد الإعدادات. تأكد من أن الملف بصيغة JSON صحيحة.");
          }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset file input
  };
  
  const handleFetchFromGist = async () => {
      const { rawUrl } = localSettings.gistSync;
      if (!rawUrl) {
          alert("يرجى إدخال رابط Gist Raw URL أولاً.");
          return;
      }
      try {
          const response = await fetch(rawUrl, { cache: 'no-store' });
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.siteName && Array.isArray(data.categories)) {
              setLocalSettings(data);
              alert("تم جلب الإعدادات من Gist بنجاح. لا تنسَ الحفظ.");
          } else {
              throw new Error("Invalid settings format in Gist.");
          }
      } catch (error) {
          console.error("Failed to fetch from Gist:", error);
          alert("فشل جلب الإعدادات من Gist. تحقق من الرابط وصلاحيات الوصول.");
      }
  };

  const handleSaveToGist = async () => {
      const { rawUrl, token } = localSettings.gistSync;
      if (!rawUrl || !token) {
          alert("يرجى إدخال رابط Gist Raw URL والتوكن الشخصي.");
          return;
      }

      const match = rawUrl.match(/gist\.githubusercontent\.com\/[^\/]+\/([a-f0-9]+)\/raw\/[^\/]+\/(.*)/);
      if (!match) {
          alert("صيغة Gist Raw URL غير صالحة. لا يمكن استخراج Gist ID واسم الملف.");
          return;
      }
      const gistId = match[1];
      const filename = match[2];

      try {
          const response = await fetch(`https://api.github.com/gists/${gistId}`, {
              method: 'PATCH',
              headers: {
                  'Authorization': `token ${token}`,
                  'Accept': 'application/vnd.github.v3+json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  files: {
                      [filename]: {
                          content: JSON.stringify(localSettings, null, 2),
                      },
                  },
              }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`GitHub API error: ${errorData.message}`);
          }

          alert("تم حفظ الإعدادات في Gist بنجاح!");

      } catch (error) {
          console.error("Failed to save to Gist:", error);
          alert(`فشل الحفظ إلى Gist. تحقق من التوكن والصلاحيات. قد تكون هناك مشكلة في CORS. \n${error}`);
      }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col border border-slate-700">
        <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-amber-400">لوحة الإعدادات</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <main className="p-6 overflow-y-auto flex-grow text-slate-300">
          <div className="space-y-8">
            <div className="p-4 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-sky-400">الإعدادات العامة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="siteName" className="mb-1 text-slate-400">اسم الموقع</label>
                  <input type="text" id="siteName" value={localSettings.siteName} onChange={(e) => handleSettingsChange(e, 'siteName')} className="bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-400">شعار الموقع</label>
                    <div className="flex items-center gap-4">
                        {localSettings.siteLogoUrl && <img src={localSettings.siteLogoUrl} alt="logo preview" className="w-12 h-12 object-contain bg-slate-700 rounded-md p-1" />}
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setLocalSettings(prev => ({...prev, siteLogoUrl: base64})))} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700"/>
                    </div>
                    <input type="text" placeholder="أو الصق رابط شعار هنا" value={localSettings.siteLogoUrl.startsWith('data:image') ? '' : localSettings.siteLogoUrl} onChange={(e) => handleSettingsChange(e, 'siteLogoUrl')} className="bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 text-sm" />
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-sky-400">المزامنة والنسخ الاحتياطي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-amber-400">مزامنة Gist</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="رابط Gist Raw URL" value={localSettings.gistSync.rawUrl} onChange={(e) => handleSettingsChange(e, 'gistSync', 'rawUrl')} className="bg-slate-800 border border-slate-600 rounded-md p-2"/>
                    <input type="password" placeholder="GitHub Personal Access Token" value={localSettings.gistSync.token} onChange={(e) => handleSettingsChange(e, 'gistSync', 'token')} className="bg-slate-800 border border-slate-600 rounded-md p-2"/>
                    <div className="flex gap-2">
                      <button onClick={handleFetchFromGist} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">جلب من Gist</button>
                      <button onClick={handleSaveToGist} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">حفظ إلى Gist</button>
                    </div>
                     <p className="text-xs text-slate-500">ملاحظة: يتطلب الحفظ إلى Gist توكن وصول شخصي بصلاحية 'gist'. احذر من استخدام هذه الميزة في بيئة عامة.</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-amber-400">نسخ احتياطي محلي</h4>
                  <div className="flex flex-col gap-3">
                    <button onClick={handleExportSettings} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
                      تصدير الإعدادات (JSON)
                    </button>
                    <div>
                      <label htmlFor="import-settings" className="w-full block text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer">
                          استيراد الإعدادات (JSON)
                      </label>
                      <input id="import-settings" type="file" accept=".json" onChange={handleImportSettings} className="hidden" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border border-slate-700 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-sky-400">إدارة الحكايات وإعلاناتها</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Add new book column */}
                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-md space-y-3">
                        <h4 className="text-lg font-semibold text-amber-400">إضافة حكاية جديدة</h4>
                        <input type="text" name="title" value={newBook.title} onChange={handleNewBookChange} placeholder="عنوان الحكاية" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                        <input type="text" name="author" value={newBook.author} onChange={handleNewBookChange} placeholder="المؤلف" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                        <select name="coverColor" value={newBook.coverColor} onChange={handleNewBookChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
                           {colorOptions.map(color => (
                                <option key={color.value} value={color.value}>{color.name}</option>
                           ))}
                        </select>
                        <select name="categoryId" value={newBook.categoryId} onChange={handleNewBookChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
                            <option value="">-- اختر القسم --</option>
                            {localSettings.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                        </select>
                        <input type="text" name="partTitle" value={newBook.partTitle} onChange={handleNewBookChange} placeholder="عنوان الجزء الأول" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                        <textarea name="content" value={newBook.content} onChange={handleNewBookChange} placeholder="محتوى الحكاية" className="w-full h-24 bg-slate-700 border border-slate-600 rounded-md p-2"></textarea>
                        <button onClick={handleAddBook} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">إضافة الحكاية</button>
                    </div>
                    {/* Edit/Delete book column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-amber-400">تعديل أو حذف حكاية</h4>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="book-select" className="block mb-1 text-slate-400">اختر الحكاية:</label>
                                <select id="book-select" value={selectedBookKey} onChange={e => setSelectedBookKey(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2">
                                    <option value="">-- اختر حكاية للتعديل --</option>
                                    {localSettings.categories.map((cat, catIndex) => (
                                        <optgroup label={cat.title} key={cat.id}>
                                            {cat.books.map((book, bookIndex) => (
                                                <option key={book.id} value={`${catIndex}-${bookIndex}`}>{book.title}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            {bookEditForm && (
                                <div className="p-3 bg-slate-800/50 border border-slate-600 rounded-md space-y-3">
                                    <input type="text" name="title" value={bookEditForm.title} onChange={handleBookEditChange} placeholder="عنوان الحكاية" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                                    <input type="text" name="author" value={bookEditForm.author} onChange={handleBookEditChange} placeholder="المؤلف" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2"/>
                                    <select name="coverColor" value={bookEditForm.coverColor} onChange={handleBookEditChange} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2">
                                        {colorOptions.map(color => (
                                            <option key={color.value} value={color.value}>{color.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={handleUpdateBook} className="flex-grow bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors">تحديث</button>
                                        <button onClick={handleDeleteBook} className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded transition-colors"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Promo Ads Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2 text-amber-400">إدارة الإعلانات الترويجية</h4>
                        <div className="p-3 bg-slate-800/50 border border-slate-600 rounded-md space-y-3 mb-4">
                            <input type="text" value={newPromoAd.title} onChange={e => setNewPromoAd({...newPromoAd, title: e.target.value})} placeholder="العنوان" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                            <input type="text" value={newPromoAd.description} onChange={e => setNewPromoAd({...newPromoAd, description: e.target.value})} placeholder="الوصف" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                            <div className="flex items-center gap-2">
                                {newPromoAd.imageUrl && <img src={newPromoAd.imageUrl} alt="preview" className="w-10 h-10 object-cover rounded-sm"/>}
                                <label className="w-full text-center bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer">
                                  <span>اختيار صورة</span>
                                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (base64) => setNewPromoAd(prev => ({...prev, imageUrl: base64})))} className="hidden" />
                                </label>
                            </div>
                            <input type="text" value={newPromoAd.linkUrl} onChange={e => setNewPromoAd({...newPromoAd, linkUrl: e.target.value})} placeholder="رابط الانتقال (URL)" className="w-full bg-slate-700 border border-slate-600 rounded-md p-2" />
                            <button onClick={handleAddPromoAd} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">إضافة إعلان</button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {localSettings.promotionalAds.map(ad => (
                            <div key={ad.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <img src={ad.imageUrl} alt={ad.title} className="w-10 h-10 object-cover rounded-sm flex-shrink-0" />
                                    <p className="truncate text-sm">{ad.title}</p>
                                </div>
                                <button onClick={() => handleDeletePromoAd(ad.id)} className="p-1 text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                          ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-sky-400">محرر المحتوى المتقدم (JSON)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-slate-400">إضافة قسم جديد</label>
                  <div className="flex gap-2">
                      <input type="text" value={newCategoryTitle} onChange={e => setNewCategoryTitle(e.target.value)} placeholder="عنوان القسم" className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2"/>
                      <input type="text" value={newCategoryEmoji} onChange={e => setNewCategoryEmoji(e.target.value)} placeholder="Emoji" className="w-20 bg-slate-800 border border-slate-600 rounded-md p-2"/>
                      <button onClick={handleAddCategory} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors">إضافة</button>
                  </div>
                </div>
                <div>
                   <label className="block mb-1 text-slate-400">حذف قسم</label>
                   <select defaultValue="" onChange={e => handleDeleteCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2">
                     <option value="">-- اختر قسماً للحذف --</option>
                     {localSettings.categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                   </select>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <input type="text" value={findText} onChange={e => setFindText(e.target.value)} placeholder="بحث عن..." className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2"/>
                <input type="text" value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="استبدال بـ..." className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2"/>
                <button onClick={handleFindAndReplace} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors">استبدال الكل</button>
              </div>
              <textarea value={categoriesJson} onChange={handleJsonChange} className="w-full h-64 bg-slate-950 border border-slate-600 rounded-md p-2 font-mono text-sm" spellCheck="false"></textarea>
              <button onClick={applyJsonToSettings} className="mt-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors">تطبيق تغييرات JSON على الإعدادات</button>
            </div>
          </div>
        </main>
        
        <footer className="p-4 flex justify-between items-center border-t border-slate-700 flex-shrink-0">
          <button onClick={handleReset} className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">إعادة تعيين الكل</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded transition-colors">إلغاء</button>
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">حفظ الإعدادات</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPanel;
