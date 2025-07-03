import { Server } from "socket.io";
import { Server as httpServer } from "http"


export class SocketServer {

    public io: Server;

    constructor(httpServer: httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000", // Allow all origins for simplicity in development
                methods: ["GET", "POST"]
            }
        });
    }

    public listen(port: number) {
        this.io.listen(port);
    }
}