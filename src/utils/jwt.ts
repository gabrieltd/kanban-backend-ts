import { sign, verify } from "jsonwebtoken";
import { Token } from "../types/custom/Token";
import UnauthorizedError from "../errors/UnauthorizedError";

// const JWT_SECRET = process.env.JWT_SECRET || "secret";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP || "30m";

export const generateAccessToken = (id: string) => {
	const payload = { id };
	const jwt = sign({ payload }, ACCESS_SECRET!, {
		expiresIn: ACCESS_TOKEN_EXP,
	});
	return jwt;
};

export const generateRefreshToken = (id: string) => {
	const payload = { id };
	const jwt = sign({ payload }, REFRESH_SECRET!, {
		expiresIn: "180d",
	});
	return jwt;
};

export const verifyToken = async (
	token: string,
	type: "access" | "refresh"
) => {
	const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;

	const decoded = await verify(token, secret!, (err, decoded) => {
		if (err) {
			throw new UnauthorizedError(401, err.message);
		}

		return decoded;
	});

	return decoded! as Token;
};
