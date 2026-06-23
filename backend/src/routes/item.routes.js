import { Router } from "express";
import { createItem, getItems } from "../controllers/item.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", createItem);
router.get("/", getItems);

export default router;