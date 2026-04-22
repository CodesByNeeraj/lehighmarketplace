-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "buyer_id" TEXT;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Student"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
