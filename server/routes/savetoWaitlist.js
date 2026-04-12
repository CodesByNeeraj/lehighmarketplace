import express from "express"
import prisma from '../db/prisma.js';

const router = express.Router();

router.post('/save-to-waitlist',async(req,res)=>{
    try{
        const email = req.body.email;
        await prisma.waitlist.create({
            data:{
                email:email,
            }
        })
        res.status(201).json({message:"Thanks! Keep a lookout for more updates."})

    }catch(err){
        //prisma error code for unique constraint violation
        if (err.code === 'P2002'){
            return res.status(409).json({error:"Email already on waitlist"})
        }
        console.error(err)
        res.status(500).json({error:"Internal server error!"})
    }

})

export default router;