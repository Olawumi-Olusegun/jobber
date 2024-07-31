import { CompileThankYouEmailTemplate, sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {

    const { email, fullName } = await request.json();

    try {

       const response = await sendEmail({
            to: email,
            name: fullName,
            subject: "Thank you for applying",
            body: CompileThankYouEmailTemplate(fullName)
        });

        if(response && response.messageId) {
            return NextResponse.json("Mail delivered", { status: 200})
        }

    } catch (error) {
        console.log(`THANK_YOU_POST`, error)
        return NextResponse.json({message: (error as Error)?.message}, { status: 500})
    }
}