import express from 'express';
import dotenv from 'dotenv';
import  router from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

// Mounting modular routes
app.use('/api/auth', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Clean MVC Server running on port ${PORT}`));
