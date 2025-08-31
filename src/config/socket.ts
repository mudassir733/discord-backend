import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as httpServer } from "http";
import { ISocketRepository } from "../interfaces/ISocketRepository.js";


export class SocketIOService implements ISocketRepository {
    private io: SocketIOServer;
    private eventHandlers: Map<string, (clientId: string, data: any) => void> = new Map();
    private userSocketMap: Map<number, string> = new Map();

    constructor(httpServer: httpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "http://localhost:3000", // Allow all origins for simplicity in development
                methods: ["GET", "POST", "PUT", "PATCH"]
            }
        });
    }

    start(): void {
        this.io.on('connection', (socket: Socket) => {
            const clientId = socket.id;
            console.log(`Client connected: ${clientId}`);

            // Apply all registered event handlers to this socket
            this.eventHandlers.forEach((handler, event) => {
                socket.on(event, (data: any) => {
                    handler(clientId, data);
                });
            });

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${clientId}`);
            });
        });
    }

    emitToClient(clientId: string, event: string, data: any): void {
        this.io.to(clientId).emit(event, data);
    }

    onClientEvent(event: string, handler: (clientId: string, data: any) => void): void {
        this.eventHandlers.set(event, handler);
        // Apply the handler to all currently connected sockets
        this.io.sockets.sockets.forEach((socket) => {
            socket.on(event, (data: any) => {
                handler(socket.id, data);
            });
        });
    }


    setUserSocket(userId: number, clientId: string): void {
        this.userSocketMap.set(userId, clientId);
    }

    getClientId(userId: number): string | undefined {
        return this.userSocketMap.get(userId);
    }
}

