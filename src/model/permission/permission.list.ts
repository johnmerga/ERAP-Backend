


export const userManagementPermissions = [
    // user management
    `user:read`,// read all users in the organization
    `user:write`,
    `user:delete`,
    `user:update`,
]

export const sysUserManagementPermissions = [
    ...userManagementPermissions,

    `user:read:all`,// read all users in all organizations
    `user:write:all`,
    `user:update:all`,
    `user:delete:all`,
]

export const tenderManagementPermissions = [
    // tender management
    `tender:read`, // read all tenders in the organization
    `tender:write`,
    `tender:update`,
    `tender:delete`,
]

export const sysTenderManagementPermissions = [
    ...tenderManagementPermissions,
    `tender:read:all`, // read all tenders in all organizations
    `tender:write:all`,
    `tender:update:all`,
    `tender:delete:all`,

]

export const auctionPlatformPermissions = [
    ...userManagementPermissions,
    ...sysUserManagementPermissions,
    ...tenderManagementPermissions,
    ...sysTenderManagementPermissions,
];