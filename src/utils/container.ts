import { Server } from "socket.io";

// 3. Repositories
import { UserRepository } from "../interface-adapters/repositories/userRepository.js";
import { FriendRequestRepository } from '../interface-adapters/repositories/friendRequestRepository.js';
import { FriendshipRepository } from '../interface-adapters/repositories/friendShipRepository.js';
import { DiscordRepository } from "../interface-adapters/repositories/disordRepository.js";
import { NotificationRepository } from "../interface-adapters/repositories/notificationRepository.js";
import { ChannelRepository } from "../interface-adapters/repositories/chat-repositories/channel-repository.js";
import { ChannelMemebersRepository } from "../interface-adapters/repositories/chat-repositories/channel-members-repository.js";
import { MessageRepository } from "../interface-adapters/repositories/chat-repositories/messages-repository.js";


// 4. Use Cases
import { SendFriendRequestUseCase } from '../use-case/userUseCase/SendFriendRequest.js';
import { AcceptFriendRequestUseCase } from '../use-case/userUseCase/acceptFriendRequest.js';
import { RejectFriendRequestUseCase } from "../use-case/userUseCase/rejectFriendRequest.js";
import { GetFriendsUseCase } from '../use-case/userUseCase/getFriends.js';
import { SearchUsersUseCase } from '../use-case/userUseCase/searchUsers.js';
import { CreateChannel } from "../use-case/createChannel.js";
import { GetSentFriendRequestsUseCase } from "../use-case/userUseCase/getSendFriendRequest.js";
import { createDirectChannelUseCase } from "../use-case/chatUseCase/create-direct-channel.js";
import { CreateGroupChannelUseCase } from "../use-case/chatUseCase/create-group-channel.js";
import { joinChannelUseCase } from "../use-case/chatUseCase/join-channel.js";
import { SendMessageUseCase } from "../use-case/chatUseCase/send-message.js";




// 5. Controllers
import { UserController } from "../interface-adapters/controllers/userController/userController.js";
import { ResetPasswordController } from "../interface-adapters/controllers/userController/resetPasswordController.js";
import { FriendController } from '../interface-adapters/controllers/userController/friendController.js';
import { ChannelController } from "../interface-adapters/controllers/channelController.js";
import { NotificationController } from "../interface-adapters/controllers/userController/notificationController.js";
import { FriendRequestController } from "../interface-adapters/controllers/userController/friendRequestcontroller.js";
import { NotificationRestController } from "../interface-adapters/controllers/userController/notificationResetController.js";
import { ChatController } from "../interface-adapters/controllers/chatController/chat-controller.js";
import { SocketController } from "../interface-adapters/controllers/socket-controller.js";


// 6. Routes
import { UserRoute } from "../interface-adapters/routes/userRoute.js";
import { ResetPasswordRoutes } from "../interface-adapters/routes/resetPasswordRoute.js";
import { FriendRoutes } from '../interface-adapters/routes/friendRoute.js';
import { ChannelRoutes } from "../interface-adapters/routes/channelRoute.js";
import { FriendRequestRoutes } from "../interface-adapters/routes/friendRequestRoute.js";
import { NotificationRoutes } from "../interface-adapters/routes/notificationRoute.js";
import { ChatRoutes } from "../interface-adapters/routes/chat-routes/chat.routes.js";



// utils
import { IdleScheduler } from "./idleSchedular.js";



export class Container {

    // Repositories
    private userRepository: UserRepository;
    private friendRequestRepository: FriendRequestRepository;
    private friendshipRepository: FriendshipRepository;
    private discordRepository: DiscordRepository;
    private notificationRepository: NotificationRepository;
    private channelRepository: ChannelRepository;
    private channelMembersRepository: ChannelMemebersRepository;
    private messageRepository: MessageRepository;


    // Use Cases
    private sendFriendRequestUseCase: SendFriendRequestUseCase;
    private acceptFriendRequestUseCase: AcceptFriendRequestUseCase;
    private rejectFriendRequestUseCase: RejectFriendRequestUseCase;
    private getFriendsUseCase: GetFriendsUseCase;
    private searchUsersUseCase: SearchUsersUseCase;
    private createChannelUseCase: CreateChannel;
    private getSentFriendRequestsUseCase: GetSentFriendRequestsUseCase;
    private createDirectChannelUseCase: createDirectChannelUseCase;
    private createGroupChannelUseCase: CreateGroupChannelUseCase;
    private joinChannelUseCase: joinChannelUseCase;
    private sendMessageUseCase: SendMessageUseCase;

    // Controllers
    private userController: UserController;
    private resetPasswordController: ResetPasswordController;
    private friendController: FriendController;
    private channelController: ChannelController;
    private notificationController: NotificationController;
    private friendRequestController: FriendRequestController;
    private notificationRestController: NotificationRestController;
    private chatController: ChatController;
    private socketController: SocketController;


    // Routes
    private userRoute: UserRoute;
    private resetPasswordRoutes: ResetPasswordRoutes;
    private friendRoutes: FriendRoutes;
    private channelRoutes: ChannelRoutes;
    private friendRequestRoutes: FriendRequestRoutes;
    private notificationRoutes: NotificationRoutes;
    private chatRoutes: ChatRoutes;

    // utils
    private idleScheduler: IdleScheduler;



    constructor(io: Server) {
        // 3. Repositories
        this.userRepository = new UserRepository();
        this.friendRequestRepository = new FriendRequestRepository();
        this.friendshipRepository = new FriendshipRepository();
        this.discordRepository = new DiscordRepository();
        this.notificationRepository = new NotificationRepository();
        this.channelRepository = new ChannelRepository();
        this.channelMembersRepository = new ChannelMemebersRepository();
        this.messageRepository = new MessageRepository();


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
        this.createDirectChannelUseCase = new createDirectChannelUseCase(
            this.channelRepository,
            this.channelMembersRepository,
            this.userRepository
        );
        this.createGroupChannelUseCase = new CreateGroupChannelUseCase(
            this.channelRepository,
            this.channelMembersRepository
        );
        this.joinChannelUseCase = new joinChannelUseCase(this.channelRepository, this.channelMembersRepository);
        this.sendMessageUseCase = new SendMessageUseCase(this.messageRepository, this.channelMembersRepository);

        // Controllers
        this.socketController = new SocketController(
            io,
            this.channelMembersRepository,
            this.sendMessageUseCase,
            this.joinChannelUseCase
        );
        // Inject socketController into use cases
        this.joinChannelUseCase.setSocketController(this.socketController);
        this.createDirectChannelUseCase.setSocketController(this.socketController);
        this.createGroupChannelUseCase.setSocketController(this.socketController);

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
        this.chatController = new ChatController(
            this.createGroupChannelUseCase,
            this.createDirectChannelUseCase,
            this.joinChannelUseCase,
            this.messageRepository
        );


        // Routes
        this.userRoute = new UserRoute(this.userController);
        this.resetPasswordRoutes = new ResetPasswordRoutes(this.resetPasswordController);
        this.friendRoutes = new FriendRoutes(this.friendController);
        this.friendRequestRoutes = new FriendRequestRoutes(this.friendRequestController);
        this.channelRoutes = new ChannelRoutes(this.channelController);
        this.notificationRoutes = new NotificationRoutes(this.notificationRestController);
        this.chatRoutes = new ChatRoutes(this.chatController);

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

    getChatRoutes(): ChatRoutes {
        return this.chatRoutes;
    }

    getDiscordRepository(): DiscordRepository {
        return this.discordRepository;
    }
}