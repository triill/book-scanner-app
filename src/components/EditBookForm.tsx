'use client';

import { useState } from 'react';
import { Book, BookGenre, BookStatus, BookFormat } from '@/types/book';
import { Edit, X, Star, Circle } from 'lucide-react';
import Image from 'next/image';

interface EditBookFormProps {
  book: Book;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => Promise<void>;
  onCancel: () => void;
}

export default function EditBookForm({ book, onUpdateBook, onCancel }: EditBookFormProps) {
  const [formData, setFormData] = useState({
    title: book.title,
    authors: book.authors.join(', '),
    genre: book.genre,
    description: book.description || '',
    rating: book.rating || 0,
    status: book.status,
    format: book.format
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookCover, setBookCover] = useState<string | null>(book.imageUrl || null);
  const [manualImageUrl, setManualImageUrl] = useState(book.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleManualImageUrl = (url: string) => {
    setManualImageUrl(url);
    if (url.trim()) {
      const img = document.createElement('img');
      img.onload = () => {
        setBookCover(url);
      };
      img.onerror = () => {
        setBookCover(null);
      };
      img.src = url;
    } else {
      setBookCover(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.authors.trim()) {
      newErrors.authors = 'At least one author is required';
    }

    if (formData.status === 'read' && formData.rating === 0) {
      newErrors.rating = 'Rating is required when status is "read"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const authorsArray = formData.authors
      .split(',')
      .map(author => author.trim())
      .filter(author => author.length > 0);

    const updates: Partial<Book> = {
      title: formData.title.trim(),
      authors: authorsArray,
      genre: formData.genre,
      description: formData.description.trim() || undefined,
      imageUrl: bookCover || undefined,
      rating: formData.rating > 0 ? formData.rating : undefined,
      status: formData.status,
      format: formData.format
    };

    try {
      await onUpdateBook(book.id, updates);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RATING_VALUES = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

  const renderStars = () => {
    return (
      <div className="flex items-center gap-0.5">
        {RATING_VALUES.map((value) => {
          const isFilled = formData.rating >= value;
          const isWhole = value % 1 === 0;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleInputChange('rating', value)}
              className={`transition-all duration-300 flex items-center ${
                isFilled
                  ? 'text-academia-sage-green scale-110'
                  : 'text-academia-muted hover:text-academia-sage-green hover:scale-105'
              }`}
              title={`${value} stars`}
            >
              {isWhole ? (
                <Star size={20} fill={isFilled ? 'currentColor' : 'none'} />
              ) : (
                <Circle size={10} fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} />
              )}
            </button>
          );
        })}
        {formData.rating > 0 && (
          <button
            type="button"
            onClick={() => handleInputChange('rating', 0)}
            className="ml-3 text-academia-muted hover:text-academia-light text-[1.8rem]"
          >
            Clear
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-academia-dark rounded-2xl shadow-2xl border border-academia max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-academia">
          <h2 className="text-[2rem] text-academia-light">Edit Volume</h2>
          <button
            onClick={onCancel}
            className="text-academia-muted hover:text-academia-light transition-colors p-2 rounded-lg hover:bg-academia-green/10"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Error from API */}
          {submitError && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-red-400">{submitError}</p>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark ${
                errors.title ? 'border-red-500' : 'border-academia'
              }`}
              placeholder="Enter the title of your literary treasure"
            />
            {errors.title && <p className="text-red-400 text-[1.8rem] mt-2">{errors.title}</p>}
          </div>

          {/* Authors */}
          <div>
            <label htmlFor="authors" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
              Authors *
            </label>
            <input
              type="text"
              id="authors"
              value={formData.authors}
              onChange={(e) => handleInputChange('authors', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark ${
                errors.authors ? 'border-red-500' : 'border-academia'
              }`}
              placeholder="Enter authors (comma-separated)"
            />
            {errors.authors && <p className="text-red-400 text-[1.8rem] mt-2">{errors.authors}</p>}
          </div>

          {/* Book Cover */}
          <div className="space-y-4">
            <div>
              <label htmlFor="manualImageUrl" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
                Book Cover URL (Optional)
              </label>
              <input
                type="text"
                id="manualImageUrl"
                value={manualImageUrl}
                onChange={(e) => handleManualImageUrl(e.target.value)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark"
                placeholder="Paste image URL from Amazon or Goodreads"
              />
              <p className="text-[1.8rem] text-academia-muted mt-2">
                Right-click on a book cover &rarr; &quot;Copy Image Address&quot;
              </p>
            </div>

            {bookCover && (
              <div className="mt-3">
                <p className="text-academia-green text-[1.8rem] mb-2">Cover preview:</p>
                <div className="relative w-32 h-44 border-2 border-academia-green/50 rounded-lg overflow-hidden">
                  <Image 
                    src={bookCover} 
                    alt="Book cover preview" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
              Genre *
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value as BookGenre)}
              className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark"
            >
              <option value="Romance">Romance</option>
              <option value="Dark Romance">Dark Romance</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
            </select>
          </div>

          {/* Status and Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as BookStatus)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark"
              >
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
                Format
              </label>
              <select
                id="format"
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value as BookFormat)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark"
              >
                <option value="physical">Physical</option>
                <option value="kindle">Kindle</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[1.8rem] font-semibold text-academia-light mb-3">
              Rating {formData.status === 'read' && '*'}
            </label>
            {renderStars()}
            {errors.rating && <p className="text-red-400 text-[1.8rem] mt-2">{errors.rating}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[1.8rem] font-semibold text-academia-light mb-3">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body resize-none"
              placeholder="Share your thoughts about this literary work..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-academia">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-academia-muted bg-academia-card border border-academia rounded-xl hover:bg-academia-card/80 hover:text-academia-light transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-academia-bronze text-academia-light rounded-xl hover:bg-academia-bronze/80 transition-all duration-300 flex items-center gap-3 font-semibold border border-academia-green/30 shadow-lg hover:shadow-academia-green/20 disabled:opacity-50"
            >
              <Edit size={22} />
              {isSubmitting ? 'Updating...' : 'Update Volume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
