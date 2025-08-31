import { Router } from "express";
import { ChannelController } from "../../controllers/channelController.js";

export class ChannelRoutes {
    private router: Router = Router();
    private controller: ChannelController

    constructor(controller: ChannelController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post('/create-channel', this.controller.createChannel.bind(this.controller));
    }
    getRouter(): Router {
        return this.router;
    }
}