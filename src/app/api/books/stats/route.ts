import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/books/stats - Get book statistics
export async function GET() {
  try {
    const [totalBooks, readBooks, fiveStarBooks, unreadBooks] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: 'read' } }),
      prisma.book.count({ where: { rating: 5 } }),
      prisma.book.count({ where: { status: 'unread' } }),
    ]);

    return NextResponse.json({
      totalBooks,
      readBooks,
      fiveStarBooks,
      unreadBooks,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

