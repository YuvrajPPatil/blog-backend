import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface User {
            id: string; // or Types.ObjectId if you attach full user
            // add other fields like email, name, etc. if needed
        }

        interface Request {
            user?: User; // Make it optional because auth middleware might not run
        }
    }
}