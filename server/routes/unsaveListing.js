import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.delete('/unsave-listing/:listingId',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const listingId = req.params.listingId
        //check if listing is in SavedListing db
        const listing = await prisma.savedListing.findFirst({where:{student_id:studentId, listing_id:listingId}})
        if(!listing){
            return res.status(404).json({message:"Listing not found"})
        }
        await prisma.savedListing.delete({where:{save_id:listing.save_id}})
        res.status(200).json({message:"Listing unsaved successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router;