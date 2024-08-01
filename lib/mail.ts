import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { ThankYouTemplate } from "./designs/thank-you";
import { SendSelectedTemplate } from "./designs/send-selected";
import { SendRejectionTemplate } from "./designs/send-rejection-template";


interface SendEmailProps {
    to: string;
    subject: string;
    body: string;
    name: string;
}

export const sendEmail = async ({ to, subject, body, name }: SendEmailProps) => {

    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL as string,
            pass: SMTP_PASSWORD as string,
        }
    });

    try {
        const textResult = await transport.verify();
        console.log(textResult)
    } catch (error) {
        console.log(error)
    }

    try {
        const sendResult = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body
        });
        console.log(sendResult)
        return sendResult;
    } catch (error) {
        console.log(error)
    }
}

export const CompileThankYouEmailTemplate = (name: string) => {
    const template = Handlebars.compile(ThankYouTemplate);
    
    const htmlBody = template({ name: name });

    return htmlBody;
}

export const CompileSendSelectedEmailTemplate = (name: string) => {
    const template = Handlebars.compile(SendSelectedTemplate);
    
    const htmlBody = template({ name: name });

    return htmlBody;
}

export const CompileSendRejectedEmailTemplate = (name: string) => {
    const template = Handlebars.compile(SendRejectionTemplate);
    
    const htmlBody = template({ name: name });

    return htmlBody;
}