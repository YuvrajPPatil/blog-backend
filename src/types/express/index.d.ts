import { IUser } from "../../models/user.model"; // adjust path as needed

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email?: string;
    }

    interface Request {
      user?: UserPayload; // or user: UserPayload if always present
    }
  }
}