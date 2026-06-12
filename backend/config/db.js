import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.URI);
        console.log(`MongoDB Connected ${conn.connection.host}`);
        console.log(process.env.EMAIL_PASS);
        console.log(process.env.EMAIL_USER);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}