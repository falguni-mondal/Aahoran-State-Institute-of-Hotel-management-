import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure if the database connection drops or fails
    process.exit(1);
  }
};

export default connectDB;