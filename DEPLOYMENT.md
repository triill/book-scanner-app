# 📚 Bibliotheca - Deployment Guide

## Stack Overview
- **Frontend**: Next.js 15 with TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Hosting**: Vercel
- **Database Hosting**: Vercel Postgres

---

## 🚀 Deployment Steps

### 1. Set up Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Connect your GitHub repository

### 2. Create Vercel Postgres Database

1. Go to your Vercel dashboard
2. Click on your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a region close to you (e.g., US East for faster access)
7. Click **Create**

### 3. Get Database Connection String

After creating the database:
1. Go to **Storage** → Your Postgres database
2. Click on **`.env.local` tab**
3. Copy the `DATABASE_URL` value
4. It will look like: `postgres://default:xxx@xxx-xxx.postgres.vercel-storage.com:5432/verceldb`

### 4. Add Environment Variable to Vercel

1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: [paste your database URL]
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 5. Run Database Migration

You have two options:

#### Option A: Run locally then deploy
```bash
# Set your DATABASE_URL in .env file
echo "DATABASE_URL=\"your-vercel-postgres-url\"" > .env

# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev --name init

# Push to GitHub
git add .
git commit -m "Add database setup"
git push
```

#### Option B: Deploy and run migration on Vercel
```bash
# Push your code to GitHub
git add .
git commit -m "Add database setup"
git push

# After Vercel deployment, run in Vercel's terminal or locally:
npx prisma migrate deploy
```

### 6. Deploy to Vercel

1. **If using GitHub:**
   - Push your code to GitHub
   - Vercel will automatically deploy
   - Wait for build to complete

2. **Or deploy manually:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

### 7. Verify Deployment

1. Visit your Vercel deployment URL
2. Try adding a book
3. Check if data persists after refresh

---

## 🔄 Migrating Existing Data from localStorage

If you already have books in localStorage, here's how to migrate them:

### 1. Export from localStorage

Add this temporarily to your browser console on your local app:

```javascript
// In browser console on localhost:3002
const books = JSON.parse(localStorage.getItem('books') || '[]');
console.log(JSON.stringify(books, null, 2));
// Copy the output
```

### 2. Import to Database

Create a migration script or use Prisma Studio:

```bash
# Open Prisma Studio
npx prisma studio

# Or create a seed script (see below)
```

**Seed Script** (`prisma/seed.ts`):
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Paste your books array here
const books = [ /* your books from localStorage */ ];

async function main() {
  for (const book of books) {
    await prisma.book.create({
      data: {
        title: book.title,
        authors: book.authors,
        genre: book.genre,
        description: book.description,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        publisher: book.publisher,
        pageCount: book.pageCount,
        categories: book.categories || [],
        imageUrl: book.imageUrl,
        language: book.language,
        previewLink: book.previewLink,
        rating: book.rating,
        status: book.status,
        format: book.format,
      },
    });
  }
  console.log(`Seeded ${books.length} books`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Then run:
```bash
npx tsx prisma/seed.ts
```

---

## 🛠️ Local Development with Production Database

To develop locally using your production Vercel Postgres:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env .env.local
   ```

2. Add your DATABASE_URL to `.env.local`

3. Run dev server:
   ```bash
   npm run dev
   ```

---

## 📊 Managing Your Database

### Prisma Studio (Visual Database Editor)
```bash
npx prisma studio
```
Opens a browser UI to view/edit your database at `http://localhost:5555`

### View Database in Vercel
1. Go to Vercel Dashboard → Storage → Your Postgres DB
2. Click **Data** tab to see your tables
3. Run SQL queries directly if needed

---

## 🔒 Security Notes

- ✅ `.env` and `.env.local` are already in `.gitignore`
- ✅ Never commit your `DATABASE_URL` to Git
- ✅ Vercel automatically secures your database connection
- ✅ Use environment variables for all sensitive data

---

## 🐛 Troubleshooting

### "Can't reach database server"
- Check your `DATABASE_URL` is correct
- Ensure Vercel Postgres is active
- Verify network connection

### "Table doesn't exist"
- Run migrations: `npx prisma migrate deploy`
- Or reset: `npx prisma migrate reset` (⚠️ deletes all data)

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Try `npm run build` locally first

### Data not persisting
- Check API routes are working: `/api/books`
- Verify DATABASE_URL is in Vercel environment variables
- Check Prisma Client is generated: `npx prisma generate`

---

## 📈 Next Steps

After deployment, consider:

1. **Add authentication** (NextAuth.js)
2. **Add book import/export** features
3. **Set up automatic backups** in Vercel
4. **Add search functionality**
5. **Create a public sharing feature**

---

## 📞 Support

- Prisma Docs: https://www.prisma.io/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs

Good luck with your deployment! 🚀

