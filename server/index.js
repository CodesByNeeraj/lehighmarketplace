import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import registerStudentRouter from './routes/registerStudent.js'
import loginStudentRouter from './routes/loginStudent.js'
import createListingRouter from './routes/createListing.js'
import viewListingsRouter from './routes/viewListings.js'
import updateListingRouter from './routes/updateListing.js'
import deleteListingRouter from './routes/deleteListing.js'
import unsaveListingRouter from './routes/unsaveListing.js'
import saveListingRouter from './routes/saveListing.js'
import waitlistRouter from './routes/savetoWaitlist.js'
import uploadImageRouter from './routes/uploadImage.js'
import weatherRouter from './routes/getWeather.js'
import getProfileRouter from './routes/getProfile.js'
import updateProfileRouter from './routes/updateProfile.js'
import getMessagesRouter from './routes/getMessages.js'
import sendMessagesRouter from './routes/postMessages.js'
import updatePasswordRouter from './routes/updatePassword.js'
import adminDeleteListingRouter from './routes/admindeleteListing.js'
import adminLoginRouter from './routes/adminlogin.js'
import getDeletedListingsRouter from './routes/getdeletedListings.js'

dotenv.config()

const app = express()
const fronteend_prod_url = process.env.FRONTEND_PROD_URL
const allowedOrigin = process.env.NODE_ENV === 'production'
? fronteend_prod_url
: 'http://localhost:5173'

app.use(cors({origin:allowedOrigin}))
app.use(express.json())

app.use('/api/auth', registerStudentRouter)
app.use('/api/auth', loginStudentRouter)
app.use('/api/auth', updatePasswordRouter)
app.use('/api/profile',getProfileRouter)
app.use('/api/profile',updateProfileRouter)
app.use('/api/listings', createListingRouter)
app.use('/api/listings', viewListingsRouter)
app.use('/api/listings', updateListingRouter)
app.use('/api/listings', deleteListingRouter)
app.use('/api/listings', unsaveListingRouter)
app.use('/api/listings', saveListingRouter)
app.use('/api/waitlist', waitlistRouter)
app.use('/api/upload', uploadImageRouter)
app.use('/api/current',weatherRouter)
app.use('/api/messages', getMessagesRouter)
app.use('/api/messages', sendMessagesRouter)
app.use('/api/admin', adminDeleteListingRouter)
app.use('/api/admin', adminLoginRouter)
app.use('/api/admin', getDeletedListingsRouter)


app.get('/health', (req, res) => res.status(200).send('ok'))
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app