import { Server } from "socket.io";

// 3. Repositories
import { UserRepository } from "../interface-adapters/repositories/userRepository.js";
import { FriendRequestRepository } from '../interface-adapters/repositories/friendRequestRepository.js';
import { FriendshipRepository } from '../interface-adapters/repositories/friendShipRepository.js';
import { DiscordRepository } from "../interface-adapters/repositories/disordRepository.js";
import { NotificationRepository } from "../interface-adapters/repositories/notificationRepository.js";



// 4. Use Cases
import { SendFriendRequestUseCase } from '../use-case/friend-sys/send.friend.request.js';
import { AcceptFriendRequestUseCase } from '../use-case/friend-sys/accept.friend.request.js';
import { RejectFriendRequestUseCase } from "../use-case/friend-sys/reject.friend.request.js";
import { GetIncomingFriendRequests } from "../use-case/friend-sys/get.incomming.friend.request.js";
import { GetFriendsUseCase } from '../use-case/friend-sys/get.friends.js';
import { SearchUsersUseCase } from '../use-case/user/searchUsers.js';
import { CreateChannel } from "../use-case/channels/createChannel.js";
import { GetSentFriendRequestsUseCase } from "../use-case/friend-sys/get.send.request.js";




// 5. Controllers
import { UserController } from "../interface-adapters/controllers/user/user.controller.js";
import { ResetPasswordController } from "../interface-adapters/controllers/auth/reset.password.controller.js";
import { FriendController } from '../interface-adapters/controllers/friend-sys/friend.controller.js';
import { ChannelController } from "../interface-adapters/controllers/channelController.js";
import { SocketNotificationController } from "../interface-adapters/controllers/userController/notificationController.js";
import { NotificationController } from "../interface-adapters/controllers/notifications/notification.controller.js";



// 6. Routes
import { UserRoute } from "../interface-adapters/routes/user/user.route.js";
import { ResetPasswordRoutes } from "../interface-adapters/routes/auth/reset.password.route.js";
import { FriendRoutes } from '../interface-adapters/routes/friend-sys/friend.route.js';
import { ChannelRoutes } from "../interface-adapters/routes/channel/channelRoute.js";
import { NotificationRoutes } from "../interface-adapters/routes/notifications/notification.route.js";



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
    private getIncomingFriendRequests: GetIncomingFriendRequests;
    private getFriendsUseCase: GetFriendsUseCase;
    private searchUsersUseCase: SearchUsersUseCase;
    private createChannelUseCase: CreateChannel;
    private getSentFriendRequestsUseCase: GetSentFriendRequestsUseCase;


    // Controllers
    private userController: UserController;
    private resetPasswordController: ResetPasswordController;
    private friendController: FriendController;
    private channelController: ChannelController;
    private socketNotificationController: SocketNotificationController;
    private notificationController: NotificationController;


    // Routes
    private userRoute: UserRoute;
    private resetPasswordRoutes: ResetPasswordRoutes;
    private friendRoutes: FriendRoutes;
    private channelRoutes: ChannelRoutes;
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
        this.socketNotificationController = new SocketNotificationController(
            io,
            this.friendshipRepository,
            this.userRepository,
            this.idleScheduler
        );
        this.idleScheduler.setNotificationController(this.socketNotificationController);

        // Use Cases
        this.sendFriendRequestUseCase = new SendFriendRequestUseCase(
            this.userRepository,
            this.friendRequestRepository,
            this.friendshipRepository,
            this.notificationRepository,
            this.socketNotificationController
        );
        this.acceptFriendRequestUseCase = new AcceptFriendRequestUseCase(
            this.userRepository,
            this.friendRequestRepository,
            this.friendshipRepository,
            this.notificationRepository,
            this.socketNotificationController
        );
        this.rejectFriendRequestUseCase = new RejectFriendRequestUseCase(
            this.userRepository,
            this.friendRequestRepository,
            this.notificationRepository,
            this.socketNotificationController
        );
        this.getIncomingFriendRequests = new GetIncomingFriendRequests(this.userRepository);


        this.getFriendsUseCase = new GetFriendsUseCase(this.friendshipRepository, this.userRepository);
        this.getSentFriendRequestsUseCase = new GetSentFriendRequestsUseCase(this.friendRequestRepository);
        this.searchUsersUseCase = new SearchUsersUseCase(this.userRepository);
        this.createChannelUseCase = new CreateChannel(this.discordRepository);



        this.userController = new UserController(this.userRepository);
        this.resetPasswordController = new ResetPasswordController(this.userRepository);
        this.friendController = new FriendController(
            this.sendFriendRequestUseCase,
            this.acceptFriendRequestUseCase,
            this.rejectFriendRequestUseCase,
            this.getFriendsUseCase,
            this.searchUsersUseCase,
            this.getSentFriendRequestsUseCase,
            this.getIncomingFriendRequests
        );
        this.channelController = new ChannelController(this.createChannelUseCase);
        this.notificationController = new NotificationController(this.notificationRepository);



        // Routes
        this.userRoute = new UserRoute(this.userController);
        this.resetPasswordRoutes = new ResetPasswordRoutes(this.resetPasswordController);
        this.friendRoutes = new FriendRoutes(this.friendController);
        this.channelRoutes = new ChannelRoutes(this.channelController);
        this.notificationRoutes = new NotificationRoutes(this.notificationController);

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