import { hash, compare } from "bcryptjs";

const encrypt = async (password: string) => {
	const passwordHash = await hash(password, 8);
	return passwordHash;
};

const verifyHash = async (password: string, passwordHash: string) => {
	const passwordMatch = await compare(password, passwordHash);
	return passwordMatch;
};

export { encrypt, verifyHash };
