import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.delete('/delete-listing',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const {item_id} = req.body
        const listing = await prisma.listing.findUnique({where:{item_id}})
        if (!listing){
            return res.status(404).json({error:"Listing not found"})
        }
        if (listing.seller_id!==studentId){
            return res.status(403).json({error:"Forbidden: Cannot delete other seller's listings"})
        }
        const deleteListing = await prisma.listing.delete({
            where:{
                item_id
            }
    })
    res.status(200).json({message:"Listing successfully deleted!"})

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error!"})
    }

})

export default router;