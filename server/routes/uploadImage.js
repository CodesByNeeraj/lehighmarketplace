import express from 'express';
import multer from 'multer';
import cloudinary from '../services/cloudinary.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

//store file in memory, only allow images
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.post('/upload-image', authenticate, upload.single('image'), async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({error: 'No image provided'});
        }

        //upload buffer directly to cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {folder: 'lehigh-marketplace'},
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        res.status(200).json({image_url: result.secure_url});

    }catch (err){
        console.error(err);
        res.status(500).json({error: 'Image upload failed'});
    }
});

export default router;
