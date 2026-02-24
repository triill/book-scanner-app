'use client';

import { Book } from '@/types/book';
import { ExternalLink, Star, Circle, Edit } from 'lucide-react';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
}

export default function BookCard({ book, onEdit }: BookCardProps) {

  const handlePreview = () => {
    if (book.previewLink) {
      window.open(book.previewLink, '_blank');
    }
  };

  return (
    <div className="bg-academia-card rounded-lg border-2 border-academia-green overflow-hidden hover:border-academia-green/50 hover:shadow-md hover:shadow-academia-green/10 transition-all duration-300 group flex flex-col h-full max-w-[280px]">
      {/* Book Cover */}
      <div className="w-full h-64 relative bg-gradient-to-br from-academia-dark to-academia-card flex-shrink-0">
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
          <div className="w-full h-full bg-academia-dark border-b border-academia flex items-center justify-center group-hover:border-academia-green/30 transition-colors duration-300">
            <span className="text-academia-muted text-xs font-body">No Cover</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="flex-1 p-3 flex flex-col">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-sm font-signature font-bold text-academia-light group-hover:text-academia-sage-green transition-colors duration-300 flex-1 pr-1 line-clamp-2">
            {book.title}
          </h3>
          {onEdit && (
            <button
              onClick={() => onEdit(book)}
              className="text-academia-muted hover:text-academia-sage-green transition-all duration-300 p-1 rounded-lg hover:bg-academia-green/10 flex-shrink-0"
              title="Edit volume"
            >
              <Edit size={14} />
            </button>
          )}
        </div>

        <p className="text-academia-muted mb-2 font-signature text-[10px] line-clamp-1">
          by {book.authors.join(', ')}
        </p>

        {/* Genre and Status */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          <span className="px-1.5 py-0.5 bg-academia-green/20 text-academia-green text-[9px] rounded-full border border-academia-green/30 font-body">
            {book.genre}
          </span>
          <span className={`px-1.5 py-0.5 text-[9px] rounded-full border font-body ${
            book.status === 'read' ? 'bg-academia-orange/20 text-academia-orange border-academia-orange/30' :
            'bg-academia-muted/20 text-academia-muted border-academia-muted/30'
          }`}>
            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
          </span>
          <span className="px-1.5 py-0.5 bg-academia-green/20 text-academia-sage-green text-[9px] rounded-full border border-academia-green/30 font-body">
            {book.format.charAt(0).toUpperCase() + book.format.slice(1)}
          </span>
        </div>

        {/* Rating: star (whole) / circle (0.5) — 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 */}
        {book.rating && book.rating > 0 && (
          <div className="flex items-center gap-0.5 mb-2">
            {([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const).map((value) => {
              const isFilled = book.rating! >= value;
              const isWhole = value % 1 === 0;
              const iconClass = `transition-colors duration-300 ${
                isFilled ? 'text-academia-orange fill-current' : 'text-academia-muted'
              }`;
              return isWhole ? (
                <Star key={value} size={10} className={iconClass} />
              ) : (
                <Circle key={value} size={6} className={iconClass} stroke="currentColor" strokeWidth={1.5} />
              );
            })}
            <span className="ml-1 text-[10px] font-heading font-semibold text-academia-light">
              {book.rating % 1 === 0 ? book.rating : book.rating.toFixed(1)}/5
            </span>
          </div>
        )}

        {book.description && (
          <p className="text-academia-light text-[10px] mb-2 line-clamp-2 font-body leading-relaxed">
            {book.description}
          </p>
        )}

        <div className="space-y-0.5 text-[9px] text-academia-muted font-body mb-2">
          {book.publishedDate && (
            <p className="truncate"><span className="font-heading font-semibold text-academia-sage-green">Published:</span> {book.publishedDate}</p>
          )}
          {book.publisher && (
            <p className="truncate"><span className="font-heading font-semibold text-academia-sage-green">Publisher:</span> {book.publisher}</p>
          )}
          {book.pageCount && (
            <p><span className="font-heading font-semibold text-academia-sage-green">Pages:</span> {book.pageCount}</p>
          )}
        </div>

        {book.categories && book.categories.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-0.5">
              {book.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-academia-orange/20 text-academia-orange text-[8px] rounded-full border border-academia-orange/30 font-body"
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
            className="mt-auto flex items-center gap-1 text-academia-sage-green hover:text-academia-light transition-all duration-300 text-[10px] font-heading font-medium border border-academia-green/30 px-2 py-1 rounded-md hover:bg-academia-green/10 w-full justify-center"
          >
            <ExternalLink size={10} />
            Preview
          </button>
        )}
      </div>
    </div>
  );
}
