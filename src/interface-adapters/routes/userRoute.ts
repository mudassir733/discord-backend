import express, { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";


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
        this.router.post('/logout', authMiddleware, this.controller.logout.bind(this.controller));
        this.router.get('/me/:id', (req, res) => this.controller.getUserById(req, res));
        this.router.get('/me', (req, res) => this.controller.getAllUser(req, res))
    }
    getRouter(): Router {
        return this.router;
    }
}