import 'dotenv/config';
import app from './app.js';
import { connectToDatabase } from './config/db.js';

const port = Number(process.env.PORT) || 5000;

try {
  await connectToDatabase();
  app.listen(port, () => console.log(`Feedback API listening on http://localhost:${port}`));
} catch (error) {
  if (error.name === 'MongoServerSelectionError') {
    console.error('Unable to connect to MongoDB. Check MONGODB_URI, Atlas network access, and database credentials.');
  } else {
    console.error(`Unable to start the feedback API (${error.name || 'Error'}, code ${error.code ?? 'unknown'}).`);
  }
  process.exit(1);
}
