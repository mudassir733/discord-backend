import express from "express";
import { prisma, connectToDatabase } from "./config/database.js"
import { UserRepository } from "./interface-adapters/repositories/userRepository.js"
import { UserController } from "./interface-adapters/controllers/userController.js"
import { UserRoute } from "./interface-adapters/routes/userRoute.js"
import dotenv from "dotenv";


dotenv.config();
console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
const PORT = process.env.PORT || 6000;
const app = express();
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


