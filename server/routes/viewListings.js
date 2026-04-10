import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router()

//protected routes (authenticate)

//get all listings (shown in homepage)
router.get('/get-listings',authenticate,async(req,res)=>{
    try{
        const listings = await prisma.listing.findMany({where: {is_sold:false},orderBy:{created_at:'desc'}})
        res.status(200).json(listings)
        
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

//get own listings
router.get('/get-own-listings',authenticate,async(req,res)=>{
    try{
        const ownListings = await prisma.listing.findMany(
            {where:{seller_id:req.user.id}}
        )
        if (ownListings.length==0){
            return res.status(200).json({message:"No listings"})
        }
        res.status(200).json(ownListings)

    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

//get saved listings
router.get('/get-saved-listings',authenticate,async(req,res)=>{
    try{
        const savedListings = await prisma.savedListing.findMany(
            {where:{student_id:req.user.id},include:{listing:true}}

        )
        res.status(200).json(savedListings)

    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

//view a particular listing
router.get('/view-listing/:item_id',authenticate,async(req, res)=>{
    try{
        const item_id = parseInt(req.params.item_id)
        const listing = await prisma.listing.findUnique({
            where:{item_id},
            include:{seller:{select:{name:true,email:true}}}
        })
        if (!listing){
            return res.status(404).json({error:"Listing not found"})
        }
        res.status(200).json(listing)

    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

export default router;