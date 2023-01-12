import mongoose from "mongoose";

export async function connectToMongo() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URI!);
        console.log("Connected to database!");
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}
