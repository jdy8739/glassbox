-- AlterTable
ALTER TABLE "portfolios" ADD COLUMN     "analysisDate" TEXT,
ADD COLUMN     "expectedReturn" DOUBLE PRECISION,
ADD COLUMN     "sharpeRatio" DOUBLE PRECISION,
ADD COLUMN     "volatility" DOUBLE PRECISION;

-- Backfill existing data from analysisSnapshot JSON
UPDATE "portfolios"
SET 
  "sharpeRatio" = ("analysisSnapshot"->'maxSharpe'->'stats'->>'sharpe')::float,
  "volatility" = ("analysisSnapshot"->'maxSharpe'->'stats'->>'volatility')::float,
  "expectedReturn" = ("analysisSnapshot"->'maxSharpe'->'stats'->>'return')::float,
  "analysisDate" = "analysisSnapshot"->>'analysisDate'
WHERE "analysisSnapshot" IS NOT NULL;