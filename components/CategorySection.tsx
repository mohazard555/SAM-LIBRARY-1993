import React, { useState } from 'react';
import type { Category, Book } from '../types';
import BookCard from './BookCard';
import { useSettings } from '../context/SettingsContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CategorySectionProps {
  category: Category;
  onBookSelect: (book: Book) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, onBookSelect }) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-8 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h2 
        className={`text-2xl md:text-3xl font-bold flex items-center justify-between gap-3 ${settings.colors.secondary} cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span>{category.emoji}</span>
          <span>{category.title}</span>
        </div>
        <ChevronDownIcon className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </h2>
      {isOpen && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {category.books.map((book) => (
              <BookCard key={book.id} book={book} onBookSelect={onBookSelect} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CategorySection;