'use client';

import { useState, useRef } from 'react';
import { Book, BookGenre, BookStatus, BookFormat } from '@/types/book';
import { Edit, X, Star } from 'lucide-react';
import Image from 'next/image';

interface EditBookFormProps {
  book: Book;
  onUpdateBook: (bookId: string, updates: Partial<Book>) => void;
  onCancel: () => void;
}

export default function EditBookForm({ book, onUpdateBook, onCancel }: EditBookFormProps) {
  const [formData, setFormData] = useState({
    title: book.title,
    authors: book.authors.join(', '),
    genre: book.genre,
    description: book.description || '',
    isbn: book.isbn || '',
    rating: book.rating || 0,
    status: book.status,
    format: book.format
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookCover, setBookCover] = useState<string | null>(book.imageUrl || null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState(book.imageUrl || '');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fetchBookCover = async (isbn: string) => {
    if (!isbn.trim()) {
      setBookCover(null);
      return;
    }

    setIsLoadingCover(true);
    try {
      // Clean ISBN (remove hyphens and spaces)
      const cleanIsbn = isbn.replace(/[-\s]/g, '');
      const coverUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
      
      // Test if the cover exists by trying to load it
      const img = document.createElement('img');
      img.onload = () => {
        setBookCover(coverUrl);
        setIsLoadingCover(false);
      };
      img.onerror = () => {
        setBookCover(null);
        setIsLoadingCover(false);
      };
      img.src = coverUrl;
    } catch (error) {
      setBookCover(null);
      setIsLoadingCover(false);
    }
  };

  const handleIsbnChange = (value: string) => {
    handleInputChange('isbn', value);
    
    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Debounce the cover fetch
    debounceTimeout.current = setTimeout(() => {
      fetchBookCover(value);
    }, 500);
  };

  const handleManualImageUrl = (url: string) => {
    setManualImageUrl(url);
    if (url.trim()) {
      // Test if the image loads
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const authorsArray = formData.authors
      .split(',')
      .map(author => author.trim())
      .filter(author => author.length > 0);

    const updates: Partial<Book> = {
      title: formData.title.trim(),
      authors: authorsArray,
      genre: formData.genre,
      description: formData.description.trim() || undefined,
      isbn: formData.isbn.trim() || undefined,
      imageUrl: bookCover || undefined,
      rating: formData.rating > 0 ? formData.rating : undefined,
      status: formData.status,
      format: formData.format
    };

    onUpdateBook(book.id, updates);
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange('rating', star)}
            className={`transition-all duration-300 ${
              star <= formData.rating
                ? 'text-academia-sage-green scale-110'
                : 'text-academia-muted hover:text-academia-sage-green hover:scale-105'
            }`}
          >
            <Star size={20} fill={star <= formData.rating ? 'currentColor' : 'none'} />
          </button>
        ))}
        {formData.rating > 0 && (
          <button
            type="button"
            onClick={() => handleInputChange('rating', 0)}
            className="ml-3 text-academia-muted hover:text-academia-light font-body"
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
          <h2 className="text-3xl font-heading font-bold text-academia-light">Edit Volume</h2>
          <button
            onClick={onCancel}
            className="text-academia-muted hover:text-academia-light transition-colors p-2 rounded-lg hover:bg-academia-green/10"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-lg font-heading font-semibold text-academia-light mb-3">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body ${
                errors.title ? 'border-red-500' : 'border-academia'
              }`}
              placeholder="Enter the title of your literary treasure"
            />
            {errors.title && <p className="text-red-400 text-sm mt-2 font-body">{errors.title}</p>}
          </div>

          {/* Authors */}
          <div>
            <label htmlFor="authors" className="block text-lg font-heading font-semibold text-academia-light mb-3">
              Authors *
            </label>
            <input
              type="text"
              id="authors"
              value={formData.authors}
              onChange={(e) => handleInputChange('authors', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body ${
                errors.authors ? 'border-red-500' : 'border-academia'
              }`}
              placeholder="Enter authors (comma-separated)"
            />
            {errors.authors && <p className="text-red-400 text-sm mt-2 font-body">{errors.authors}</p>}
          </div>

          {/* ISBN and Cover */}
          <div className="space-y-4">
            {/* ISBN Field */}
            <div>
              <label htmlFor="isbn" className="block text-lg font-heading font-semibold text-academia-light mb-3">
                ISBN (Optional)
              </label>
              <input
                type="text"
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleIsbnChange(e.target.value)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body"
                placeholder="Enter ISBN to auto-fetch cover"
              />
              {isLoadingCover && (
                <p className="text-academia-orange text-sm mt-2 font-body">Searching for cover...</p>
              )}
            </div>

            {/* Manual Image URL Field */}
            <div>
              <label htmlFor="manualImageUrl" className="block text-lg font-heading font-semibold text-academia-light mb-3">
                Book Cover URL (Optional)
              </label>
              <input
                type="text"
                id="manualImageUrl"
                value={manualImageUrl}
                onChange={(e) => handleManualImageUrl(e.target.value)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body"
                placeholder="Paste image URL from Amazon or Goodreads"
              />
              <p className="text-xs text-academia-muted mt-2 font-body">
                💡 Right-click on a book cover → "Copy Image Address"
              </p>
            </div>

            {/* Cover Preview */}
            {bookCover && !isLoadingCover && (
              <div className="mt-3">
                <p className="text-academia-green text-sm mb-2 font-body">✓ Cover preview:</p>
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
            <label htmlFor="genre" className="block text-lg font-heading font-semibold text-academia-light mb-3">
              Genre *
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value as BookGenre)}
              className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body"
            >
              <option value="Romance">Romance</option>
              <option value="Dark Romance">Dark Romance</option>
              <option value="Fantasy">Fantasy</option>
            </select>
          </div>

          {/* Status and Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-lg font-heading font-semibold text-academia-light mb-3">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as BookStatus)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body"
              >
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-lg font-heading font-semibold text-academia-light mb-3">
                Format
              </label>
              <select
                id="format"
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value as BookFormat)}
                className="w-full px-4 py-3 border border-academia rounded-xl focus:outline-none focus:ring-2 focus:ring-academia-green/50 text-academia-light bg-academia-dark font-body"
              >
                <option value="physical">Physical</option>
                <option value="kindle">Kindle</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-lg font-heading font-semibold text-academia-light mb-3">
              Rating {formData.status === 'read' && '*'}
            </label>
            {renderStars()}
            {errors.rating && <p className="text-red-400 text-sm mt-2 font-body">{errors.rating}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-heading font-semibold text-academia-light mb-3">
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
              className="px-6 py-3 text-academia-muted bg-academia-card border border-academia rounded-xl hover:bg-academia-card/80 hover:text-academia-light transition-all duration-300 font-heading font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-academia-bronze text-academia-light rounded-xl hover:bg-academia-bronze/80 transition-all duration-300 flex items-center gap-3 font-heading font-semibold border border-academia-green/30 shadow-lg hover:shadow-academia-green/20"
            >
              <Edit size={22} />
              Update Volume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
