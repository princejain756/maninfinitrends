-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "options" JSONB;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "options" JSONB;

