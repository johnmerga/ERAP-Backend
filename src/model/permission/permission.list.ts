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

export const chatManagementPermissions = [
    { name: 'chat:read', description: 'Allows the user to read all chats in the organization.' },
    { name: 'chat:create', description: 'Allows the user to create a new chat.' },
    { name: 'chat:update', description: 'Allows the user to update a chat.' },
    { name: 'chat:delete', description: 'Allows the user to delete a chat.' },
];

export const sysChatManagementPermissions = [
    ...chatManagementPermissions,
    { name: 'chat:read:all', description: 'Allows the user to read all chats across the system.' },
    { name: 'chat:create:all', description: 'Allows the user to create new chats across the system.' },
    { name: 'chat:update:all', description: 'Allows the user to update any chat in the system.' },
    { name: 'chat:delete:all', description: 'Allows the user to delete any chat in the system.' },
];

export const orgManagementPermissions = [
    // Organization management
    { name: 'org:read', description: 'Allows the user to read all organizations in the organization.' },
    { name: 'org:create', description: 'Allows the user to create a new organization.' },
    { name: 'org:update', description: 'Allows the user to update an organization.' },
    { name: 'org:delete', description: 'Allows the user to delete an organization.' },
];

export const sysOrgManagementPermissions = [
    ...orgManagementPermissions,
    { name: 'org:read:all', description: 'Allows the user to read all organizations across the system.' },
    { name: 'org:create:all', description: 'Allows the user to create new organizations across the system.' },
    { name: 'org:update:all', description: 'Allows the user to update any organization in the system.' },
    { name: 'org:delete:all', description: 'Allows the user to delete any organization in the system.' },
];

export const formManagementPermissions = [
    // Form management
    { name: 'form:read', description: 'Allows the user to read all forms in the organization.' },
    { name: 'form:create', description: 'Allows the user to create a new form.' },
    { name: 'form:update', description: 'Allows the user to update a form.' },
    { name: 'form:delete', description: 'Allows the user to delete a form.' },
];

export const sysFormManagementPermissions = [
    ...formManagementPermissions,
    { name: 'form:read:all', description: 'Allows the user to read all forms across the system.' },
    { name: 'form:create:all', description: 'Allows the user to create new forms across the system.' },
    { name: 'form:update:all', description: 'Allows the user to update any form in the system.' },
];

export const applicantManagementPermissions = [
    // Applicant management
    { name: 'applicant:read', description: 'Allows the user to read all applicants in the organization.' },
    { name: 'applicant:create', description: 'Allows the user to create a new applicant.' },
    { name: 'applicant:update', description: 'Allows the user to update an applicant.' },
    { name: 'applicant:delete', description: 'Allows the user to delete an applicant.' },
];

export const sysApplicantManagementPermissions = [
    ...applicantManagementPermissions,
    { name: 'applicant:read:all', description: 'Allows the user to read all applicants across the system.' },
    { name: 'applicant:create:all', description: 'Allows the user to create new applicants across the system.' },
    { name: 'applicant:update:all', description: 'Allows the user to update any applicant in the system.' },
];

export const submissionManagementPermissions = [
    // Submission management
    { name: 'submission:read', description: 'Allows the user to read all submissions in the organization.' },
    { name: 'submission:create', description: 'Allows the user to create a new submission.' },
    { name: 'submission:update', description: 'Allows the user to update a submission.' },
    { name: 'submission:delete', description: 'Allows the user to delete a submission.' },
    { name: 'submission:update:mark', description: 'Allows the user to give a mark for applicants if the submission is only belongs to them' },
];

export const sysSubmissionManagementPermissions = [
    ...submissionManagementPermissions,
    { name: 'submission:read:all', description: 'Allows the user to read all submissions across the system.' },
    { name: 'submission:create:all', description: 'Allows the user to create new submissions across the system.' },
    { name: 'submission:update:all', description: 'Allows the user to update any submission in the system.' },
    { name: 'submission:delete:all', description: 'Allows the user to delete any submission in the system.' },
];

export const paymentManagementPermissions = [
    // Payment management
    { name: 'payment:read', description: 'Allows the user to read all payments in the organization.' },
    { name: 'payment:create', description: 'Allows the user to create a new payment.' },
    { name: 'payment:update', description: 'Allows the user to update a payment.' },
    { name: 'payment:delete', description: 'Allows the user to delete a payment.' },
];

export const sysPaymentManagementPermissions = [
    ...paymentManagementPermissions,
    { name: 'payment:read:all', description: 'Allows the user to read all payments across the system.' },
    { name: 'payment:create:all', description: 'Allows the user to create new payments across the system.' },
    { name: 'payment:update:all', description: 'Allows the user to update any payment in the system.' },
    { name: 'payment:delete:all', description: 'Allows the user to delete any payment in the system.' },
];

export const userManagementPermissions = [
    // User management
    { name: 'user:read', description: 'Allows the user to read all users in the organization.' },
    { name: 'user:create', description: 'Allows the user to create a new user.' },
    { name: 'user:delete', description: 'Allows the user to delete a user.' },
    { name: 'user:update', description: 'Allows the user to update a user.' },
];

export const sysUserManagementPermissions = [
    ...userManagementPermissions,
    { name: 'user:read:all', description: 'Allows the user to read all users across the system.' },
    { name: 'user:create:all', description: 'Allows the user to create new users across the system.' },
    { name: 'user:update:all', description: 'Allows the user to update any user in the system.' },
    { name: 'user:delete:all', description: 'Allows the user to delete any user in the system.' },
];

export const tenderManagementPermissions = [
    // Tender management
    { name: 'tender:read', description: 'Allows the user to read all tenders in the organization.' },
    { name: 'tender:create', description: 'Allows the user to create a new tender.' },
    { name: 'tender:update', description: 'Allows the user to update a tender.' },
    { name: 'tender:delete', description: 'Allows the user to delete a tender.' },
];

export const sysTenderManagementPermissions = [
    ...tenderManagementPermissions,
    { name: 'tender:read:all', description: 'Allows the user to read all tenders across the system.' },
    { name: 'tender:create:all', description: 'Allows the user to create new tenders across the system.' },
    { name: 'tender:update:all', description: 'Allows the user to update any tender in the system.' },
    { name: 'tender:delete:all', description: 'Allows the user to delete any tender in the system.' },
];




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
    // chat management permission
    ...sysChatManagementPermissions

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
    ...except(tenderManagementPermissions, [`tender:delete`]),
    // chat management permission
    ...chatManagementPermissions

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
    // compliance can read chat
    ...chatManagementPermissions,

]

export const userPermissions = [
    ...userManagementPermissions
]

/*  */


export const auctionPlatformPermissions = [
    ...sysAdminPermissions
];
