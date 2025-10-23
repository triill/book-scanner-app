# 📚 Bibliotheca - Personal Library Manager

A beautiful, dark academia-themed book collection manager built with Next.js, Prisma, and PostgreSQL.

![Stack](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

---

## ✨ Features

- 📖 **Book Management** - Add, edit, and track your entire library
- ⭐ **Rating System** - Rate books 1-5 stars
- 🏷️ **Smart Filtering** - Filter by genre, status (read/unread), rating
- 📊 **Statistics** - Track total books, completed reads, masterpieces
- 🖼️ **Cover Images** - Automatic cover fetching via Open Library API
- 📱 **Responsive Design** - Beautiful on desktop, tablet, and mobile
- 🎨 **Dark Academia Theme** - Rich greens, browns, and elegant typography
- 💾 **Cloud Database** - Data synced across all your devices
- ⚡ **Fast Performance** - Built with Next.js 15 and Turbopack

---

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database

### Deployment
- **Vercel** - Hosting and CI/CD
- **Vercel Postgres** - Managed PostgreSQL database

---

## 📂 Project Structure

```
book-scanner-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── books/
│   │   │       ├── route.ts              # GET all, POST new
│   │   │       ├── [id]/route.ts         # GET, PATCH, DELETE
│   │   │       └── stats/route.ts        # Statistics
│   │   ├── page.tsx                      # Main app page
│   │   ├── layout.tsx                    # Root layout
│   │   └── globals.css                   # Global styles
│   ├── components/
│   │   ├── AddBookForm.tsx               # Add book modal
│   │   ├── EditBookForm.tsx              # Edit book modal
│   │   └── BookCard.tsx                  # Book display card
│   ├── hooks/
│   │   └── useBooks.ts                   # Books data hook
│   ├── types/
│   │   └── book.ts                       # TypeScript types
│   └── lib/
│       └── prisma.ts                     # Prisma client
├── prisma/
│   └── schema.prisma                     # Database schema
├── QUICK-START.md                        # 10-min deployment guide
├── DEPLOYMENT.md                         # Full deployment guide
└── SETUP-COMPLETE.md                     # What was done
```

---

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or use Vercel Postgres)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd book-scanner-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Add your DATABASE_URL
echo "DATABASE_URL=\"postgresql://user:pass@localhost:5432/bibliotheca\"" > .env
```

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

---

## 🚀 Quick Deployment (10 minutes)

**See [QUICK-START.md](./QUICK-START.md)** for a step-by-step guide to deploy to Vercel with PostgreSQL.

### TL;DR
1. Push code to GitHub
2. Import to Vercel
3. Create Vercel Postgres database
4. Add `DATABASE_URL` environment variable
5. Deploy!

---

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books?genre=Romance` | Filter by genre |
| GET | `/api/books?status=read` | Filter by status |
| GET | `/api/books?rating=5` | Filter by rating |
| POST | `/api/books` | Create new book |
| GET | `/api/books/[id]` | Get single book |
| PATCH | `/api/books/[id]` | Update book |
| DELETE | `/api/books/[id]` | Delete book |
| GET | `/api/books/stats` | Get statistics |

### Example Request

```typescript
// Add a book
const response = await fetch('/api/books', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "The Great Gatsby",
    authors: ["F. Scott Fitzgerald"],
    genre: "Romance",
    status: "unread",
    format: "physical",
    rating: 5
  })
});

const book = await response.json();
```

---

## 🗄️ Database Schema

```prisma
model Book {
  id              String   @id @default(cuid())
  title           String
  authors         String[]
  genre           String
  description     String?
  isbn            String?
  publishedDate   String?
  publisher       String?
  pageCount       Int?
  categories      String[]
  imageUrl        String?
  language        String?
  previewLink     String?
  rating          Int?
  status          String
  format          String
  dateAdded       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([genre])
  @@index([status])
  @@index([rating])
}
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run db:generate

# Create a migration
npm run db:migrate

# Deploy migrations
npm run db:deploy

# Open Prisma Studio (database GUI)
npm run db:studio

# Run database seed
npm run db:seed
```

---

## 🎨 Customization

### Color Palette

The dark academia theme uses:
- **Dark Green Background**: `#202c23`
- **Forest Green**: `#0d281b`
- **Sage Green**: `#71806b`
- **Orange Accent**: `#845736`
- **Brown**: `#8b4513`
- **Blood Red**: `#491616`

Edit `src/app/globals.css` to customize colors.

### Fonts

- **Display**: Playfair Display
- **Headings**: Crimson Text
- **Body**: Lora
- **Accent**: Merriweather

Change in `src/app/layout.tsx`.

---

## 📖 User Guide

### Adding a Book
1. Click "Add Volume" button
2. Fill in book details (title and authors required)
3. Optionally add ISBN to auto-fetch cover
4. Or manually add cover URL
5. Click "Add to Library"

### Filtering Books
- Click genre buttons to filter by category
- Use "Masterpieces" button for 5-star books
- Select status filter for read/unread

### Editing a Book
- Click the edit icon on any book card
- Update any fields
- Click "Save Changes"

---

## 🔐 Security

- Environment variables in `.env` (gitignored)
- Database connection secured by Vercel
- API routes validate all inputs
- No sensitive data in client code

---

## 🚀 Performance

- **Turbopack** for fast development builds
- **Server Components** where possible
- **Optimized images** with Next.js Image
- **Database indexes** on frequently queried fields
- **Connection pooling** via Prisma

---

## 📈 Future Enhancements

- [ ] User authentication (NextAuth.js)
- [ ] Book recommendations
- [ ] Reading progress tracking
- [ ] Book notes and highlights
- [ ] Import from Goodreads
- [ ] Export to CSV/JSON
- [ ] Public profile pages
- [ ] Book lending tracker
- [ ] Advanced search
- [ ] Dark/light mode toggle

---

## 🐛 Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues and solutions.

**Common issues:**
- Database connection errors → Check `DATABASE_URL`
- Build failures → Run `npx prisma generate`
- Missing env vars → Add to Vercel dashboard

---

## 📄 License

MIT License - feel free to use this project for personal or commercial use!

---

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

---

## 💼 Built For Learning

This project demonstrates:
- ✅ Full-stack TypeScript
- ✅ Modern React patterns
- ✅ RESTful API design
- ✅ Database design with Prisma
- ✅ Vercel deployment
- ✅ Production-ready code

Perfect for showcasing in your portfolio or learning modern web development!

---

## 📞 Support

- **Full deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick start**: [QUICK-START.md](./QUICK-START.md)
- **Setup details**: [SETUP-COMPLETE.md](./SETUP-COMPLETE.md)

---

**Built with ❤️ and lots of ☕**

Happy reading! 📚✨
