-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DemandItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "demandId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "totalPlan" INTEGER NOT NULL,
    "totalProduced" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "DemandItem_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "Demand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DemandItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DemandItem" ("demandId", "id", "itemId", "totalPlan") SELECT "demandId", "id", "itemId", "totalPlan" FROM "DemandItem";
DROP TABLE "DemandItem";
ALTER TABLE "new_DemandItem" RENAME TO "DemandItem";
CREATE UNIQUE INDEX "DemandItem_demandId_itemId_key" ON "DemandItem"("demandId", "itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
