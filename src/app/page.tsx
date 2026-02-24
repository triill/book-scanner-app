'use client';

import { useState, useEffect } from 'react';
import { Book, BookGenre } from '@/types/book';
import { useBooks } from '@/hooks/useBooks';
import AddBookForm from '@/components/AddBookForm';
import EditBookForm from '@/components/EditBookForm';
import BookCard from '@/components/BookCard';
import { BookOpen, Plus, Star, Filter, X, Search, ArrowUp } from 'lucide-react';

export default function Home() {
  const { 
    books, 
    isLoading,
    addBook, 
    updateBook,
    getStats,
    searchBooks
  } = useBooks();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filter, setFilter] = useState<'all' | 'five-star' | BookGenre | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const hasBooks = !isLoading && books.length > 0;

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = getStats();

  const handleAddBook = async (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    try {
      setError(null);
      await addBook(bookData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add book:', error);
      setError(error instanceof Error ? error.message : 'Failed to add book');
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowEditForm(true);
  };

  const handleUpdateBook = async (bookId: string, updates: Partial<Book>) => {
    await updateBook(bookId, updates);
    setShowEditForm(false);
    setEditingBook(null);
  };

  const getFilteredBooks = () => {
    let filteredBooks = books;
    
    if (searchQuery.trim()) {
      filteredBooks = searchBooks(searchQuery);
    }
    
    switch (filter) {
      case 'five-star':
        return filteredBooks.filter(book => book.rating === 5);
      case 'Romance':
      case 'Dark Romance':
      case 'Fantasy':
      case 'Horror':
        return filteredBooks.filter(book => book.genre === filter);
      case 'unread':
      case 'read':
        return filteredBooks.filter(book => book.status === filter);
      default:
        return filteredBooks;
    }
  };

  const filteredBooks = getFilteredBooks();

  return (
    <div className="min-h-screen bg-academia-dark" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Hero Header */}
        <div className="hero-section rounded-2xl mb-12 py-20 px-4">
          <div className="hero-content text-center">
            <h1 className="text-[5rem] font-signature text-academia-light tracking-wide mb-4 drop-shadow-lg">
              Bibliotheca
            </h1>
            <p className="text-academia-muted max-w-2xl mx-auto text-[1.8rem] leading-relaxed">
              Personal library
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[2rem] text-academia-light">Library Statistics</h2>
          </div>
          
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 transition-opacity duration-300 ${!hasBooks ? 'opacity-0 pointer-events-none' : ''}`}>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-[var(--umber)]/50 transition-all duration-300">
              <div className="text-[2rem] font-signature text-[var(--gold)] mb-2 border-2 border-[var(--umber)]/30 rounded-lg py-2 px-4 inline-block" suppressHydrationWarning>{stats.totalBooks}</div>
              <div className="text-[1.8rem] text-academia-muted">Total Volumes</div>
            </div>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-[var(--umber)]/50 transition-all duration-300">
              <div className="text-[2rem] font-signature text-[var(--gold)] mb-2 border-2 border-[var(--umber)]/30 rounded-lg py-2 px-4 inline-block" suppressHydrationWarning>{stats.fiveStarBooks}</div>
              <div className="text-[1.8rem] text-academia-muted">Masterpieces</div>
            </div>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-[var(--umber)]/50 transition-all duration-300">
              <div className="text-[2rem] font-signature text-[var(--gold)] mb-2 border-2 border-[var(--umber)]/30 rounded-lg py-2 px-4 inline-block" suppressHydrationWarning>{stats.readBooks}</div>
              <div className="text-[1.8rem] text-academia-muted">Completed</div>
            </div>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-[var(--umber)]/50 transition-all duration-300">
              <div className="text-[2rem] font-signature text-[var(--gold)] mb-2 border-2 border-[var(--umber)]/30 rounded-lg py-2 px-4 inline-block" suppressHydrationWarning>{stats.unreadBooks}</div>
              <div className="text-[1.8rem] text-academia-muted">Unread</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {hasBooks && (
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-academia-muted" />
              </div>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-academia-card border border-academia rounded-xl text-academia-light placeholder-academia-muted focus:outline-none focus:border-academia-green focus:ring-2 focus:ring-academia-green/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-academia-muted hover:text-academia-light transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-3 px-6 py-3 bg-academia-green text-academia-light rounded-xl hover:bg-academia-green/80 transition-all duration-300 border border-academia-green/30 font-semibold shadow-lg hover:shadow-academia-green/20"
              >
                <Plus size={22} />
                Add Volume
              </button>
              
              <button
                onClick={() => setFilter('five-star')}
                className={`flex items-center gap-3 px-5 py-2 rounded-xl transition-all duration-300 font-medium ${
                  filter === 'five-star'
                    ? 'bg-academia-green/20 text-academia-sage-green border border-academia-green/50'
                    : 'bg-academia-card text-academia-muted hover:text-academia-light hover:bg-academia-card/80 border border-academia'
                } ${!hasBooks ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <Star size={20} />
                <span suppressHydrationWarning>Masterpieces ({stats.fiveStarBooks})</span>
              </button>
            </div>

            <div className={`flex items-center gap-3 ${!hasBooks ? 'opacity-0 pointer-events-none' : ''}`}>
              <Filter size={18} className="text-academia-sage-green" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'five-star' | BookGenre | 'unread' | 'read')}
                className="px-4 py-2 bg-academia-card border border-academia rounded-xl text-academia-light focus:outline-none focus:border-academia-green focus:ring-2 focus:ring-academia-green/20"
              >
                <option value="all">All Books</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="Romance">Romance</option>
                <option value="Dark Romance">Dark Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[2.5rem] text-academia-light" suppressHydrationWarning>
              {searchQuery ? `Search Results for "${searchQuery}"` :
               filter === 'all' ? 'All Volumes' : 
               filter === 'five-star' ? 'Masterpieces' :
               filter.charAt(0).toUpperCase() + filter.slice(1)} ({filteredBooks.length})
            </h2>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-3 px-5 py-2 text-academia-sage-green hover:text-academia-light hover:bg-academia-green/10 rounded-xl transition-all duration-300 border border-academia-green/30 font-medium"
              >
                <X size={20} />
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setFilter('all')}
                className={`flex items-center gap-3 px-5 py-2 text-academia-sage-green hover:text-academia-light hover:bg-academia-green/10 rounded-xl transition-all duration-300 border border-academia-green/30 font-medium ${filter !== 'five-star' ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <BookOpen size={20} />
                Back to All Volumes
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-16 bg-academia-card rounded-2xl border border-academia">
              <div className="p-4 rounded-full bg-academia-sage-green/20 border border-academia-sage-green/30 w-fit mx-auto mb-6">
                <BookOpen size={72} className="text-academia-sage-green" />
              </div>
              <h3 className="text-[2rem] text-academia-light mb-4">
                Loading...
              </h3>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 bg-academia-card rounded-2xl border border-academia">
              <div className="p-4 rounded-full bg-academia-sage-green/20 border border-academia-sage-green/30 w-fit mx-auto mb-6">
                <BookOpen size={72} className="text-academia-sage-green" />
              </div>
              <h3 className="text-[2rem] text-academia-light mb-4">
                Your Library Awaits
              </h3>
              <p className="text-academia-muted mb-8 text-[1.8rem] max-w-md mx-auto">
                Add your first volume to your library 
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-academia-green text-academia-light rounded-xl hover:bg-academia-green/80 transition-all duration-300 border border-academia-green/30 font-semibold shadow-lg hover:shadow-academia-green/20"
              >
                <Plus size={24} />
                Add Your First Volume
              </button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-academia-card rounded-2xl border border-academia">
              <div className="p-4 rounded-full bg-academia-orange/20 border border-academia-green/30 w-fit mx-auto mb-6">
                <Filter size={72} className="text-academia-sage-green" />
              </div>
              <h3 className="text-[2rem] text-academia-light mb-4">
                No Volumes Found
              </h3>
              <p className="text-academia-muted mb-8 text-[1.8rem] max-w-md mx-auto">
                This filter reveals no treasures. Try a different selection or expand your collection
              </p>
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-academia-orange text-academia-light rounded-xl hover:bg-academia-orange/80 transition-all duration-300 border border-academia-green/30 font-semibold shadow-lg hover:shadow-academia-green/20"
              >
                Show All Volumes
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {(() => {
                const groupedBooks = filteredBooks.reduce((groups, book) => {
                  const author = book.authors[0] || 'Unknown Author';
                  if (!groups[author]) {
                    groups[author] = [];
                  }
                  groups[author].push(book);
                  return groups;
                }, {} as Record<string, Book[]>);

                return Object.entries(groupedBooks).map(([author, authorBooks]) => (
                  <div key={author} className="space-y-4">
                    <h3 className="text-[2.5rem] text-academia-sage-green border-b border-academia-green/30 pb-2">
                      {author}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {authorBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          onEdit={handleEditBook}
                        />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* Add Book Form Modal */}
        {showAddForm && (
          <AddBookForm
            onAddBook={handleAddBook}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Book Form Modal */}
        {showEditForm && editingBook && (
          <EditBookForm
            book={editingBook}
            onUpdateBook={handleUpdateBook}
            onCancel={() => {
              setShowEditForm(false);
              setEditingBook(null);
            }}
          />
        )}
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-6 bottom-8 z-40 p-3 rounded-full bg-academia-green text-academia-light border border-academia-green/30 shadow-lg hover:bg-academia-green/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-academia-sage-green/50"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
