import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import redisConnection from "../config/redis";
import transporter from "../config/mailer";
import { IEmailInviteData } from "../queues/email.queue";

const emailWorker= new Worker("invite-email-queue", async(job)=>{
    const{to,subject,html}=job.data;

    await transporter.sendMail({
        from:`Blog App: ${process.env.EMAIL_USER}`,
        to,
        subject,
        html
    });
},
{
    connection:redisConnection
}
); 


// const emailWorker1=new Worker(
//     "email-queue",
//     async (job)=>{
//         if(job.name==="send-invite-mail")
//         {
//             const{to,inviteUrl}=job.data;
//             await sendInviteMail(to,inviteUrl);
//             console.log(`Invite email sent to ${to}`); 
//         }
//     },
//     {
//         connection:redisConnection
//     }
// );

emailWorker.on("completed",(job)=>{
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed",(job,err)=>{
     console.log(`Job ${job?.id} failed: `,err);
});
