import mongoose,{Schema, Document} from "mongoose";

export interface IAuditLog extends Document{
    action:string;
    userId?:mongoose.Types.ObjectId;
    role?:string;
    resource?:string;
    resourceId?:string;
    ip?: string;
    userAgent?: string;
    metadata?:Record<string, any>;
    createdDate:Date;
}

const auditLogSchema=new Schema<IAuditLog>(
    {
         action:{type:String, index:true, required:true},
         userId:{type: mongoose.Schema.Types.ObjectId, ref: "User" },
         role: { type: String },
         resource: { type: String },
         resourceId: { type: String },
         ip: { type: String },
         userAgent: { type: String },
         metadata: { type: Schema.Types.Mixed },

    },
    {
        timestamps:{createdAt:true, updatedAt:true,}
    }
   
);
export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);