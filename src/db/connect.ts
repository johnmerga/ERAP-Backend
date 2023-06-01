import mongoose from "mongoose";
import config from "../config/config";
import Logger from "../logger/logger";
import { Permission, permissionList } from "../model/permission";


const isDevelopment = process.env.NODE_ENV === 'development'
export const connect = async () => {
    await mongoose.connect(`${config.mongoose.url}`, {});
}

mongoose.connection.on('connecting', function () {
    isDevelopment ? Logger.info('...connecting to local MongoDB') : Logger.info('...connecting to MongoDB Atlas')
})

mongoose.connection.on('error', function () {
    Logger.error("Could not connect to MongoDB");
    process.exit(1);
})

mongoose.connection.on('connected', function () {
    (async () => {
        Logger.info("MongoDB Connected")
        const countPermissionsInDB = await Permission.estimatedDocumentCount()
        const allPermissionsLength = permissionList.auctionPlatformPermissions.length
        if (countPermissionsInDB < allPermissionsLength) {
            Logger.warn(`permissions in db: ${countPermissionsInDB}, all permissions: ${allPermissionsLength}, permissions should be added to db`)
        }
        if (countPermissionsInDB === 0) {
            Logger.warn(`add permissions to db`)
            await Permission.insertMany(permissionList.auctionPlatformPermissions)
        }
    })()




})

mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});


mongoose.connection.on('disconnected', function () {
    Logger.error("MongoDB Disconnected");

})


// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', function () {
    mongoose.connection.close(true)

});

