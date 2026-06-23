import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// it is used to receive data from client and send response to client
router.post("/", userController.createUser);


export const userRouter = router;