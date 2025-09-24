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
app.use(hamlet({ contentSecurityPolicy: false, })) 

// Parse JSON bodies
app.use(express.json());



// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173'], // your React dev server
 
}));

app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));

// Routes
app.use('/api', Authrouter);
app.use('/api', PropertyRouter);



if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware (always last!)
app.use(NotFound);
app.use(ErrorHandle);

// Connect to MongoDB
mongoose.connect(process.env.NODE_ENV === "development" ? process.env.mongodb_url : process.env.Mongodb_pro)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => console.log('❌ MongoDB Connection Error:', error));

// Start server
app.listen(Port, () => {
  console.log(`🚀 Server running on port ${Port}`);
});
