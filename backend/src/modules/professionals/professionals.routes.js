import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middlewares.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { createProfessionalController, getAllProfesionals, getRequestProfessionalsController, getServicesByProfessionalIdController, profileProfessionalController, requestProfessionalController, responseAdminReqController } from "./professionals.controller.js";

export const professionalsRoutes=Router()

professionalsRoutes.post('/professionals/me',authMiddleware,roleMiddleware(["professional"]),createProfessionalController)
professionalsRoutes.get('/professionals/me',authMiddleware,roleMiddleware(["professional"]),profileProfessionalController)
professionalsRoutes.get('/professionals',getAllProfesionals)
professionalsRoutes.get('/professionals/:id/services',getServicesByProfessionalIdController) 
professionalsRoutes.post('/professional/request',authMiddleware,roleMiddleware(["client"]),requestProfessionalController)
professionalsRoutes.get('/professional/request',authMiddleware,roleMiddleware(["admin","professional"]),getRequestProfessionalsController)
professionalsRoutes.patch('/professional-request/:id',authMiddleware,roleMiddleware(["admin"]),responseAdminReqController)