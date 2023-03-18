// const auctionPlatformPermissions = [
//     'getUsers',
//     'manageUsers',
//     'getAuctions',
//     'getAuction',
//     'createAuction',
//     'updateAuction',
//     'deleteAuction',
//     'getBids',
//     'getBid',
//     'createBid',
//     'updateBid',
//     'deleteBid',
//     'getAuctionBids',
//     'getAuctionBid',
//     'createAuctionBid',
//     'updateAuctionBid',
//     'deleteAuctionBid',
//     'getAuctionBidsByUser',
//     'getAuctionBidByUser',
//     'createAuctionBidByUser',
//     'updateAuctionBidByUser',
//     'deleteAuctionBidByUser',
//     'getAuctionBidsByUserAndAuction',
//     'getAuctionBidByUserAndAuction',
//     'createAuctionBidByUserAndAuction',
//     'updateAuctionBidByUserAndAuction',
// ];

// const adminPermissions = [
//     'getRoles',
//     'getRole',
//     'createRole',
//     'updateRole',
//     'deleteRole',
//     'getPermissions',
//     'getPermission',
//     'createPermission',
//     'updatePermission',
//     'deletePermission',
// ];

// const allRoles = {
//     // permissions related to auction platform
//     user: auctionPlatformPermissions,
//     admin: auctionPlatformPermissions.concat(adminPermissions),
//     // permissions related to auction platform
//     auctionPlatform: auctionPlatformPermissions,
//     // permissions related to auction platform
//     auctionPlatformAdmin: auctionPlatformPermissions.concat(adminPermissions),
//     // permissions related to auction platform
//     auctionPlatformUser: auctionPlatformPermissions,
// };

// export const roles: string[] = Object.keys(allRoles);
// export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));