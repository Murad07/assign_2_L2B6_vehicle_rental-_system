import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), userController.createUser);

export const userRoutes = router;