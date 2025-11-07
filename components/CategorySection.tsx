
import React from 'react';
import type { Category, Book } from '../types';
import BookCard from './BookCard';
import { useSettings } from '../context/SettingsContext';

interface CategorySectionProps {
  category: Category;
  onBookSelect: (book: Book) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, onBookSelect }) => {
  const { settings } = useSettings();

  return (
    <section className="mb-12">
      <h2 className={`text-3xl font-bold mb-6 flex items-center gap-3 ${settings.colors.secondary}`}>
        <span>{category.emoji}</span>
        {category.title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {category.books.map((book) => (
          <BookCard key={book.id} book={book} onBookSelect={onBookSelect} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
