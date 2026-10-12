import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

mongoose.connection.on("connected", () => {
    console.log(`Mongo DB Connected to host: ${mongoose.connection.name}`);
});

mongoose.connection.on("error", (err) => {
    console.error(`Mongo DB Error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongo DB Disconnected...");
});