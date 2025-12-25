import nodemailer from "nodemailer";

export async function sendInviteMail(to:string,inviteUrl:string) {
    
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:Number(process.env.EMAIL_PORT),
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from:'"MY Blog App" <yuvraj2041@gmail.com>',
        to,
        subject:'You are invited.',
        html:`<p>Click <a href="${inviteUrl}">here</a> to register.</p>`
    });
}
// code not used