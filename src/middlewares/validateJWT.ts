import { Request, Response, NextFunction } from "express";

import UnauthorizedError from "../errors/UnauthorizedError";
import { verifyToken } from "../utils/jwt";

import { User } from "../types/custom/User";

export const validateJWT = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		throw new UnauthorizedError(401, "Unauthorized");
	}

	const accessToken = authHeader.split(" ")[1];

	const { payload: id } = await verifyToken(accessToken, "access");

	const user: User = id;

	req.user = user;

	next();
};
