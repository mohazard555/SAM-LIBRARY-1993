
import React from 'react';
import type { Book } from '../types';
import { useSettings } from '../context/SettingsContext';

interface BookCardProps {
  book: Book;
  onBookSelect: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBookSelect }) => {
  const { settings } = useSettings();

  return (
    <div
      onClick={() => onBookSelect(book)}
      className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ${book.coverColor} text-gray-800 flex flex-col justify-between h-32`}
    >
      <h3 className="font-bold text-lg text-right">{book.title}</h3>
      <p className="text-sm text-gray-600 text-left">{book.author}</p>
    </div>
  );
};

export default BookCard;