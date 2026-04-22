import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router()

//get profile details
router.get('/get-profile',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const profileDetails = await prisma.studentProfile.findUnique({where:{student_id:studentId}})
        if (!profileDetails){
            return res.status(404).json({error:"Profile not found"})
        }
        res.status(200).json(profileDetails)
        
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

//get any seller's public profile by their id
router.get('/view-profile/:studentId',authenticate,async(req,res)=>{
    try{
        const {studentId} = req.params
        const profileDetails = await prisma.studentProfile.findUnique({where:{student_id:studentId}})
        if (!profileDetails){
            return res.status(404).json({error:"Profile not found"})
        }
        res.status(200).json(profileDetails)
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server error'})
    }
})

export default router
