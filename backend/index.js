import dotenv from "dotenv";
import app from "./src/server.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDb();
};

start()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start server ${error.message}`);
  });
