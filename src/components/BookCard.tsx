'use client';

import { Book } from '@/types/book';
import { ExternalLink, Star, Circle, Edit } from 'lucide-react';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
}

function CornerSwirl() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 38 C2 20, 8 8, 20 4 C14 10, 10 18, 10 26 C10 16, 16 10, 26 8 C18 12, 14 20, 14 30"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 34 C6 22, 10 14, 18 8"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function BookCard({ book, onEdit }: BookCardProps) {

  const handlePreview = () => {
    if (book.previewLink) {
      window.open(book.previewLink, '_blank');
    }
  };

  return (
    <div className="ornate-card bg-academia-card rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full max-w-[320px]">
      <div className="ornate-inner" />
      <div className="corner-tl"><CornerSwirl /></div>
      <div className="corner-tr"><CornerSwirl /></div>
      <div className="corner-bl"><CornerSwirl /></div>
      <div className="corner-br"><CornerSwirl /></div>

      {/* Book Cover */}
      <div className="w-full h-80 relative bg-gradient-to-br from-[var(--ink)] to-[var(--tobacco)] flex-shrink-0">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-contain p-2"
            unoptimized
            onError={(e) => {
              console.log('Image failed to load:', book.imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-academia-dark border-b border-academia flex items-center justify-center group-hover:border-[var(--umber)]/30 transition-colors duration-300">
            <span className="text-academia-muted text-[1.8rem]">No Cover</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="flex-1 p-4 flex flex-col relative z-[2]">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[2.25rem] text-academia-light group-hover:text-[var(--gold)] transition-colors duration-300 flex-1 pr-2 line-clamp-2">
            {book.title}
          </h3>
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="text-academia-muted hover:text-[var(--gold)] transition-all duration-300 p-1 rounded-lg hover:bg-[var(--umber)]/10 flex-shrink-0"
              title="Edit volume"
            >
              <Edit size={16} />
            </button>
          )}
        </div>

        
        {/* Genre and Status */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="px-2 py-0.5 bg-[var(--mahogany)] text-[var(--umber)] text-[1.2rem] rounded-full border border-[var(--umber)]/30">
            {book.genre}
          </span>
          <span className={`px-2 py-0.5 text-[1.2rem] rounded-full border ${
            book.status === 'read' ? 'bg-[var(--umber)]/20 text-[var(--umber)] border-[var(--umber)]/30' :
            'bg-[var(--brume)]/20 text-[var(--brume)] border-[var(--brume)]/30'
          }`}>
            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
          </span>
          <span className="px-2 py-0.5 bg-[var(--mahogany)] text-academia-sage-green text-[1.2rem] rounded-full border border-[var(--umber)]/30">
            {book.format.charAt(0).toUpperCase() + book.format.slice(1)}
          </span>
        </div>

        {/* Rating */}
        {book.rating && book.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const).map((value) => {
              const isFilled = book.rating! >= value;
              const isWhole = value % 1 === 0;
              const iconClass = `transition-colors duration-300 ${
                isFilled ? 'text-[var(--gold)] fill-current' : 'text-academia-muted'
              }`;
              return isWhole ? (
                <Star key={value} size={14} className={iconClass} />
              ) : (
                <Circle key={value} size={8} className={iconClass} stroke="currentColor" strokeWidth={1.5} />
              );
            })}
            <span className="ml-1.5 text-[1.8rem] text-academia-light">
              {book.rating % 1 === 0 ? book.rating : book.rating.toFixed(1)}/5
            </span>
          </div>
        )}

        {book.description && (
          <p className="text-academia-light text-[1.2rem] mb-3 line-clamp-2 font-body leading-relaxed">
            {book.description}
          </p>
        )}

        <div className="space-y-0.5 text-[1.8rem] text-academia-muted mb-3">
          {book.publishedDate && (
            <p className="truncate"><span className="font-semibold text-[var(--gold)]">Published:</span> {book.publishedDate}</p>
          )}
          {book.publisher && (
            <p className="truncate"><span className="font-semibold text-[var(--gold)]">Publisher:</span> {book.publisher}</p>
          )}
          {book.pageCount && (
            <p><span className="font-semibold text-[var(--gold)]">Pages:</span> {book.pageCount}</p>
          )}
        </div>

        {book.categories && book.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-[var(--umber)]/20 text-[var(--umber)] text-[1.2rem] rounded-full border border-[var(--umber)]/30"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {book.previewLink && (
          <button
            onClick={handlePreview}
            className="mt-auto flex items-center gap-1.5 text-[var(--gold)] hover:text-academia-light transition-all duration-300 text-[1.8rem] font-medium border border-[var(--umber)]/30 px-3 py-1.5 rounded-md hover:bg-[var(--umber)]/10 w-full justify-center"
          >
            <ExternalLink size={14} />
            Preview
          </button>
        )}
      </div>
    </div>
  );
}
