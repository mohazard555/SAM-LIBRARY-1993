import React from 'react';
import type { Book, ContentPart } from '../types';
import { useSettings } from '../context/SettingsContext';

interface ContentPickerModalProps {
  book: Book;
  onPartSelect: (part: ContentPart) => void;
  onClose: () => void;
}

const ContentPickerModal: React.FC<ContentPickerModalProps> = ({ book, onPartSelect, onClose }) => {
  const { settings } = useSettings();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md text-slate-200 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold ${settings.colors.primary}`}>{book.title}</h2>
            <button onClick={onClose} className="text-3xl text-slate-400 hover:text-white">&times;</button>
        </div>
        <p className="text-slate-400 mb-6">اختر المحتوى الذي ترغب في قراءته:</p>
        <div className="space-y-3 max-h-64 overflow-y-auto">
            {book.parts.map(part => (
                <button
                    key={part.id}
                    onClick={() => onPartSelect(part)}
                    className="w-full text-right p-4 rounded-md font-semibold bg-slate-700 hover:bg-sky-600 transition-colors duration-300"
                >
                    {part.title}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ContentPickerModal;
