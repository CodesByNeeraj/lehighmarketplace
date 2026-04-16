import authenticate from '../middleware/auth.js'
import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.put('/update-profile',authenticate,async(req,res)=>{
    try{
        const studentId = req.user.id
        const {display_name, bio, gender, age} = req.body
        const data = {display_name}
        //bio,gender and age are optional values
        if (bio !== undefined){
            data.bio = bio
        }
        if (gender !== undefined){
            data.gender = gender
        }
        if (age !== undefined){
            data.age = age
        }
        await prisma.studentProfile.update({
            where:{student_id:studentId},
            data
        })
    res.status(200).json({message:"Profile updated successfully"})

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }

})