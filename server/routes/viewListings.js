import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router()

//protected routes (authenticate)

//get all listings (shown in homepage)
router.get('/get-listings',authenticate,async(req,res)=>{
    try{
        //find many in prisma returns an array
        const listings = await prisma.listing.findMany({where: {is_sold:false, is_deleted:false},orderBy:{created_at:'desc'}})
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
            {where:{seller_id:req.user.id, is_deleted:false}}
        )
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
        res.status(200).json(savedListings.map(s => s.listing).filter(l => !l.is_deleted))

    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

//view a particular listing
router.get('/view-listing/:item_id',authenticate,async(req, res)=>{
    try{
        const item_id = req.params.item_id
        //findUnique returns a single object - prisma rule
        const listing = await prisma.listing.findUnique({
            where:{item_id},
            include:{seller:{select:{email:true, profile:{select:{display_name:true}}}}}
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

//get purchased listings
router.get('/get-purchased',authenticate,async(req,res)=>{
    try{
        const purchased = await prisma.listing.findMany({
            where:{buyer_id: req.user.id, is_sold: true}
        })
        res.status(200).json(purchased)
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

export default router;