import {  Role, USER_STATUS, IUser } from "../../model/user";
import { faker } from '@faker-js/faker';
import * as db from "../connect"
import { PermissionService } from "../../service/permission.service";
import mongoose from "mongoose";
import { UserService } from "../../service/user.service";



async function main() {
    db.connect()
    const usersToInsert: IUser[] = []
    const permissions = await new PermissionService().findPermissions({})
    const permissionIds = permissions.map(permission => permission._id)


    for (let i = 0; i < 100; i++) {
        const user: IUser = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            address: faker.address.streetAddress(),
            phone: faker.phone.phoneNumber(),
            // random roles
            roles: [[Role.SysAdmin, Role.Admin, Role.Compliance, Role.Evaluator, Role.Procurement, Role.User][Math.floor(Math.random() * 6)]],
            // random permissions
            permissions: [
                permissionIds[Math.floor(Math.random() * permissionIds.length)],
            ],
            orgId: new mongoose.Types.ObjectId(),
            isVerified: true,
            // random status
            status: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE, USER_STATUS.PENDING][Math.floor(Math.random() * 3)],
            createdAt: new Date(),
            updatedAt: new Date()
        }
        usersToInsert.push(user)


    }
    try {
        usersToInsert.forEach(async user => {
            await new UserService().create(user)
        })

    } catch (error) {
        console.log(error)
    }

}

main()