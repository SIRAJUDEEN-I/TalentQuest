import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './db/connect.js';
import fs from "fs";


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

app.use(auth(config));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

app.get('/hello', (req, res) => {
    res.send('Hello World');
});

//routes
const routeFiles  = fs.readdirSync('./routes');

routeFiles.forEach((file) => {
    import(`./routes/${file}`).then((route) => {
        app.use(route.default);
    })
    .catch((error) =>{
        console.log("error importing route",error);
        
    });
});

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