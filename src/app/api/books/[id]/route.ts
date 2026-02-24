import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/books/[id] - Get a single book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PATCH /api/books/[id] - Update a book
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.genre !== undefined) data.genre = body.genre;
    if (body.description !== undefined) data.description = body.description;
    if (body.publishedDate !== undefined) data.publishedDate = body.publishedDate;
    if (body.publisher !== undefined) data.publisher = body.publisher;
    if (body.pageCount !== undefined) data.pageCount = body.pageCount;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.language !== undefined) data.language = body.language;
    if (body.previewLink !== undefined) data.previewLink = body.previewLink;
    if (body.status !== undefined) data.status = body.status;
    if (body.format !== undefined) data.format = body.format;

    if (body.rating !== undefined) {
      data.rating = body.rating === null ? null : Number(body.rating);
    }

    if (body.authors !== undefined) {
      data.authors = { set: Array.isArray(body.authors) ? body.authors : [body.authors] };
    }

    if (body.categories !== undefined) {
      data.categories = { set: Array.isArray(body.categories) ? body.categories : [body.categories] };
    }

    const book = await prisma.book.update({
      where: { id },
      data,
    });

    return NextResponse.json(book);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update book';
    console.error('Error updating book:', message, error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}

