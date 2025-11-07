import React from 'react';
import type { Book } from '../types';
import { useSettings } from '../context/SettingsContext';
import { EyeIcon } from './icons/EyeIcon';

interface BookCardProps {
  book: Book;
  onBookSelect: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBookSelect }) => {
  const { settings } = useSettings();

  return (
    <div
      onClick={() => onBookSelect(book)}
      className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ${book.coverColor} text-gray-800 flex flex-col justify-between h-36`}
    >
      <h3 className="font-bold text-lg text-right">{book.title}</h3>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-600 text-left">{book.author}</p>
        <div className="flex items-center gap-1 text-sm text-gray-600" title="عدد المشاهدات">
            <EyeIcon className="w-4 h-4" />
            <span>{book.clickCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;