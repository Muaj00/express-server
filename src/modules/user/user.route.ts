import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// it is used to receive data from client and send response to client
router.post("/", userController.createUser);

// it is used to receive data from client and send response to client
router.get("/", userController.getUsers);

// it is used to receive data from client and send response to client
router.get("/:id", userController.getSingleUser);

// Update a user by ID
router.put("/:id", userController.updateUser);

// Delete a user by ID
router.delete("/:id", userController.deleteUser);

export const userRouter = router;