import nodemailer from "nodemailer";

export async function sendInviteMail(to:string,inviteUrl:string) {
    
    const transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:Number(process.env.SMTP_PORT),
        secure:false,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS,
        }
    });

    await transporter.sendMail({
        from:'"MY Blog App" <yuvraj2041@gmail.com>',
        to,
        subject:'You are invited.',
        html:`<p>Click <a href="${inviteUrl}">here</a> to register.</p>`
    });
}