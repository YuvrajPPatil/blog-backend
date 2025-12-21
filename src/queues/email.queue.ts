import { Queue } from "bullmq";
import redisConnection from "../config/redis";
export interface IEmailInviteData{
    to:string,
    subject:string,
    html:string
}

 const emailQueue=new Queue<IEmailInviteData>("invite-email-queue",{
    connection:redisConnection,
    defaultJobOptions:{
        attempts:2,
        backoff:{type:"exponential",delay:2000},
        removeOnComplete:{count:5},
        removeOnFail:false
    }
 });

 export default emailQueue;