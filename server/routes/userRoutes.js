import express from 'express';
import { getUserProfile } from '../controllers/userController.js'; // Ensure this import is correct

const router = express.Router();

router.get('/check-auth', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        return res.status(200).json({
            isAuthenticated: true,
            user: req.oidc.user,
        });
    } else {
        return res.status(200).json(false);
    }
});

router.get('/user/:id', getUserProfile); 

export default router;