import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.put('/update-listing/:item_id',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const item_id = req.params.item_id
        const {title,description,price,condition,meetupLocation,image_url} = req.body
        const listing = await prisma.listing.findUnique({where:{item_id}})
        if (!listing){
            return res.status(404).json({error:"Listing not found"})
        }
        if (listing.seller_id!==studentId){
            return res.status(403).json({error:"Forbidden: Cannot update other seller's listings"})
        }
        //if no image, then left as is. if there is image, spread operator will spread it meaning add the image url to the object
        await prisma.listing.update({
            where:{ item_id },
            data:{ title, description, price, condition, meetup_location: meetupLocation, ...(image_url && { image_url }) }
        })
    res.status(200).json({message:"Listing successfully updated!"})

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error!"})
    }

})

//mark listing as sold from chat. the buyer_id comes from the conversation
router.put('/mark-sold/:listing_id', authenticate, async(req, res) => {
    try{
        const {listing_id} = req.params
        const sellerId = req.user.id

        const listing = await prisma.listing.findUnique({where:{item_id: listing_id}})
        if (!listing){
            return res.status(404).json({error:"Listing not found"})
        }
        if (listing.seller_id !== sellerId){
            return res.status(403).json({error:"Forbidden"})
        }

        //get the conversation to find the buyer
        const conversation = await prisma.conversation.findFirst({
            where:{listing_id, seller_id: sellerId}
        })
        if (!conversation){
            return res.status(404).json({error:"No conversation found"})
        }

        await prisma.listing.update({
            where:{item_id: listing_id},
            data:{is_sold: true, buyer_id: conversation.buyer_id}
        })
        res.status(200).json({message:"Listing marked as sold"})

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router;