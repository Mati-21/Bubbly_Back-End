import { Server } from "socket.io";
import app from "./app.js";
import mongoose from "mongoose";
import { socketHandler } from "./soketServer.js";

// reading env variables
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// connecting mongoose
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Database Connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

mongoose.connection.on("error", async (error) => {
  console.log(error);
});

// starting server
const server = app.listen(PORT, () => {
  console.log("Server Started:");
});

// socket io server
const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: process.env.CLIENT_ENDPOINT },
});

io.on("connection", (socket) => {
  console.log("Socket Connected Successfully!!");
  socketHandler(socket, io);
});

const exitHandler = async () => {
  if (server && server.listen) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  } else {
    console.log("Server Never Started!");
  }

  console.log("Closing Database");
  await mongoose.connection.close(false);

  console.log("All Resourse are close Successfully");

  process.exit(1);
};

const handleUnExpectedError = async (error) => {
  console.log(error);
  await exitHandler();
};

process.on("unhandledRejection", handleUnExpectedError);
process.on("uncaughtException", handleUnExpectedError);
process.on("SIGINT", handleUnExpectedError);
process.on("SIGTERM", handleUnExpectedError);
