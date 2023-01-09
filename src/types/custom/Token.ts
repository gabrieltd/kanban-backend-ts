import { User } from "./User";

export type Token = {
	payload: User;
	iat: number;
	exp: number;
};
