import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { toast } from "sonner";
import { ThankYouTemplate } from "./designs/thank-you";


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
        toast.error((error as Error)?.message)
        return;
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
        toast.error((error as Error)?.message)
    }
}

export const CompileThankYouEmailTemplate = (name: string) => {
    const template = handlebars.template(ThankYouTemplate);
    
    const htmlBody = template({ name: name });

    return htmlBody;
}