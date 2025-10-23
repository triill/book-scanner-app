'use client';

import { useState } from 'react';
import { Book } from '@/types/book';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>('books', []);

  const addBook = (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString()
    };

    setBooks(prevBooks => {
      // Check if book already exists by title and author
      const exists = prevBooks.some(b => 
        b.title.toLowerCase() === newBook.title.toLowerCase() && 
        b.authors.some(author => 
          newBook.authors.some(newAuthor => 
            author.toLowerCase() === newAuthor.toLowerCase()
          )
        )
      );
      if (exists) {
        return prevBooks;
      }
      return [...prevBooks, newBook];
    });
  };

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookId ? { ...book, ...updates } : book
      )
    );
  };

  const removeBook = (bookId: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  };

  const clearBooks = () => {
    setBooks([]);
  };

  // Get books sorted alphabetically by title
  const getSortedBooks = () => {
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
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
      unreadBooks
    };
  };

  return {
    books: getSortedBooks(),
    addBook,
    updateBook,
    removeBook,
    clearBooks,
    getBooksByGenre,
    getFiveStarBooks,
    getBooksByStatus,
    getStats
  };
}
