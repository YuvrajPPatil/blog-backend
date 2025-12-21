import crypto from "crypto"; 
import bcrypt from "bcrypt";
import { INVITE_TOKEN_BYTES } from "../config";

export function generateInviteToken(){
    return crypto.randomBytes(INVITE_TOKEN_BYTES).toString("hex");
}

export async function hashInviteToken(token:string) {
    // bcrypt is fine here; token comparison cost is acceptable.
    const salt= await bcrypt.genSalt(10);
    return bcrypt.hash(token,salt);
}

export async function verifyTokenHash(token:string,tokenHash:string) {
    return bcrypt.compare(token,tokenHash);
}