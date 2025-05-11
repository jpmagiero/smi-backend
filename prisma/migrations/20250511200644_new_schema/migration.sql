/*
  Warnings:

  - You are about to drop the column `sku` on the `DemandItem` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `DemandItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DemandItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "demandId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "totalPlan" INTEGER NOT NULL,
    CONSTRAINT "DemandItem_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "Demand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DemandItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DemandItem" ("demandId", "id", "totalPlan") SELECT "demandId", "id", "totalPlan" FROM "DemandItem";
DROP TABLE "DemandItem";
ALTER TABLE "new_DemandItem" RENAME TO "DemandItem";
CREATE UNIQUE INDEX "DemandItem_demandId_itemId_key" ON "DemandItem"("demandId", "itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Item_sku_key" ON "Item"("sku");
