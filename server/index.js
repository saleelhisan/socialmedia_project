import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';                         
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import {register} from "./controllers/auth.js"
import { verifytoken } from './middleware/auth.js';

//configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));                                           //for logging http requests
app.use(bodyParser.json({limit:"30mb",extended:true}))                // 
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')));


//file storage

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'public/assets');
    },
    filename : function(req,file,cb){
        cb(null,file.originalname);

    }
});

const upload = multer({storage})

//routes with files
app.post("/auth/register",upload.single("picture"),register)

//routes
app.use('/auth',authRoutes)
app.use('/users',userRoutes)

//mongoose setup

const PORT = process.env.PORT || 6001;

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true 
})
.then(()=>{
    app.listen(PORT,()=>console.log(`Server Port :${PORT}`));
    console.log('database connected');
})
.catch((error)=>{
    console.log(`${error} did not connect`);

})



