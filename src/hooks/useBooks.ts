'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBooks();
  }, []);

  // Add a book
  const addBook = async (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add book');
      }

      const newBook = await response.json();
      setBooks(prevBooks => [...prevBooks, newBook].sort((a, b) => 
        a.title.localeCompare(b.title)
      ));
      return newBook;
    } catch (err) {
      console.error('Error adding book:', err);
      throw err;
    }
  };

  // Update a book
  const updateBook = async (bookId: string, updates: Partial<Book>) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update book');
      }

      const updatedBook = await response.json();
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.id === bookId ? updatedBook : book
        ).sort((a, b) => a.title.localeCompare(b.title))
      );
      return updatedBook;
    } catch (err) {
      console.error('Error updating book:', err);
      throw err;
    }
  };

  // Remove a book
  const removeBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete book');

      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    } catch (err) {
      console.error('Error deleting book:', err);
      throw err;
    }
  };

  // Clear all books (optional - for testing)
  const clearBooks = async () => {
    // This would need a backend endpoint to delete all
    // For now, just clear locally
    setBooks([]);
  };

  // Get books sorted alphabetically by title
  const getSortedBooks = () => {
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
  };

  // Get books grouped by author (alphabetically by author, then by title within each author)
  const getBooksGroupedByAuthor = () => {
    const sortedBooks = [...books].sort((a, b) => {
      // First sort by author
      const authorA = a.authors[0] || '';
      const authorB = b.authors[0] || '';
      const authorComparison = authorA.localeCompare(authorB);
      
      // If authors are the same, sort by title
      if (authorComparison === 0) {
        return a.title.localeCompare(b.title);
      }
      
      return authorComparison;
    });
    
    return sortedBooks;
  };

  // Search books by title or author
  const searchBooks = (query: string) => {
    if (!query.trim()) return getBooksGroupedByAuthor();
    
    const lowercaseQuery = query.toLowerCase();
    return getBooksGroupedByAuthor().filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.authors.some(author => author.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Get books filtered by genre
  const getBooksByGenre = (genre: string) => {
    return getSortedBooks().filter(book => book.genre === genre);
  };

  // Get 5-star books
  const getFiveStarBooks = () => {
    return getSortedBooks().filter(book => book.rating === 5);
  };

  // Get books by status
  const getBooksByStatus = (status: string) => {
    return getSortedBooks().filter(book => book.status === status);
  };

  // Get statistics
  const getStats = () => {
    const totalBooks = books.length;
    const readBooks = books.filter(book => book.status === 'read').length;
    const fiveStarBooks = books.filter(book => book.rating === 5).length;
    const unreadBooks = books.filter(book => book.status === 'unread').length;

    return {
      totalBooks,
      readBooks,
      fiveStarBooks,
      unreadBooks,
    };
  };

  return {
    books: getBooksGroupedByAuthor(),
    isLoading,
    error,
    addBook,
    updateBook,
    removeBook,
    clearBooks,
    getBooksByGenre,
    getFiveStarBooks,
    getBooksByStatus,
    getStats,
    searchBooks,
    getBooksGroupedByAuthor,
    refetch: fetchBooks,
  };
}

