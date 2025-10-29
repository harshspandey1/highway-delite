import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI as string)
        console.log('mongo db connected :',conn.connection.host);
    }
    catch(err:any){
        console.error(`Error:${err.message}`);
        process.exit(1);
    }
}

export default connectDB;