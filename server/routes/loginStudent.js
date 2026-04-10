import express from 'express';
import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const existingStudent = await prisma.student.findUnique({where:{email}})
        if (!existingStudent){
            return res.status(404).json({error:'Student not found!'})
        }
        const match = await bcrypt.compare(password,existingStudent.password_hash)
        if(!match){
            return res.status(401).json({error:"Invalid password"})
        }
        //because server is stateless, we need a way to remember who the student is post login between requests
        //we use jwt token to remember the user
        const token = jwt.sign({id:existingStudent.student_id,email:existingStudent.email,role:"STUDENT"},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.json({token,student:{id: existingStudent.student_id,email: existingStudent.email}})
    }catch(err){
        res.status(500).json({error:"Internal server error"})
    }
})

export default router