import { User } from "../custom/User";

declare global {
	namespace Express {
		export interface Request {
			user: User;
		}
	}
}
