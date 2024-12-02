import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

  function dbConnect() 
 {
   console.log(process.env.MONGOURL);
     
   mongoose.connect(process.env.MONGOURL || 'mongodb+srv://sohelkhanp619:xe1lem3XwliDv8dO@cluster0.5cvyl.mongodb.net/LoginSignup')

  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));    
 }
    
 export default dbConnect
