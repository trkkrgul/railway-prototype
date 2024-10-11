import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

console.log(`Connecting to mongodb : ${process.env.MONGODB_URL}`);
const connectToDB = () => mongoose.connect(process.env.MONGODB_URL);

const conn = mongoose.connection;

export default connectToDB;
export { connectToDB, conn };
