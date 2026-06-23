import app from "./app";
import { initDB } from "./db";
const port = 5000;

const main = () => {
  // it is used to receive data from client and send response to client
  initDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
