import authenticate from '../middleware/auth.js'
import isAdmin from '../middleware/isadmin.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.get('/get-deleted-listings',authenticate,isAdmin,async(req,res)=>{
    try{
        const deletedListings = await prisma.listing.findMany(
            {where:{is_deleted:true}, orderBy:{deleted_at:'desc'}}
        )
        return res.status(200).json(deletedListings)

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error!"})
    }
})

export default router

