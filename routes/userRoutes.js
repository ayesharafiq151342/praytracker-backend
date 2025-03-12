import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getData, Status_check } from '../controller/userController.js';
import prayerGuidance from '../models/prayerGuidance.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const userRoutes = express.Router();

// Middleware for authentication
userRoutes.get('/data', userAuth, getData);
userRoutes.put('/update-status', Status_check);

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// ✅ Serve Static Files
userRoutes.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Get All Prayer Guidance
userRoutes.get('/guidance', async (req, res) => {
    try {
        const guidance = await prayerGuidance.find();
        return res.json(guidance);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Create New Prayer Guidance
userRoutes.post('/guidance', upload.single('image'), async (req, res) => {
    try {
        const { category, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        
        const imagePath = `/uploads/${req.file.filename}`;
        const guidance = new prayerGuidance({ path: imagePath, category, description, fileName: req.file.filename });

        await guidance.save();
        return res.json({ success: true, message: 'Guidance added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Update Prayer Guidance
userRoutes.put('/guidance/:id', upload.single('image'), async (req, res) => {
    try {
        const { category, description } = req.body;
        const { id } = req.params;

        const guidance = await prayerGuidance.findById(id);
        if (!guidance) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // ✅ Remove old image if new image is uploaded
        if (req.file) {
            if (guidance.path && fs.existsSync(`.${guidance.path}`)) {
                fs.unlinkSync(`.${guidance.path}`);
            }
            guidance.path = `/uploads/${req.file.filename}`;
            guidance.fileName = req.file.filename;
        }

        guidance.category = category;
        guidance.description = description;
        await guidance.save();

        return res.json({ success: true, message: 'Updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Delete Prayer Guidance
userRoutes.delete('/guidance/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const guidance = await prayerGuidance.findByIdAndDelete(id);
        if (!guidance) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // ✅ Delete associated image
        if (guidance.path && fs.existsSync(`.${guidance.path}`)) {
            fs.unlinkSync(`.${guidance.path}`);
        }

        return res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default userRoutes;
