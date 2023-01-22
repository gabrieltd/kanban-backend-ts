import NotFoundError from "../errors/NotFoundError";
import UnauthorizedError from "../errors/UnauthorizedError";
import prisma from "../utils/prisma";
import { NextFunction } from "express";
import { Request, Response } from "express";

export const authorizeProjectAccess = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { projectId } = req.params;

	const userId = req.user.id;

	const project = await prisma.project.findUnique({
		where: { id: projectId },
		include: { members: true },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	if (!project.members.some((m) => m.userId === userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	next();
};
