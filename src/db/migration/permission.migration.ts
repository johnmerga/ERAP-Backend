import * as db from "../connect"
import { PermissionDal } from "../../dal";
import * as fs from 'fs/promises'
import path from "path";
import { Logger } from "../../logger";
import { Permission, permissionList } from "../../model/permission";
import { PermissionListBasicInfo } from "../../model/permission/permission.model";
import { ApiError } from "../../errors";
import httpStatus from "http-status";
import mongoose from "mongoose";
interface IPermissionComparison {
    numberOfPermissionToBeAddedToMigrationFile: {
        total: number;
        onlyNewList: PermissionListBasicInfo[] | null;
        newMigration: PermissionListBasicInfo[] | null;
    }
    numberOfPermissionToBeAddedToDB: {
        total: number;
        list: PermissionListBasicInfo[] | null;
    }
}
export class PermissionMigration {
    private permissionDal: PermissionDal;
    constructor() {
        // this.permissionService = new PermissionService();
        this.connect()
        this.permissionDal = new PermissionDal()
    }
    async connect() {
        await db.connect()
    }
    async saveOnlyToFile() {
        try {
            const fileDir = path.join(__dirname, 'permission.migration.json')
            const comparisonInfo = await this.comparePermission()
            if (comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.total === 0) {
                Logger.info('No permission to be added to file')
                return
            }
            if (comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.total > 0) {
                await fs.writeFile(fileDir, JSON.stringify(comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.newMigration))
                Logger.info('Permission saved to file')
                return
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unhandled error when save permission to file')
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when save permission to file')
        }
    }

    async saveAllPermissionToDB() {
        try {
            const fileDir = path.join(__dirname, 'permission.migration.json')
            const comparisonInfo = await this.comparePermission()
            if (comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.total === 0 && comparisonInfo.numberOfPermissionToBeAddedToDB.total === 0) {
                Logger.info('No permission to be added to DB, everything is up to date')
                return
            }
            if (comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.total > 0) {
                await fs.writeFile(fileDir, JSON.stringify(comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.newMigration))
                Logger.info('Permission saved to file')
            }
            if (comparisonInfo.numberOfPermissionToBeAddedToDB.total > 0) {
                // delete all permission in DB first then add new permission
                await Permission.deleteMany({})
                if (comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.newMigration === null) {
                    // get permission from file
                    const permissionInJSONfile = JSON.parse(await fs.readFile(fileDir, 'utf-8')) as { name: string, id: string, description: string }[]
                    const newPermissionToBeAddedToDB = permissionInJSONfile.map(v => ({
                        _id: v.id,
                        name: v.name,
                        description: v.description
                    }))
                    await Permission.insertMany(newPermissionToBeAddedToDB)
                    Logger.info('Permission saved to DB')
                    return
                }
                const newPermissionToBeAddedToDB = comparisonInfo.numberOfPermissionToBeAddedToMigrationFile.newMigration.map(v => ({
                    _id: v.id,
                    name: v.name,
                    description: v.description
                }))
                await Permission.insertMany(newPermissionToBeAddedToDB)
                Logger.info('Permission saved to DB')
                return
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unhandled error when save permission to DB and file')
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when save permission to DB')
        }

    }


    async comparePermission(): Promise<IPermissionComparison> {
        try {
            const outPut: IPermissionComparison = {
                numberOfPermissionToBeAddedToMigrationFile: {
                    total: 0,
                    onlyNewList: null,
                    newMigration: null
                },
                numberOfPermissionToBeAddedToDB: {
                    total: 0,
                    list: null
                }
            }
            // first comparing the permission in permissionList.ts file and permission in permission.migration.json file
            const fileDir = path.join(__dirname, 'permission.migration.json')
            const allPermission = permissionList.auctionPlatformPermissions
            const permissionInJSONfile = await fs.readFile(fileDir, 'utf-8')
            const permissionInJSONfileParsed = JSON.parse(permissionInJSONfile) as { name: string, id: string, description: string }[]
            const permissionToBeAdded = allPermission.filter(v => !permissionInJSONfileParsed.some(v2 => v2.name === v.name))


            // Logger.info(permissionToBeAdded)
            if (permissionToBeAdded.length > 0) {
                const newPermissionsWithId = permissionToBeAdded.map(v => ({
                    id: (new mongoose.Types.ObjectId().toString()),
                    name: v.name,
                    description: v.description
                }))
                outPut.numberOfPermissionToBeAddedToMigrationFile.total = newPermissionsWithId.length
                outPut.numberOfPermissionToBeAddedToMigrationFile.onlyNewList = newPermissionsWithId
                permissionInJSONfileParsed.push(...newPermissionsWithId)
                outPut.numberOfPermissionToBeAddedToMigrationFile.newMigration = permissionInJSONfileParsed
                // await fs.writeFile(fileDir, JSON.stringify(allPermission))
            }
            // then comparing the permission in permission.migration.json file and permission in DB
            const allPermissionInDB = (await this.permissionDal.findPermissions({}, { name: 1, _id: 1, description: 1 }))
            if (allPermissionInDB.length === 0 || allPermissionInDB === null || allPermissionInDB === undefined) {
                outPut.numberOfPermissionToBeAddedToDB.total = permissionInJSONfileParsed.length
                outPut.numberOfPermissionToBeAddedToDB.list = permissionInJSONfileParsed
                return outPut
            }
            const allPermissionInDBFormatted = allPermissionInDB.map(v => ({ id: v._id, name: v.name, description: v.description })) as PermissionListBasicInfo[]
            const permissionToBeAddedToDB = permissionInJSONfileParsed.filter(v => !allPermissionInDBFormatted.some(v2 => v2.name === v.name))
            // Logger.info(permissionToBeAddedToDB)
            if (permissionToBeAddedToDB.length > 0) {
                outPut.numberOfPermissionToBeAddedToDB.total = permissionToBeAddedToDB.length
                outPut.numberOfPermissionToBeAddedToDB.list = permissionToBeAddedToDB
            }
            return outPut
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error when save permission to DB, ${error}`)
        }
    }
}

(async () => {
    const permissionMigration = new PermissionMigration()
    const allPermission = await permissionMigration.comparePermission()
    console.dir(allPermission, { depth: null })
    // console.dir(allPermission.numberOfPermissionToBeAddedToMigrationFile.onlyNewList, { depth: null })
}
)()
