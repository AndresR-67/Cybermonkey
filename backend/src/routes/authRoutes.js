// src/routes/authRoutes.js
import express from "express";
import { register, login, logout, profile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);       // RF01
router.post("/login", login);             // RF02
router.post("/logout", auth(), logout);   // RF03 - protegido (opcional)
router.get("/profile", auth(), profile);  // datos perfil

export default router;
