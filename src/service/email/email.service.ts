import config from "../../config/config";
import { Logger } from "../../logger";
import { Message } from "./email.model"
import { Transporter, createTransport, } from 'nodemailer'

export class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport(config.email.smtp);
        this.init()
    }

    // initialize the email service
    private async init(): Promise<void> {
        if (process.env.NODE_ENV !== 'production') {
            try {
                await this.transporter.verify();
                Logger.info('Connected to email server successfully.');
            } catch (error) {
                Logger.warn('Error connecting to email server: please check your email configuration in you .env file');
            }
        }
    }


    private async sendEmail(
        to: string,
        subject: string,
        text: string,
        html?: string
    ) {
        const message: Message = {
            from: config.email.emailFrom,
            to,
            subject,
            text,
            html
        }
        await this.transporter.sendMail(message)
    }
    /*  */
    public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
        const subject = "Reset password";
        // we'll replace this url with the link to the reset password page of our front-end app
        const resetPasswordUrl = `${config.clientUrl}/reset-password?token=${token}`;
        const text = `Hi,
        To reset your password, click on this link: ${resetPasswordUrl}
        If you did not request any password resets, then ignore this email.`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
        <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
        <p>If you did not request any password resets, please ignore this email.</p>
        <p>Thanks,</p>
        <p><strong>Team</strong></p></div>`;
        await this.sendEmail(to, subject, text, html);
    }

    /*  */
    async sendVerificationEmail(to: string, token: string, name: string): Promise<void> {
        const subject = 'Email Verification';
        // replace this url with the link to the email verification page of your front-end app
        const verificationEmailUrl = `${config.clientUrl}/api/v1/auth/verify-email?token=${token}`;
        const text = `Hi ${name},
        To verify your email, click on this link: ${verificationEmailUrl}
        If you did not create an account, then ignore this email.`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
        <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
        <p>If you did not create an account, then ignore this email.</p></div>`;
        await this.sendEmail(to, subject, text, html);
    };
    /*  */
    async sendSuccessfulRegistration(to: string, token: string, name: string): Promise<void> {
        const subject = 'Email Verification';
        // replace this url with the link to the email verification page of your front-end app
        const verificationEmailUrl = `${config.clientUrl}/verify-email?token=${token}`;
        const text = `Hi ${name},
        Congratulations! Your account has been created. 
        You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
        Don't hesitate to contact us if you face any problems
        Regards,
        Team`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
        <p>Congratulations! Your account has been created.</p>
        <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
        <p>Don't hesitate to contact us if you face any problems</p>
        <p>Regards,</p>
        <p><strong>Team</strong></p></div>`;
        await this.sendEmail(to, subject, text, html);
    };
    /*  */

    async sendAccountCreated(to: string, name: string): Promise<void> {
        const subject = 'Account Created Successfully';
        // replace this url with the link to the email verification page of your front-end app
        const loginUrl = `${config.clientUrl}/auth/login`;
        const text = `Hi ${name},
        Congratulations! Your account has been created successfully. 
        You can now login at: ${loginUrl}
        Don't hesitate to contact us if you face any problems
        Regards,
        Team`;
        const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
        <p>Congratulations! Your account has been created successfully.</p>
        <p>You can now login at: ${loginUrl}</p>
        <p>Don't hesitate to contact us if you face any problems</p>
        <p>Regards,</p>
        <p><strong>Team</strong></p></div>`;
        await this.sendEmail(to, subject, text, html);
    };

}


