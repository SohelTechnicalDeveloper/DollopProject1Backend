import mongoose from "mongoose";

function dbConnect(URL) {
    mongoose
        .connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Database connected successfully!");
        })
        .catch((err) => {
            console.error("Database connection failed:", err.message);
            process.exit(1); // Exit the app if the DB connection fails
        });
}

export default dbConnect;
