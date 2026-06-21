import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
const app: Application = express();
const port = 5000;

dotenv.config();

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

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                )
        `);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
initDB();

// it is used to receive data from client and send response to client
app.post("/api/users", async (req: Request, res: Response) => {
  // console.log(req.body)
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
        INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4)
        RETURNING *
        `,
      [name, email, password, age],
    );

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
});

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

// it is used to receive data from client and send response to client
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
