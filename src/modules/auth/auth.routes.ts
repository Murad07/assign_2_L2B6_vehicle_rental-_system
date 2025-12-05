import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post('/signup', AuthController.registerUser);
router.post('/signin', AuthController.singinUser);

export const authRoutes = router;