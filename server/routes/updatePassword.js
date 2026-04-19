import express from "express"
import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs'

const router = express.Router();

router.put('/update-password', async(req, res) => {
    try{
        const {email_add, otp, new_password} = req.body
        //first validate if such a student with that email exists/does not exists
        const student = await prisma.student.findFirst({
            where:{email: email_add}
        })
        if (!student){
            return res.status(400).json({error:"No such account with this email exists"})
        }

        const email = email_add
        //find the reset code and validate it
        const verfcode = await prisma.verificationCode.findFirst({
            where:{email, code: otp, type: "PASSWORD_RESET"}
        })
        
        if (!verfcode){
            return res.status(400).json({error:"Invalid verification code"})
        }
        if (new Date() > verfcode.expiresAt){
            return res.status(400).json({error:"Verification code expired"})
        }

        //hash the new password
        const hash = await bcrypt.hash(new_password, 10)

        //update the student's password
        await prisma.student.update({
            where:{email},
            data:{password_hash: hash}
        })

        //delete the otp after use
        await prisma.verificationCode.deleteMany({where:{email, type: "PASSWORD_RESET"}})
        res.status(200).json({message:"Password updated successfully"})

    }catch(err){
        console.error(err)
        res.status(500).json({error:"Internal server error"})
    }
})

export default router
