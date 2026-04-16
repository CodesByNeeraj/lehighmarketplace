import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.post('/save-listing/:listingId',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const listingId = req.params.listingId
        await prisma.savedListing.create({
            data:{student_id: studentId, listing_id: listingId}
        })
        res.status(201).json({message:"Listing saved successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router;