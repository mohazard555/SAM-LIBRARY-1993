
import React, { useState, useMemo } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CategorySection from './components/CategorySection';
import AdModal from './components/AdModal';
import BookViewer from './components/BookViewer';
import SettingsPanel from './components/SettingsPanel';
import AboutModal from './components/AboutModal';
import PromotionsModal from './components/PromotionsModal';
import ContentPickerModal from './components/ContentPickerModal';
import type { Book, Category, ContentPart } from './types';

const AppContent: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
  const [bookForContentPicking, setBookForContentPicking] = useState<Book | null>(null);
  const [partForAd, setPartForAd] = useState<{ part: ContentPart; book: Book } | null>(null);
  const [partToRead, setPartToRead] = useState<{ part: ContentPart; book: Book } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBookSelect = (book: Book) => {
    // Increment click count and save to state and localStorage
    setSettings(prevSettings => {
        const newCategories = prevSettings.categories.map(category => ({
            ...category,
            books: category.books.map(b => 
                b.id === book.id ? { ...b, clickCount: (b.clickCount || 0) + 1 } : b
            )
        }));
        const newSettings = { ...prevSettings, categories: newCategories };
        localStorage.setItem('librarySettings', JSON.stringify(newSettings));
        return newSettings;
    });

    if (book.parts.length === 1) {
      setPartForAd({ part: book.parts[0], book });
    } else {
      setBookForContentPicking(book);
    }
  };

  const handlePartSelect = (part: ContentPart) => {
    if (bookForContentPicking) {
      setPartForAd({ part, book: bookForContentPicking });
    }
    setBookForContentPicking(null);
  };

  const closeAdModal = () => {
    setPartForAd(null);
  };

  const handleAdFinished = () => {
    if (partForAd) {
      setPartToRead(partForAd);
    }
    setPartForAd(null);
  };
  
  const closeBookViewer = () => {
    setPartToRead(null);
  };
  
  const { filteredCategories, totalBooks } = useMemo(() => {
    const total = settings.categories.reduce((acc, category) => acc + category.books.length, 0);
    if (!searchQuery) {
        return { filteredCategories: settings.categories, totalBooks: total };
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    
    const filtered = settings.categories.map(category => {
        const filteredBooks = category.books.filter(book => 
            book.title.toLowerCase().includes(lowercasedQuery) ||
            book.author.toLowerCase().includes(lowercasedQuery)
        );
        return { ...category, books: filteredBooks };
    }).filter(category => category.books.length > 0);

    return { filteredCategories: filtered, totalBooks: total };
  }, [searchQuery, settings.categories]);

  return (
    <div className={`${settings.colors.background} ${settings.colors.text} min-h-screen font-['Cairo'] transition-colors duration-500`}>
      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        onAboutClick={() => setIsAboutOpen(true)}
        onPromotionsClick={() => setIsPromotionsOpen(true)}
        totalBooks={totalBooks}
      />
      
      <main className="container mx-auto px-6 md:px-10 py-8">
        <div className="mb-8 max-w-2xl mx-auto">
            <input 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن كتاب أو مؤلف..."
                className="w-full p-4 rounded-full bg-slate-800 border-2 border-slate-700 text-lg text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
        </div>

        <div className="space-y-6">
            {filteredCategories.length > 0 ? filteredCategories.map(category => (
            <CategorySection key={category.id} category={category} onBookSelect={handleBookSelect} />
            )) : (
                <div className="text-center py-16">
                    <p className="text-2xl text-slate-400">لم يتم العثور على نتائج بحث.</p>
                </div>
            )}
        </div>
      </main>
      
      <Footer />
      
      {bookForContentPicking && (
        <ContentPickerModal
          book={bookForContentPicking}
          onClose={() => setBookForContentPicking(null)}
          onPartSelect={handlePartSelect}
        />
      )}

      {partForAd && (
        <AdModal 
          part={partForAd.part}
          bookTitle={partForAd.book.title}
          onClose={closeAdModal} 
          onAdFinished={handleAdFinished} 
        />
      )}
      
      {partToRead && (
        <BookViewer 
          book={{ title: partToRead.book.title, author: partToRead.book.author }}
          part={partToRead.part}
          onClose={closeBookViewer} 
        />
      )}

      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
      {isPromotionsOpen && <PromotionsModal onClose={() => setIsPromotionsOpen(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
