import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.delete('/unsave-listing',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const {listingId} = req.body
        const listing = await prisma.savedListing.findUnique({where:{student_id_listing_id:{student_id:studentId,listing_id:listingId}}})
        if(!listing){
            return res.status(404).json({message:"Listing not found"})
        }
        const unsaveListing = await prisma.savedListing.delete({where:{student_id_listing_id:{student_id:studentId,listing_id:listingId}}})
        res.status(200).json({message:"Listing unsaved successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router;