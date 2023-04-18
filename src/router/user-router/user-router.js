import { Router } from "express";
export const userRouter = Router();
import { userSignUp } from "../../controller/user/user-signUp";
import { userLogin } from "../../controller/user/user-login";
import { userUpdate } from "../../controller/user/user-update";
import { getAllUser } from "../../controller/user/user-get";
import { deleteUser } from "../../controller/user/user-delete";

userRouter.post("/signup", userSignUp);
userRouter.post("/login", userLogin);
userRouter.patch("/update/:id", userUpdate);
userRouter.get("/all-user", getAllUser);
userRouter.delete("/delete/:id", deleteUser);
