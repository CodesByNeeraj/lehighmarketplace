import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.get('/get-messages/:listing_id', authenticate, async(req, res) => {
    try{
        const {listing_id} = req.params
        const userId = req.user.id
        const listing = await prisma.listing.findUnique({where:{item_id: listing_id}})
        if(!listing){
            return res.status(404).json({error:"Listing not found"})
        }

        const isSeller = userId === listing.seller_id

        //seller looks up by seller_id, buyer looks up by buyer_id
        const conversation = await prisma.conversation.findFirst({
            where: isSeller
                ? {listing_id, seller_id: userId}
                : {listing_id, buyer_id: userId},
            include:{
                messages:{
                    //oldest message on top, newest on the bottom
                    orderBy:{sent_at: 'asc'}
                }
            }
        })
        if(!conversation){
            return res.status(404).json({error:"No conversation found for this listing"})
        }
        res.status(200).json(conversation)
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

//get all conversations for the current user
router.get('/get-conversations', authenticate, async(req, res) => {
    try{
        const userId = req.user.id
        const conversations = await prisma.conversation.findMany({
            where:{
                OR:[
                    {buyer_id: userId},
                    {seller_id: userId}
                ]
            },
            include:{
                listing:{select:{title: true, item_id: true}},
                buyer:{include:{profile:{select:{display_name: true}}}},
                seller:{include:{profile:{select:{display_name: true}}}},
                messages:{orderBy:{sent_at: 'desc'}, take: 1}
            },
            orderBy:{created_at: 'desc'}
        })
        res.status(200).json(conversations)
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Internal server error'})
    }
})

export default router
