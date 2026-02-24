export type BookGenre = 'Dark Romance' | 'Romance' | 'Fantasy' | 'Horror';
export type BookStatus = 'Unread' | 'Read'| 'DNF';
export type BookFormat = 'Physical' | 'Kindle' | 'Both';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  genre: BookGenre;
  description?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  imageUrl?: string;
  language?: string;
  previewLink?: string;
  
  // New tracking fields
  rating?: number; // 0.5-5 stars in half-star steps
  status: BookStatus;
  format: BookFormat;
  dateAdded: string | Date;
  updatedAt?: string | Date;
}

export interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
      publishedDate?: string;
      publisher?: string;
      pageCount?: number;
      categories?: string[];
      imageLinks?: {
        thumbnail?: string;
        small?: string;
        medium?: string;
        large?: string;
      };
      language?: string;
      previewLink?: string;
    };
  }>;
}
