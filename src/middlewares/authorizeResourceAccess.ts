import { NextFunction } from "express";
import { Request, Response } from "express";
import { checkProjectMembership } from "../services/auth.service";

export const authorizeProjectAccess = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { projectId } = req.params;

	const userId = req.user.id;

	await checkProjectMembership(userId, projectId);

	next();
};
