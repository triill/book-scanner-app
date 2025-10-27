'use client';

import { useState, useEffect } from 'react';
import { Book, BookGenre } from '@/types/book';
import { useBooks } from '@/hooks/useBooks';
import AddBookForm from '@/components/AddBookForm';
import EditBookForm from '@/components/EditBookForm';
import BookCard from '@/components/BookCard';
import { BookOpen, Plus, Star, Filter } from 'lucide-react';

export default function Home() {
  const { 
    books, 
    addBook, 
    updateBook,
    getBooksByGenre, 
    getFiveStarBooks, 
    getBooksByStatus,
    getStats 
  } = useBooks();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filter, setFilter] = useState<'all' | 'five-star' | BookGenre | 'unread' | 'read'>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stats = getStats();

  const handleAddBook = (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    addBook(bookData);
    setShowAddForm(false);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowEditForm(true);
  };

  const handleUpdateBook = (bookId: string, updates: Partial<Book>) => {
    updateBook(bookId, updates);
    setShowEditForm(false);
    setEditingBook(null);
  };



  const getFilteredBooks = () => {
    switch (filter) {
      case 'five-star':
        return getFiveStarBooks();
      case 'Romance':
      case 'Dark Romance':
      case 'Fantasy':
        return getBooksByGenre(filter);
      case 'unread':
      case 'read':
        return getBooksByStatus(filter);
      default:
        return books;
    }
  };

  const filteredBooks = getFilteredBooks();

  return (
    <div className="min-h-screen bg-academia-dark texture-overlay">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-academia-blood-red/20 border border-academia-blood-red/30">
              <BookOpen size={36} className="text-academia-blood-red" />
            </div>
            <h1 className="text-5xl font-display font-bold text-academia-light tracking-wide">
              Bibliotheca
            </h1>
          </div>
          <p className="text-academia-muted max-w-2xl mx-auto text-lg font-body leading-relaxed">
            Personal library 
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold text-academia-light">Library Statistics</h2>
           
          </div>
          
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 ${!isClient || books.length === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-academia-orange/50 transition-all duration-300">
              <div className="text-3xl font-heading font-bold text-academia-orange mb-2 border-2 border-academia-orange/30 rounded-lg py-2 px-4 inline-block">{isClient ? stats.totalBooks : 0}</div>
              <div className="text-sm text-academia-muted font-body">Total Volumes</div>
            </div>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-academia-green/50 transition-all duration-300">
              <div className="text-3xl font-heading font-bold text-academia-orange mb-2 border-2 border-academia-orange/30 rounded-lg py-2 px-4 inline-block">{isClient ? stats.fiveStarBooks : 0}</div>
              <div className="text-sm text-academia-muted font-body">Masterpieces</div>
            </div>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-academia-green/50 transition-all duration-300">
              <div className="text-3xl font-heading font-bold text-academia-orange mb-2 border-2 border-academia-orange/30 rounded-lg py-2 px-4 inline-block">{isClient ? stats.readBooks : 0}</div>
              <div className="text-sm text-academia-muted font-body">Completed</div>
            </div>
            <div className="bg-academia-card p-6 rounded-xl border border-academia text-center hover:border-academia-green/50 transition-all duration-300">
              <div className="text-3xl font-heading font-bold text-academia-orange mb-2 border-2 border-academia-orange/30 rounded-lg py-2 px-4 inline-block">{isClient ? stats.unreadBooks : 0}</div>
              <div className="text-sm text-academia-muted font-body">Unread</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-3 px-6 py-3 bg-academia-green text-academia-light rounded-xl hover:bg-academia-green/80 transition-all duration-300 border border-academia-green/30 font-heading font-semibold shadow-lg hover:shadow-academia-green/20"
              >
                <Plus size={22} />
                Add Volume
              </button>
              
              <button
                onClick={() => setFilter('five-star')}
                className={`flex items-center gap-3 px-5 py-2 rounded-xl transition-all duration-300 font-heading font-medium ${
                  filter === 'five-star'
                    ? 'bg-academia-green/20 text-academia-sage-green border border-academia-green/50'
                    : 'bg-academia-card text-academia-muted hover:text-academia-light hover:bg-academia-card/80 border border-academia'
                } ${!isClient || books.length === 0 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <Star size={20} />
                Masterpieces ({isClient ? stats.fiveStarBooks : 0})
              </button>
            </div>

            <div className={`flex items-center gap-3 ${!isClient || books.length === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
              <Filter size={18} className="text-academia-sage-green" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'five-star' | BookGenre | 'unread' | 'read')}
                className="px-4 py-2 bg-academia-card border border-academia rounded-xl text-academia-light focus:outline-none focus:border-academia-green focus:ring-2 focus:ring-academia-green/20 font-body"
              >
                <option value="all">All Books</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="Romance">Romance</option>
                <option value="Dark Romance">Dark Romance</option>
                <option value="Fantasy">Fantasy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-semibold text-academia-light">
              {filter === 'all' ? 'All Volumes' : 
               filter === 'five-star' ? 'Masterpieces' :
               filter.charAt(0).toUpperCase() + filter.slice(1)} ({isClient ? filteredBooks.length : 0})
            </h2>
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-3 px-5 py-2 text-academia-sage-green hover:text-academia-light hover:bg-academia-green/10 rounded-xl transition-all duration-300 border border-academia-green/30 font-heading font-medium ${filter !== 'five-star' ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <BookOpen size={20} />
              Back to All Volumes
            </button>
          </div>

          {!isClient ? (
            <div className="text-center py-16 bg-academia-card rounded-2xl border border-academia">
              <div className="p-4 rounded-full bg-academia-sage-green/20 border border-academia-sage-green/30 w-fit mx-auto mb-6">
                <BookOpen size={72} className="text-academia-sage-green" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-academia-light mb-4">
                Loading...
              </h3>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 bg-academia-card rounded-2xl border border-academia">
              <div className="p-4 rounded-full bg-academia-sage-green/20 border border-academia-sage-green/30 w-fit mx-auto mb-6">
                <BookOpen size={72} className="text-academia-sage-green" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-academia-light mb-4">
                Your Library Awaits
              </h3>
              <p className="text-academia-muted mb-8 text-lg font-body max-w-md mx-auto">
                Add your first volume to your library 
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-academia-green text-academia-light rounded-xl hover:bg-academia-green/80 transition-all duration-300 border border-academia-green/30 font-heading font-semibold shadow-lg hover:shadow-academia-green/20"
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
              <h3 className="text-2xl font-heading font-semibold text-academia-light mb-4">
                No Volumes Found
              </h3>
              <p className="text-academia-muted mb-8 text-lg font-body max-w-md mx-auto">
                This filter reveals no treasures. Try a different selection or expand your collection
              </p>
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-academia-orange text-academia-light rounded-xl hover:bg-academia-orange/80 transition-all duration-300 border border-academia-green/30 font-heading font-semibold shadow-lg hover:shadow-academia-green/20"
              >
                Show All Volumes
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEditBook}
                />
              ))}
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
    </div>
  );
}