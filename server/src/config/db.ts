// server/src/config/db.ts (No Changes Needed)

import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const connectDB=async()=>{
    try{
        // MONGO_URI must be set as an environment variable on Railway
        const conn=await mongoose.connect(process.env.MONGO_URI as string)
        console.log('mongo db connected :',conn.connection.host);
    }
    catch(err:any){
        console.error(`Error:${err.message}`);
        // Exit process if DB connection fails
        process.exit(1); 
    }
}

export default connectDB;