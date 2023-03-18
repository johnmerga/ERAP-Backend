import config from "./config/config";
import { Logger } from "./logger";
import * as db from "./db/connect";
import app from "./app";

(async () => {
    try {
        await db.connect();
         app.listen(config.port, () => {
            Logger.info(`Server is running on URL: http://localhost:${config.port} `);
            // console.log(`Server is running on URL: http://localhost:${config.port} `);
            
        });
    } catch (error) {
        Logger.error('Could not connect to MongoDB');
        // Logger.error(error);
        process.exit(1);
    }
})();


