import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './db/connect.js';
import fs from "fs";
import asyncHandler from 'express-async-handler'; // Import asyncHandler
import User from './models/userModel.js'; // Import User model
import {log} from "console"
dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes:{
    postLogoutRedirect: process.env.CLIENT_URL,
    callback: "/callback",
    logout: "/logout",
    login: "/login",
  }
  // Add state parameter to avoid BadRequestError
 
};


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auth(config));





// Function to check if user exists in db
const ensureUserInDB = asyncHandler(async (user) => {
    try {
        const existingUser = await User.findOne({ auth0Id: user.sub });
        if (!existingUser) {
            const newUser = new User({
                auth0Id: user.sub,
                name: user.name,
                email: user.email,
                
                role: "jobseeker",
                profilePicture: user.picture,
            });
            await newUser.save();
            console.log("New user created", user);
        } else {
            console.log("User already exists", user);
        }
    } catch (error) {
        console.log("error", error.message);
    }
});

app.get("/", async (req, res) => {
    if (req.oidc.isAuthenticated()) {
        await ensureUserInDB(req.oidc.user);
        // Redirect to frontend
        return res.redirect(process.env.CLIENT_URL);
    } else {
        return res.send("You are not logged in");
    }
});

// Routes
const routeFiles = fs.readdirSync('./routes');

routeFiles.forEach((file) => {
    // Import dynamic routes
    import(`./routes/${file}`)
    .then((route) => {
        app.use("/api/v1/", route.default);
    }).catch((error) => {
        console.log("error importing route", error);
    });
});

const server = async () => {
    try {
        await connect();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("err", error.message);
        process.exit(1);
    }
}

server();