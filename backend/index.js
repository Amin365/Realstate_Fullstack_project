import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { ErrorHandle } from './middleware/ErrorHanlde.js';
import { NotFound } from './middleware/NotFound.js';
import Authrouter from './routes/userAuth.js';
import PropertyRouter from './routes/PropertRoutes.js';

dotenv.config();

const Port = process.env.PORT || 4300;
const app = express();

// Security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json());



// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173'], // your React dev server
 
}));

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use('/api', Authrouter);
app.use('/api', PropertyRouter);





// Error handling middleware (always last!)
app.use(NotFound);
app.use(ErrorHandle);

// Connect to MongoDB
mongoose.connect(process.env.mongodb_url)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => console.log('❌ MongoDB Connection Error:', error));

// Start server
app.listen(Port, () => {
  console.log(`🚀 Server running on port ${Port}`);
});
