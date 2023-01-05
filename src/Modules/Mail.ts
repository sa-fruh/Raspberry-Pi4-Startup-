import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { writeFileSync } from 'fs';
import Log from "./Log";
import { join } from "path";

const log = new Log("../logs/mail.log");

type Attachment = {
    filename?: string;
    content?: string;
    encoding?: string;
    path?: string;
}

export default class Mail {
    public from: string;
    public to: string;
    public readonly transport: Transporter = createTransport({
        host: 'smtp.fvt.local',
        port: 587,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });
    public lastMail: EpochTimeStamp | null;

    constructor(from: string, to: string) {
        this.from = from;
        this.to = to;
        this.lastMail = require("../config.json").lastMail;
    }

    public updateLastMail(): void {
        const config = require("../config.json");
        config.lastMail = new Date().getTime();
        this.lastMail = config.lastMail;
        writeFileSync(join(__dirname, '../config.json'), JSON.stringify(config, null, 4));
    }

    public mailIsAllowed(): boolean {
        return this.lastMail === null || new Date().getTime() - this.lastMail > 7 * 24 * 60 * 60 * 1000;
    }

    public async sendMail(subject: string, text?: string, attachments?: Attachment[]): Promise<any> {
        const mailOptions: SendMailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: text,
            attachments: attachments
        };
        const mail = await this.transport.sendMail(mailOptions);
        await log.write(`Mail sent to ${this.to} (<${mail.messageId}>)`);
        this.updateLastMail();
        return mail;
    }
}