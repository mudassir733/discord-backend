// 1. Core Modules
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// 2. Configuration / Database
import { prisma, connectToDatabase } from "./config/database.js";


// utils
import { Container } from "./utils/container.js";

import dotenv from "dotenv";
import cors from "cors";



dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
})


app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json());

const container = new Container(io);

// 6. Register Endpoints
app.use("/auth", container.getAuthRoutes().getRouter());
app.use("/users", container.getUserRoutes().getRouter());
app.use("/password", container.getResetPasswordRoutes().getRouter());
app.use("/api", container.getFriendRoutes().getRouter());
app.use('/api/notifications', container.getNotificationRoutes().getRouter());
app.use("/api", container.getChannelRoutes().getRouter());


// start server 
async function startServer() {
    try {
        await connectToDatabase();
        console.log('Discord bot logged in');
        httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error('Server failed to start:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

startServer();