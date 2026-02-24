import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/books - Get all books or filter by query params
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');

    const where: Record<string, string | number> = {};
    
    if (genre) where.genre = genre;
    if (status) where.status = status;
    if (rating) where.rating = parseFloat(rating);

    const books = await prisma.book.findMany({
      where,
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Database URL available:', !!process.env.DATABASE_URL);
    console.error('Environment:', process.env.NODE_ENV);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch books',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if book already exists
    const existingBook = await prisma.book.findFirst({
      where: {
        title: {
          equals: body.title,
          mode: 'insensitive',
        },
        authors: {
          hasSome: body.authors,
        },
      },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: 'Book already exists in your library' },
        { status: 409 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title: body.title,
        authors: body.authors,
        genre: body.genre,
        description: body.description,
        publishedDate: body.publishedDate,
        publisher: body.publisher,
        pageCount: body.pageCount,
        categories: body.categories || [],
        imageUrl: body.imageUrl,
        language: body.language,
        previewLink: body.previewLink,
        rating: body.rating,
        status: body.status,
        format: body.format,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Database URL available:', !!process.env.DATABASE_URL);
    console.error('Environment:', process.env.NODE_ENV);
    
    return NextResponse.json(
      { 
        error: 'Failed to create book',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
}

