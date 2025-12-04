import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post('/signup', AuthController.registerUser);
// router.post('/signin', AuthController.loginUser);

export const authRoutes = router;