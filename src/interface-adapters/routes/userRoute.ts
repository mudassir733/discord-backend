import express, { Router } from "express";
import { UserController } from "../controllers/userController.js";


export class UserRoute {
    private router: Router = express.Router();
    private controller: UserController;

    constructor(controller: UserController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post('/register', (req, res) => this.controller.register(req, res));
        this.router.post('/login', (req, res) => this.controller.login(req, res));
    }
    getRouter(): Router {
        return this.router;
    }
}