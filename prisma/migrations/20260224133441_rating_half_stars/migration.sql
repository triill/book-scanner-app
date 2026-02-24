-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "rating" TYPE DOUBLE PRECISION USING "rating"::double precision;
