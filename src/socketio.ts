import { Server, Socket } from "socket.io";

export default function socketIo(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("server socket connected!!:)))")
  });
};
