import { Server } from "socket.io";

// 3. Repositories
import { UserRepository } from "../interface-adapters/repositories/userRepository.js";
import { FriendRequestRepository } from '../interface-adapters/repositories/friendRequestRepository.js';
import { FriendshipRepository } from '../interface-adapters/repositories/friendShipRepository.js';
import { DiscordRepository } from "../interface-adapters/repositories/disordRepository.js";
import { NotificationRepository } from "../interface-adapters/repositories/notificationRepository.js";



// 4. Use Cases
import { SendFriendRequestUseCase } from '../use-case/user/SendFriendRequest.js';
import { AcceptFriendRequestUseCase } from '../use-case/user/acceptFriendRequest.js';
import { RejectFriendRequestUseCase } from "../use-case/user/rejectFriendRequest.js";
import { GetFriendsUseCase } from '../use-case/user/getFriends.js';
import { SearchUsersUseCase } from '../use-case/user/searchUsers.js';
import { CreateChannel } from "../use-case/createChannel.js";
import { GetSentFriendRequestsUseCase } from "../use-case/user/getSendFriendRequest.js";




// 5. Controllers
import { UserController } from "../interface-adapters/controllers/userController/userController.js";
import { ResetPasswordController } from "../interface-adapters/controllers/userController/resetPasswordController.js";
import { FriendController } from '../interface-adapters/controllers/userController/friendController.js';
import { ChannelController } from "../interface-adapters/controllers/channelController.js";
import { NotificationController } from "../interface-adapters/controllers/userController/notificationController.js";
import { FriendRequestController } from "../interface-adapters/controllers/userController/friendRequestcontroller.js";
import { NotificationRestController } from "../interface-adapters/controllers/userController/notificationResetController.js";



// 6. Routes
import { UserRoute } from "../interface-adapters/routes/userRoute.js";
import { ResetPasswordRoutes } from "../interface-adapters/routes/resetPasswordRoute.js";
import { FriendRoutes } from '../interface-adapters/routes/friendRoute.js';
import { ChannelRoutes } from "../interface-adapters/routes/channelRoute.js";
import { FriendRequestRoutes } from "../interface-adapters/routes/friendRequestRoute.js";
import { NotificationRoutes } from "../interface-adapters/routes/notificationRoute.js";



// utils
import { IdleScheduler } from "./idleSchedular.js";



export class Container {

    // Repositories
    private userRepository: UserRepository;
    private friendRequestRepository: FriendRequestRepository;
    private friendshipRepository: FriendshipRepository;
    private discordRepository: DiscordRepository;
    private notificationRepository: NotificationRepository;



    // Use Cases
    private sendFriendRequestUseCase: SendFriendRequestUseCase;
    private acceptFriendRequestUseCase: AcceptFriendRequestUseCase;
    private rejectFriendRequestUseCase: RejectFriendRequestUseCase;
    private getFriendsUseCase: GetFriendsUseCase;
    private searchUsersUseCase: SearchUsersUseCase;
    private createChannelUseCase: CreateChannel;
    private getSentFriendRequestsUseCase: GetSentFriendRequestsUseCase;


    // Controllers
    private userController: UserController;
    private resetPasswordController: ResetPasswordController;
    private friendController: FriendController;
    private channelController: ChannelController;
    private notificationController: NotificationController;
    private friendRequestController: FriendRequestController;
    private notificationRestController: NotificationRestController;


    // Routes
    private userRoute: UserRoute;
    private resetPasswordRoutes: ResetPasswordRoutes;
    private friendRoutes: FriendRoutes;
    private channelRoutes: ChannelRoutes;
    private friendRequestRoutes: FriendRequestRoutes;
    private notificationRoutes: NotificationRoutes;

    // utils
    private idleScheduler: IdleScheduler;



    constructor(io: Server) {
        // 3. Repositories
        this.userRepository = new UserRepository();
        this.friendRequestRepository = new FriendRequestRepository();
        this.friendshipRepository = new FriendshipRepository();
        this.discordRepository = new DiscordRepository();
        this.notificationRepository = new NotificationRepository();



        // Idle Scheduler
        this.idleScheduler = new IdleScheduler(
            async (userId: string) => {
                try {
                    await this.userRepository.updateUserStatus(userId, 'idle');
                } catch (error) {
                    console.error(`Error setting user ${userId} to idle:`, error);
                }

            },
            null as any,
        );



        // Notification Controller
        this.notificationController = new NotificationController(
            io,
            this.friendshipRepository,
            this.userRepository,
            this.idleScheduler
        );
        this.idleScheduler.setNotificationController(this.notificationController);

        // Use Cases
        this.sendFriendRequestUseCase = new SendFriendRequestUseCase(
            this.userRepository,
            this.friendRequestRepository,
            this.friendshipRepository,
            this.notificationRepository,
            this.notificationController
        );
        this.acceptFriendRequestUseCase = new AcceptFriendRequestUseCase(
            this.userRepository,
            this.friendRequestRepository,
            this.friendshipRepository,
            this.notificationRepository,
            this.notificationController
        );
        this.rejectFriendRequestUseCase = new RejectFriendRequestUseCase(
            this.userRepository,
            this.friendRequestRepository,
            this.notificationRepository,
            this.notificationController
        );
        this.getFriendsUseCase = new GetFriendsUseCase(this.friendshipRepository, this.userRepository);
        this.getSentFriendRequestsUseCase = new GetSentFriendRequestsUseCase(this.friendRequestRepository);
        this.searchUsersUseCase = new SearchUsersUseCase(this.userRepository);
        this.createChannelUseCase = new CreateChannel(this.discordRepository);



        this.userController = new UserController(this.userRepository, this.notificationController, this.idleScheduler);
        this.resetPasswordController = new ResetPasswordController(this.userRepository);
        this.friendController = new FriendController(
            this.sendFriendRequestUseCase,
            this.acceptFriendRequestUseCase,
            this.rejectFriendRequestUseCase,
            this.getFriendsUseCase,
            this.searchUsersUseCase,
            this.getSentFriendRequestsUseCase
        );
        this.friendRequestController = new FriendRequestController(this.userRepository);
        this.channelController = new ChannelController(this.createChannelUseCase);
        this.notificationRestController = new NotificationRestController(this.notificationRepository);



        // Routes
        this.userRoute = new UserRoute(this.userController);
        this.resetPasswordRoutes = new ResetPasswordRoutes(this.resetPasswordController);
        this.friendRoutes = new FriendRoutes(this.friendController);
        this.friendRequestRoutes = new FriendRequestRoutes(this.friendRequestController);
        this.channelRoutes = new ChannelRoutes(this.channelController);
        this.notificationRoutes = new NotificationRoutes(this.notificationRestController);

    }



    getUserRoutes(): UserRoute {
        return this.userRoute;
    }

    getResetPasswordRoutes(): ResetPasswordRoutes {
        return this.resetPasswordRoutes;
    }

    getFriendRoutes(): FriendRoutes {
        return this.friendRoutes;
    }

    getFriendRequestRoutes(): FriendRequestRoutes {
        return this.friendRequestRoutes;
    }

    getChannelRoutes(): ChannelRoutes {
        return this.channelRoutes;
    }

    getNotificationRoutes(): NotificationRoutes {
        return this.notificationRoutes;
    }

    getDiscordRepository(): DiscordRepository {
        return this.discordRepository;
    }
}