import { Router } from "express";
import { profileController } from "./profile.controller.js";
import { authMiddleware } from "../../middlewares/auth.middlewares.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

export const profileRoutes=Router()

profileRoutes.get('/profile', profileController)