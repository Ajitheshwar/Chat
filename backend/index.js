import dotenv from "dotenv";
import { createServer } from "node:http";
import app from "./src/server.js";
import { connectDb } from "./config/db.js";
import { initSocket } from "./socket/io.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);
initSocket(httpServer);

const start = async () => {
  await connectDb();
};

start()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start server ${error.message}`);
  });
