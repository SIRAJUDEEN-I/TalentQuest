import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './db/connect.js';

dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(cors({
    orgin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(auth(config));

const server = async () => {
    try {
        await connect();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("err",error.message);
        process.exit(1);
    }
}

server();