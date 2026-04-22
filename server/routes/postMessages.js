import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.post('/send-message/:listing_id', authenticate, async(req, res) => {
    try{
        const {listing_id} = req.params
        const userId = req.user.id
        const {message_text} = req.body
        if(!message_text){
            return res.status(400).json({error:"Message text is required"})
        }
        //get the listing to find the seller
        const listing = await prisma.listing.findUnique({where:{item_id: listing_id}})
        if(!listing){
            return res.status(404).json({error:"Listing not found"})
        }

        const sellerId = listing.seller_id
        const isSeller = userId === sellerId

        let conversation
        if(isSeller){
            //when seller is replying we find the existing conversation where they are the seller
            conversation = await prisma.conversation.findFirst({
                where:{listing_id, seller_id: userId}
            })
            if (!conversation){
                return res.status(404).json({error:"No conversation found to reply to"})
            }
        }else{
            //when buyer is sending the message, find or create the conversation
            conversation = await prisma.conversation.findFirst({
                where:{listing_id, buyer_id: userId, seller_id: sellerId}
            })
            if (!conversation){
                conversation = await prisma.conversation.create({
                    data:{listing_id, buyer_id: userId, seller_id: sellerId}
                })
            }
        }

        //create the message in the conversation
        const message = await prisma.message.create({
            data:{
                conversation_id: conversation.conversation_id,
                sender_id: userId,
                message_text
            }
        })

        res.status(201).json(message)

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router
