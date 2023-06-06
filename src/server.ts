import config from "./config/config";
import { Logger } from "./logger";
import * as db from "./db/connect";
import app from "./app";

import events from "events"
import http from "http"
import { Server } from "socket.io"
import socketIo from "./socketio";

let server = http.createServer(app);
const io = new Server(server,  {
    transports: ['polling'],
    cors: { origin: ["http://localhost:3000","http://localhost:3001"],methods: ["GET", "POST"] },
  })

socketIo(io)

const workflow = new events.EventEmitter();

workflow.on('connectDB', async () => {
    try {
        await db.connect();
        workflow.emit('startServer');
    } catch (error) {
        Logger.error('Could not connect to MongoDB');
        // Logger.error(error);
        process.exit(1);
    }
});

workflow.on('startServer', () => {
    server.listen(config.port, () => {
        Logger.info(`Server is running on port ${config.port}`);
    }
    );

});

workflow.emit('connectDB');

process.on('SIGINT', (code) => {
    Logger.info(`Server is shutting down with code: ${code}`);
    server.close();
    process.exit(0);
})


