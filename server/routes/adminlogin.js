import express from 'express';
import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/admin-login', async(req,res) => {
    try{
        const {email, password} = req.body;
        const existingAdmin = await prisma.admin.findUnique({where:{staff_email:email}})
        if (!existingAdmin){
            return res.status(404).json({error:'Invalid email or password'})
        }
        const match = await bcrypt.compare(password, existingAdmin.password_hash)
        if (!match){
            return res.status(401).json({error:'Invalid email or password'})
        }
        const token = jwt.sign({id:existingAdmin.admin_id,email:existingAdmin.staff_email,role:"ADMIN"},process.env.JWT_SECRET,{expiresIn:'7d'})
        return res.json({token, admin:{id:existingAdmin.admin_id,email:existingAdmin.staff_email,name:'Admin',role:'ADMIN'}})
    }catch(err) {
        res.status(500).json({error:'Internal server error'})
    }
})

export default router
