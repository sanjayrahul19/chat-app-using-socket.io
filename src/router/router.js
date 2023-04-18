import { Router } from "express";
export const router = Router();
import { userRouter } from "./user-router/user-router";

router.use("/api/v1/user", userRouter);
