import mongoose from "mongoose";


export const connectDB = async () =>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB...', error));

}