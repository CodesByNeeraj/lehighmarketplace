import authenticate from '../middleware/auth.js'
import isAdmin from '../middleware/isadmin.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

//authenticate sets req.user from the JWT, isAdmin then checks if role is ADMIN
router.delete('/delete-listing/:item_id',authenticate,isAdmin,async(req,res)=>{
    try{
        const item_id = req.params.item_id
        const listing = await prisma.listing.findUnique({where:{item_id}})
        if (!listing){
            return res.status(404).json({error:"Listing not found"})
        }
        await prisma.listing.delete({
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
