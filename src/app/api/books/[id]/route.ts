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

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.authors !== undefined && { authors: body.authors }),
        ...(body.genre !== undefined && { genre: body.genre }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.publishedDate !== undefined && { publishedDate: body.publishedDate }),
        ...(body.publisher !== undefined && { publisher: body.publisher }),
        ...(body.pageCount !== undefined && { pageCount: body.pageCount }),
        ...(body.categories !== undefined && { categories: body.categories }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.previewLink !== undefined && { previewLink: body.previewLink }),
        ...(body.rating !== undefined && { rating: body.rating === null ? null : Number(body.rating) }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.format !== undefined && { format: body.format }),
      },
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

