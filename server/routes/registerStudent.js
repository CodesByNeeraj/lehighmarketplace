import express from "express"
import prisma from '../db/prisma.js';
import {sendVerificationEmail, sendPasswordResetEmail} from '../services/nodemailer.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/send-code',async(req,res)=>{
    try{
        const {email} = req.body;
        //check if student is from lehigh
        if (!email.endsWith('@lehigh.edu')){
            return res.status(400).json({error:"Only lehigh university student emails are allowed!"})
        }
        //check first if student already registered
        const existingStudent = await prisma.student.findUnique({where:{email}})

        if (existingStudent){
            return res.status(409).json({error:"Email already registered"})
        }
        //2 fa code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        //delete verification code if student did not sign up within 10 minutes
        await prisma.verificationCode.deleteMany({where:{email}})
        //save code to db
        await prisma.verificationCode.create({
            data:{email,code,type:"STUDENT_EMAIL_VERIFY",expiresAt}
        });

        await sendVerificationEmail(email,code);
        res.json({message:"Verification code sent"});


    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
});

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password,code} = req.body;
        //get verification code
        const verfcode = await prisma.verificationCode.findFirst({
            where:{email, code}
        })
        if(!verfcode){
            return res.status(400).json({error:"Invalid verification code"})
        }
        if (new Date() > verfcode.expiresAt){
            return res.status(400).json({error:"Verification code expired!"})
        }
        //delete code after use
        await prisma.verificationCode.deleteMany({where:{email}})

        //create hash of password
        //10 rounds of salt rounds
        const hash = await bcrypt.hash(password,10)

        //create student account
        const student = await prisma.student.create({
            data:{email,password_hash:hash,profile:{create:{display_name:name}}},
            include:{profile:true}
        });
        const token = jwt.sign({id:student.student_id,role:"STUDENT"},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.json
        (
            {token, student:{id:student.student_id, email:student.email, name:student.profile.display_name,role:"STUDENT"}}
        )

    
    }catch(err){
        console.error(err)
        res.status(500).json({error:'Server Error'})
    }

})

//send password reset OTP. but student must already exist in the first place
router.post('/send-reset-code', async(req, res) => {
    try{
        const {email} = req.body
        if (!email.endsWith('@lehigh.edu')){
            return res.status(400).json({error:"Only Lehigh University email addresses are allowed"})
        }
        const student = await prisma.student.findUnique({where:{email}})
        if (!student){
            return res.status(404).json({error:"No account found with this email"})
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        await prisma.verificationCode.deleteMany({where:{email,type:"PASSWORD_RESET"}})
        await prisma.verificationCode.create({
            data:{email, code, type:"PASSWORD_RESET", expiresAt}
        })
        await sendPasswordResetEmail(email, code)
        res.json({message:"Reset code sent"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router



