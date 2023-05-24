import { except, only } from "../../utils";
/*
    user routes
    org routes
    form routes
    tender routes
    applicant routes
    submission routes
    payment routes
 */

/*
    SysAdmin = 'sysadmin',
    Admin = 'admin',
    Procurement = 'procurement',
    Evaluator = 'evaluator',
    Compliance = 'compliance',
    User = 'user', 
 */


export const orgManagementPermissions = [
    // org management
    `org:read`, // read all orgs in the organization
    `org:create`,
    `org:update`,
    `org:delete`,
];
export const sysOrgManagementPermissions = [
    ...orgManagementPermissions,
    `org:read:all`, // read all orgs in all organizations
    `org:create:all`,
    `org:update:all`,
    `org:delete:all`,
]

export const formManagementPermissions = [
    // form management
    `form:read`, // read all forms in the organization
    `form:create`,
    `form:update`,
    `form:delete`,
]
export const sysFormManagementPermissions = [
    ...formManagementPermissions,
    `form:read:all`, // read all forms in all organizations
    `form:create:all`,
    `form:update:all`,
]
export const applicantManagementPermissions = [
    // applicant management
    `applicant:read`, // read all applicants in the organization
    `applicant:create`,
    `applicant:update`,
    `applicant:delete`,
]
export const sysApplicantManagementPermissions = [
    ...applicantManagementPermissions,
    `applicant:read:all`, // read all applicants in all organizations
    `applicant:create:all`,
    `applicant:update:all`,
]

export const submissionManagementPermissions = [
    // submission management
    `submission:read`, // read all submissions in the organization
    `submission:create`,
    `submission:update`,
    `submission:delete`,
    `submission:update:mark`
]
export const sysSubmissionManagementPermissions = [
    ...submissionManagementPermissions,
    `submission:read:all`, // read all submissions in all organizations
    `submission:create:all`,
    `submission:update:all`,
    `submission:delete:all`,
]

export const paymentManagementPermissions = [
    // payment management
    `payment:read`, // read all payments in the organization
    `payment:create`,
    `payment:update`,
    `payment:delete`,
]
export const sysPaymentManagementPermissions = [
    ...paymentManagementPermissions,
    `payment:read:all`, // read all payments in all organizations
    `payment:create:all`,
    `payment:update:all`,
    `payment:delete:all`,
]


//
export const userManagementPermissions = [
    // user management
    `user:read`,// read all users in the organization
    `user:create`,
    `user:delete`,
    `user:update`,
]

export const sysUserManagementPermissions = [
    ...userManagementPermissions,

    `user:read:all`,// read all users in all organizations
    `user:create:all`,
    `user:update:all`,
    `user:delete:all`,
]

export const tenderManagementPermissions = [
    // tender management
    `tender:read`, // read all tenders in the organization
    `tender:create`,
    `tender:update`,
    `tender:delete`,
]

export const sysTenderManagementPermissions = [
    ...tenderManagementPermissions,
    `tender:read:all`, // read all tenders in all organizations
    `tender:create:all`,
    `tender:update:all`,
    `tender:delete:all`,

]



/*  */
// group permissions
export const sysAdminPermissions = [
    // user management
    ...sysUserManagementPermissions,
    // org management
    ...sysOrgManagementPermissions,
    // form management
    ...sysFormManagementPermissions,
    // applicant management
    ...sysApplicantManagementPermissions,
    // submission management
    ...sysSubmissionManagementPermissions,
    // payment management
    ...sysPaymentManagementPermissions,
    // tender management
    ...sysTenderManagementPermissions,
]

export const adminPermissions = [
    // user management except delete
    ...except(userManagementPermissions, ['user:delete']),
    // org management
    ...orgManagementPermissions,
    // form management
    ...formManagementPermissions,
    // applicant management, only read and create
    ...except(applicantManagementPermissions, [`applicant:delete`, `applicant:update`]),
    // submission management
    ...submissionManagementPermissions,
    // payment management, only read and create
    ...except(paymentManagementPermissions, [`payment:delete`, `payment:update`]),
    // tender management, except delete
    ...except(tenderManagementPermissions, [`tender:delete`])

]
export const procurementPermissions = [
    // create tender, create form 
    ...only([...formManagementPermissions, ...tenderManagementPermissions], [`form:create`, `tender:create`]),
]
export const evaluatorPermissions = [
    // submission management: read, update
    ...except(submissionManagementPermissions, [`submission:create`, `submission:delete`]),
]

export const compliancePermissions = [

]

export const userPermission = [
    ...userManagementPermissions
]

/*  */


export const auctionPlatformPermissions = [
    ...sysAdminPermissions
];
