// 1. Core Modules
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// 2. Configuration / Database
import { prisma, connectToDatabase } from "./config/database.js";

// 3. Repositories
import { UserRepository } from "./interface-adapters/repositories/userRepository.js";
import { FriendRequestRepository } from './interface-adapters/repositories/friendRequestRepository.js';
import { FriendshipRepository } from './interface-adapters/repositories/friendShipRepository.js';
import { DiscordRepository } from "./interface-adapters/repositories/disordRepository.js";
import { NotificationRepository } from "./interface-adapters/repositories/notificationRepository.js";

// 4. Use Cases
import { SendFriendRequestUseCase } from './use-case/userUseCase/SendFriendRequest.js';
import { AcceptFriendRequestUseCase } from './use-case/userUseCase/acceptFriendRequest.js';
import { RejectFriendRequestUseCase } from "./use-case/userUseCase/rejectFriendRequest.js";
import { GetFriendsUseCase } from './use-case/userUseCase/getFriends.js';
import { SearchUsersUseCase } from './use-case/userUseCase/searchUsers.js';
import { CreateChannel } from "./use-case/createChannel.js";

// 5. Controllers
import { UserController } from "./interface-adapters/controllers/userController/userController.js";
import { ResetPasswordController } from "./interface-adapters/controllers/userController/resetPasswordController.js";
import { FriendController } from './interface-adapters/controllers/userController/friendController.js';
import { ChannelController } from "./interface-adapters/controllers/channelController.js";
import { NotificationController } from "./interface-adapters/controllers/userController/notificationController.js";

// 6. Routes
import { UserRoute } from "./interface-adapters/routes/userRoute.js";
import { ResetPasswordRoutes } from "./interface-adapters/routes/resetPasswordRoute.js";
import { FriendRoutes } from './interface-adapters/routes/friendRoute.js';
import { ChannelRoutes } from "./interface-adapters/routes/channelRoute.js";


// utils
import { IdleScheduler } from "./utils/idleSchedular.js";

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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// 1. Core Repositories
const userRepository = new UserRepository();
const friendRequestRepository = new FriendRequestRepository();
const friendshipRepository = new FriendshipRepository();
const notificationRepository = new NotificationRepository();
const discordRepository = new DiscordRepository();

// 2. Socket Controllers
const notificationController = new NotificationController(io, friendshipRepository);

// Idle Scheduler
const idleScheduler = new IdleScheduler(
    async (userId) => {
        await userRepository.updateUserStatus(userId, 'idle');
    },
    notificationController
);

// 3. Use Cases
const sendFriendRequestUseCase = new SendFriendRequestUseCase(
    userRepository,
    friendRequestRepository,
    friendshipRepository,
    notificationRepository,
    notificationController
);

const acceptFriendRequestUseCase = new AcceptFriendRequestUseCase(
    friendRequestRepository,
    friendshipRepository,
    notificationRepository,
    notificationController
);

const rejectFriendRequestUseCase = new RejectFriendRequestUseCase(
    friendRequestRepository,
    notificationRepository,
    notificationController
);

const getFriendsUseCase = new GetFriendsUseCase(
    friendshipRepository,
    userRepository
);

const searchUsersUseCase = new SearchUsersUseCase(userRepository);

const createChannel = new CreateChannel(discordRepository);

// 4. Controllers
const userController = new UserController(userRepository, notificationController, idleScheduler);
const resetPasswordController = new ResetPasswordController(userRepository);
const friendController = new FriendController(
    sendFriendRequestUseCase,
    acceptFriendRequestUseCase,
    rejectFriendRequestUseCase,
    getFriendsUseCase,
    searchUsersUseCase
);
const channelController = new ChannelController(createChannel);

// 5. Routes
const userRoutes = new UserRoute(userController);
const resetPasswordRoutes = new ResetPasswordRoutes(resetPasswordController);
const friendRoutes = new FriendRoutes(friendController);
const channelRoutes = new ChannelRoutes(channelController);

// 6. Register Endpoints
app.use("/users", userRoutes.getRouter());
app.use("/password", resetPasswordRoutes.getRouter());
app.use("/api", friendRoutes.getRouter());
app.use("/api", channelRoutes.getRouter());




// start server 
async function startServer() {
    try {
        await connectToDatabase()
        await discordRepository.login(process.env.DISCORD_BOT_TOKEN!);
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