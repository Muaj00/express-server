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

const getUsers = async(req: Request, res: Response) => {
    try{
        const result = await userService.getUserFromDB();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const getSingleUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await userService.getSingleUserFromDB(id as string);
        if(result.rows.length === 0) {
            res.status(404).json({
            success: false,
            message: "User not found!",
            data: {},
        });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully!",
            data: result.rows[0],
        });  
    } catch (error: any) {
        res.status(500).send({
                success: false,
                message: error.message,
                error: error,
            });
    }   
};

const updateUser =  async(req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await userService.updateUserOnDB(id as string, req.body);
        if(result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!",
                data: {},
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: error,
        });
    }
};

const deleteUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await userService.deleteUserOnDB(id as string);        
        if(result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found!",
                data: {},
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: {},
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: error.message,
            error: error,
        });
    }
};

export const userController = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser
};