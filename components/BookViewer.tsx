
import React from 'react';
import type { Book } from '../types';
import { PrinterIcon } from './icons/PrinterIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';


interface BookViewerProps {
  book: Book;
  onClose: () => void;
}

const BookViewer: React.FC<BookViewerProps> = ({ book, onClose }) => {

  const handleDownload = () => {
    const blob = new Blob([book.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 print:hidden">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col border border-slate-700">
        <header id="book-viewer-header" className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">{book.title}</h2>
            <p className="text-slate-400">{book.author}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Download book">
                <ArrowDownTrayIcon className="h-6 w-6 text-slate-200" />
            </button>
            <button onClick={handlePrint} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Print book">
                <PrinterIcon className="h-6 w-6 text-slate-200" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Close book viewer"
            >
              <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>
        <main id="book-viewer-content" className="p-6 overflow-y-auto flex-grow text-slate-300 leading-loose">
          <p style={{ whiteSpace: 'pre-wrap' }}>{book.content}</p>
        </main>
      </div>
    </div>
  );
};

export default BookViewer;