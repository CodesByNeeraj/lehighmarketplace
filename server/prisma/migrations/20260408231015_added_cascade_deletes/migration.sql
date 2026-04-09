-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "SavedListing" DROP CONSTRAINT "SavedListing_listing_id_fkey";

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("conversation_id") ON DELETE CASCADE ON UPDATE CASCADE;
