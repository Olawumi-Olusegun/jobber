import { CompileSendSelectedEmailTemplate, sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {

    const { email, fullName } = await request.json();

    try {

       const response = await sendEmail({
            to: email,
            name: fullName,
            subject: "Congratulations! You've been selected for the second round",
            body: CompileSendSelectedEmailTemplate(fullName)
        });

        if(response && response.messageId) {
            return NextResponse.json("Mail delivered", { status: 200})
        }

        return NextResponse.json("Mail delivered", { status: 200})

    } catch (error) {
        console.log(`SELECTED_MAIL_POST`, error)
        return NextResponse.json({message: (error as Error)?.message}, { status: 500})
    }
}