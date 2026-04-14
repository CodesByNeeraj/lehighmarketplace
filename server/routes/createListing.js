import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.post('/create-listing',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id;
        const {title,description,price,condition,meetup_location,image_url}  = req.body
        await prisma.listing.create({
            data:{
                seller_id:studentId,
                title:title,
                description:description,
                price:price,
                condition:condition,
                meetup_location:meetup_location,
                image_url:image_url ?? null,
            }
        })
        res.status(201).json({message:"Listing successfully created!"})

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error!"})


    }
})

export default router;