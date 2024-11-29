import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

  function dbConnect() 
 {
     mongoose.connect(process.env.MONGOURL)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

    // console.log("dbConnect");
    
 }
    
 export default dbConnect


// import mongoose from "mongoose";

// function dbConnect(URL) {
//     mongoose
//         .connect(URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         .then(() => {
//             console.log("Database connected successfully!");
//         })
//         .catch((err) => {
//             console.error("Database connection failed:", err.message);
//             process.exit(1); // Exit the app if the DB connection fails
//         });
// }

// export default dbConnect;
