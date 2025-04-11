import express from "express";
import { prisma, connectToDatabase } from "./config/database.js"
import { UserRepository } from "./interface-adapters/repositories/userRepository.js"
import { UserController } from "./interface-adapters/controllers/userController.js"
import { UserRoute } from "./interface-adapters/routes/userRoute.js"
import dotenv from "dotenv";
import cors from "cors"




dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());


const userRepository = new UserRepository()
const userController = new UserController(userRepository)
const userRoutes = new UserRoute(userController)

app.use("/users", userRoutes.getRouter())


// start server 
async function startServer() {
    try {
        await connectToDatabase()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
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


