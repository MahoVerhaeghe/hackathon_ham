import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import indexRouter from '.';
import {session_secret} from './config'
import cors from 'cors'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { mongo_cluster } from './config';
import { MongoClient } from 'mongodb';

const app = express();

// app.use(cors({
//   origin: ['http://localhost:3000', 'https://cocommandapp-h1c-hanslys-projects.vercel.app', 'https://cocommandapp.onrender.com'],
//   credentials: true,
//   allowedHeaders: 'Content-Type',
// }));

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// export let mongoClient;

// async function connectToCluster(){
//   try {
//       mongoClient = new MongoClient(mongo_cluster);
//       console.log('Connecting to MongoDB Atlas cluster...');
//       await mongoClient.connect();
//       console.log('Successfully connected to MongoDB Atlas!');
//       return mongoClient;
//   } catch (error) {
//       console.error('Connection to MongoDB Atlas failed!', error);
//   }
// }



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
   secret: `${session_secret}`,
   resave: false,
   proxy: true,
 cookie: {
      sameSite: 'none',
      secure: true,
      //httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
},
  saveUninitialized: false,
}));


app.use('/', indexRouter);

export default app;
