import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { pool } from "./db";
import { userRouter } from "./modules/user/user.route";
const app: Application = express();


// it help to receive data as application/json content type
app.use(express.json());
// it help to receive data as text/plain content type
app.use(express.text());
// it help to receive data as application/x-www-form-urlencoded content type AND IF i USE EXTENDED TRUE THEN IT CAN ALSO PARSE NESTED OBJECTS
app.use(express.urlencoded({ extended: true }));

// it is used to send response to client
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello World!",
    author: "Next Level Projects",
  });
});

app.use('/api/users', userRouter);


// it is used to receive data from client and send response to client
app.get("/api/users", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`
            SELECT * FROM users
        `);
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
});
// it is used to receive data from client and send response to client
app.get("/api/users/:id", async(req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const   result = await pool.query(`
            SELECT * FROM users WHERE id = $1
        `, [id]); 

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
})

// Update a user by ID
app.put("/api/users/:id", async(req: Request, res: Response) => {
    const {id} = req.params;
    const {name, password, age, is_active} = req.body;
    try{
        const result = await pool.query(`
            UPDATE users SET 
            name = COALESCE($1, name),
            password = COALESCE($2, password),
            age = COALESCE($3, age),
            is_active = COALESCE($4, is_active)
            WHERE id = $5
            RETURNING *
        `, [name, password, age, is_active, id]);
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
});

app.delete("/api/users/:id", async(req: Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1
        `, [id]);
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
});

export default app;