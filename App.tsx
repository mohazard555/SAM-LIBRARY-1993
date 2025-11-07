
import React, { useState, useMemo } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CategorySection from './components/CategorySection';
import AdModal from './components/AdModal';
import BookViewer from './components/BookViewer';
import SettingsPanel from './components/SettingsPanel';
import AboutModal from './components/AboutModal';
import type { Book, Category } from './types';

const PromotionalAdSection: React.FC = () => {
    const { settings } = useSettings();
    if (!settings.promotionalAds || settings.promotionalAds.length === 0) {
        return null;
    }

    return (
        <section className="mb-10">
            <h2 className={`text-3xl font-bold mb-6 flex items-center gap-3 ${settings.colors.secondary}`}>
                <span>📢</span>
                عروض خاصة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.promotionalAds.map(ad => (
                    <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-800 rounded-lg overflow-hidden group transition-transform transform hover:scale-105">
                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-amber-400">{ad.title}</h3>
                            <p className="text-slate-400 text-sm">{ad.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}


const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToRead, setBookToRead] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const closeAdModal = () => {
    setSelectedBook(null);
  };

  const handleAdFinished = () => {
    if (selectedBook) {
        setBookToRead(selectedBook);
    }
    setSelectedBook(null);
  };
  
  const closeBookViewer = () => {
    setBookToRead(null);
  };
  
  const filteredCategories = useMemo(() => {
    if (!searchQuery) {
        return settings.categories;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    
    return settings.categories.map(category => {
        const filteredBooks = category.books.filter(book => 
            book.title.toLowerCase().includes(lowercasedQuery) ||
            book.author.toLowerCase().includes(lowercasedQuery)
        );
        return { ...category, books: filteredBooks };
    }).filter(category => category.books.length > 0);
  }, [searchQuery, settings.categories]);

  return (
    <div className={`${settings.colors.background} ${settings.colors.text} min-h-screen font-['Cairo'] transition-colors duration-500`}>
      <Header onSettingsClick={() => setIsSettingsOpen(true)} onAboutClick={() => setIsAboutOpen(true)} />
      
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

        <PromotionalAdSection />

        {filteredCategories.length > 0 ? filteredCategories.map(category => (
          <CategorySection key={category.id} category={category} onBookSelect={handleBookSelect} />
        )) : (
            <div className="text-center py-16">
                <p className="text-2xl text-slate-400">لم يتم العثور على نتائج بحث.</p>
            </div>
        )}
      </main>
      
      <Footer />
      
      {selectedBook && (
        <AdModal book={selectedBook} onClose={closeAdModal} onAdFinished={handleAdFinished} />
      )}
      
      {bookToRead && (
        <BookViewer book={bookToRead} onClose={closeBookViewer} />
      )}

      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;