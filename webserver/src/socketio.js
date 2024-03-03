const socketIO = require("socket.io");
import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV || "production";
let io;

let socketIOConfig = {
  cors: {
    origin:
      env !== "production"
        ? ["http://localhost:4200", process.env.WEBAPP_URL]
        : "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: env !== "production" ? true : false,
  },
};

if (env !== "production") {
  socketIOConfig = {
    ...socketIOConfig,
    path: "/api/socket.io",
  };
}

module.exports = {
  init: (server) => {
    io = socketIO(server, socketIOConfig);
    io.on("connection", (socket) => {
      socket.on("join", (room) => {
        // Only allow joining rooms that start with "material:"
        if (room.startsWith("material:")) {
          socket.join(room);
        }
      });
      socket.on("leave", (room) => {
        socket.leave(room);
      });
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
