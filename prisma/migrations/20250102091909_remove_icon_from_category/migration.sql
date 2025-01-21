/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income'
);
INSERT INTO "new_Category" ("createdAt", "name", "type", "userId") SELECT "createdAt", "name", "type", "userId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_userId_type_key" ON "Category"("name", "userId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
