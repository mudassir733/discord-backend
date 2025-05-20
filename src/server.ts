import express from "express";
import { prisma, connectToDatabase } from "./config/database.js"
import { UserRepository } from "./interface-adapters/repositories/userRepository.js"
import { UserController } from "./interface-adapters/controllers/userController.js"
import { UserRoute } from "./interface-adapters/routes/userRoute.js"
import { ResetPasswordController } from "./interface-adapters/controllers/resetPasswordController.js";
import { ResetPasswordRoutes } from "./interface-adapters/routes/resetPasswordRoute.js";
import { DiscordRepository } from "./interface-adapters/repositories/disordRepository.js";
import { CreateChannel } from "./use-case/createChannel.js";
import { ChannelRoutes } from "./interface-adapters/routes/channelRoute.js";
import { ChannelController } from "./interface-adapters/controllers/channelController.js";

import { FriendRequestRepository } from './interface-adapters/repositories/friendRequestRepository.js';
import { FriendshipRepository } from './interface-adapters/repositories/friendShipRepository.js';
import { SendFriendRequestUseCase } from './use-case/SendFriendRequest.js';
import { AcceptFriendRequestUseCase } from './use-case/acceptFriendRequest.js';
import { GetFriendsUseCase } from './use-case/getFriends.js';
import { SearchUsersUseCase } from './use-case/searchUsers.js';
import { FriendController } from './interface-adapters/controllers/friendController.js';
import { FriendRoutes } from './interface-adapters/routes/friendRoute.js';

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

// Dependency Injection
const userRepository = new UserRepository()
const userController = new UserController(userRepository)
const userRoutes = new UserRoute(userController)
const resetPasswordController = new ResetPasswordController(userRepository);
const resetPasswordRoutes = new ResetPasswordRoutes(resetPasswordController);
const discordRepository = new DiscordRepository();
const createChannel = new CreateChannel(discordRepository);
const channelController = new ChannelController(createChannel);
const channelRoutes = new ChannelRoutes(channelController);
const friendRequestRepository = new FriendRequestRepository();
const friendshipRepository = new FriendshipRepository();
const sendFriendRequestUseCase = new SendFriendRequestUseCase(userRepository, friendRequestRepository, friendshipRepository);
const acceptFriendRequestUseCase = new AcceptFriendRequestUseCase(friendRequestRepository, friendshipRepository);
const getFriendsUseCase = new GetFriendsUseCase(friendshipRepository, userRepository);
const searchUsersUseCase = new SearchUsersUseCase(userRepository);
const friendController = new FriendController(
    sendFriendRequestUseCase,
    acceptFriendRequestUseCase,
    getFriendsUseCase,
    searchUsersUseCase
);
const friendRoutes = new FriendRoutes(friendController);

// end points
app.use('/api', friendRoutes.getRouter());
app.use("/users", userRoutes.getRouter())
app.use('/password', resetPasswordRoutes.getRouter());
app.use("/api", channelRoutes.getRouter())




// start server 
async function startServer() {
    try {
        await connectToDatabase()
        await discordRepository.login(process.env.DISCORD_BOT_TOKEN!);
        console.log('Discord bot logged in');
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