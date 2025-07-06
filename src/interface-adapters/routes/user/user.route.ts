import express, { Router } from "express";
import { UserController } from "../../controllers/user/user.controller.js";


export class UserRoute {
    private router: Router = express.Router();
    private controller: UserController;

    constructor(controller: UserController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get('/me/:id', (req, res) => this.controller.getUserById(req, res));
        this.router.get('/me', (req, res) => this.controller.getAllUser(req, res))
    }
    getRouter(): Router {
        return this.router;
    }
}