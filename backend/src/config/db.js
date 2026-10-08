import mongoose from 'mongoose';

export async function connectToDatabase() {
  // MONGO_URI stays supported for existing deployments during the rename.
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env before starting the server.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}
