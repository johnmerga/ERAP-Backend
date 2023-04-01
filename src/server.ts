import config from "./config/config";
import { Logger } from "./logger";
import * as db from "./db/connect";
import app from "./app";

import events from "events"


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
    app.listen(config.port, () => {
        Logger.info(`Server is running on URL: http://localhost:${config.port} `);

    });

});

workflow.emit('connectDB');


