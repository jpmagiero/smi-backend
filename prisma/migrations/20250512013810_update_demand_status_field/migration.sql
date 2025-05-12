-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Demand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNING'
);
INSERT INTO "new_Demand" ("endDate", "id", "startDate", "status") SELECT "endDate", "id", "startDate", "status" FROM "Demand";
DROP TABLE "Demand";
ALTER TABLE "new_Demand" RENAME TO "Demand";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
