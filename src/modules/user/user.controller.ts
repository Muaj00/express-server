import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body)
//   const { name, email, password, age } = req.body;

  try {

    const result = await userService.createUserOnDB(req.body);

    res.status(201).send({
      message: "Data received successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
     res.status(500).send({
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
};