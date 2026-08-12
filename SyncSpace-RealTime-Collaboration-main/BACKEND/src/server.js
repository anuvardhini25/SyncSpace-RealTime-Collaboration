import dotenv from 'dotenv';
dotenv.config();
console.log("PORT =", process.env.PORT);

import http from 'http';
import { Server } from 'socket.io';

import app from './app.js';
import connectDB from './config/db.js';
import initializeSockets from './sockets/index.js';
import socketAuth from './sockets/socketAuth.js';
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5172",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  },
});

io.use(socketAuth);
initializeSockets(io);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Socket.IO attached and listening');
  });
});