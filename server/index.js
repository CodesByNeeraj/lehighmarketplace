import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './db/prisma.js'
import registerStudentRouter from './routes/registerStudent.js'
import loginStudentRouter from './routes/loginStudent.js'
import createListingRouter from './routes/createListing.js'
import viewListingsRouter from './routes/viewListings.js'
import updateListingRouter from './routes/updateListing.js'
import deleteListingRouter from './routes/deleteListing.js'
import unsaveListingRouter from './routes/unsaveListing.js'
import waitlistRouter from './routes/savetoWaitlist.js'

dotenv.config()

const app = express()
//app.use(cors({ origin: 'https://your-app.vercel.app' }))   
app.use(cors())
app.use(express.json())

app.use('/api/auth', registerStudentRouter)
app.use('/api/auth', loginStudentRouter)
app.use('/api/listings', createListingRouter)
app.use('/api/listings', viewListingsRouter)
app.use('/api/listings', updateListingRouter)
app.use('/api/listings', deleteListingRouter)
app.use('/api/listings', unsaveListingRouter)
app.use('/api/waitlist', waitlistRouter)

// app.get('/test-firewall', async (req, res) => {
//   try {
//     const result = await prisma.student.findMany()
//     res.json(result)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: err.message })
//   }
// })

// app.get('/test-block', async (req, res) => {
//   try {
//     await prisma.student.deleteMany()
//     res.json({ success: true })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// app.get('/test-operator-injection', async (req, res) => {
//   try {
//     const email = 'test@lehigh.edu'
//     const password = { not: '' }

//     const user = await prisma.student.findFirst({
//       where: { email, password_hash: password }
//     })

//     // if we get here the query ran — firewall didn't block it
//     // user will just be null since no data exists
//     // but the important thing is whether the query was ALLOWED or BLOCKED
//     res.json({ 
//       querRan: true, 
//       user,
//       message: 'Query was allowed through — operator injection not blocked by Prisma'
//     })
//   } catch (err) {
//     // if we get here the firewall blocked it
//     res.status(500).json({ 
//       blocked: true,
//       error: err.message 
//     })
//   }
// })

app.get('/health', (req, res) => res.status(200).send('ok'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
