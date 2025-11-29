import { User } from "../models/User";  // adjust import to your project
import "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      user?: User;   // or user: User if always present
    }
  }
}