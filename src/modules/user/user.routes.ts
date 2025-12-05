import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), userController.getAllUsers);

router.put("/:id", auth("admin", "customer"), userController.updateUser);

export const userRoutes = router;