import { JwtPayload, sign, verify } from "jsonwebtoken";
import ValidationError from "../errors/ValidationError";
import { Token } from "../types/custom/Token";
import log from "./logger";
import UnauthorizedError from "../errors/UnauthorizedError";

// const JWT_SECRET = process.env.JWT_SECRET || "secret";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (id: string) => {
	const payload = { id };
	const jwt = sign({ payload }, ACCESS_SECRET!, {
		expiresIn: "30m",
	});
	return jwt;
};

export const generateRefreshToken = (id: string) => {
	const payload = { id };
	const jwt = sign({ payload }, REFRESH_SECRET!, {
		expiresIn: "365d",
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
