import asyncHandler from "express-async-handler";
import User from '../models/userModel.js'; // Import User model

export const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // Use auth0Id instead of id
        // Find user by auth0 id
        const user = await User.findOne({ auth0Id:id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return user profile
        return res.status(200).json(user);
    } catch (error) {
        console.log("error in getting profile picture", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});