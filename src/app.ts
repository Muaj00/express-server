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

export default app;