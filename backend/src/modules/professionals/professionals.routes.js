import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middlewares.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { createProfessionalController, profileProfessionalController } from "./professionals.controller.js";
export const professionalsRoutes=Router()

professionalsRoutes.post('/professionals/me',authMiddleware,roleMiddleware(["professional"]),createProfessionalController)
professionalsRoutes.get('/professionals/me',authMiddleware,roleMiddleware(["professional"]),profileProfessionalController)