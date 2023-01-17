import { Request, Response } from "express";
import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { checkOwnership } from "../helpers/checkOwnership";
import UnauthorizedError from "../errors/UnauthorizedError";
import DuplicationError from "../errors/DuplicationError";

const getOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const response = await prisma.project.findUnique({
		where: { id: projectId },
		include: { boards: { include: { tasks: true } } },
	});

	if (!response) {
		throw new NotFoundError("Project not found");
	}

	if (!checkOwnership(userId, response.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	res.json(response);
};

const getAll = async (req: Request, res: Response) => {
	const userId = req.user.id;

	const response = await prisma.project.findMany({
		where: { userId },
	});

	res.json(response);
};

const postOne = async (req: Request, res: Response) => {
	const { title, description } = req.body;
	const userId = req.user.id;

	const projectExist = await prisma.project.findUnique({ where: { title } });

	if (projectExist) {
		throw new DuplicationError(`Project title already registered`);
	}

	const response = await prisma.project.create({
		data: { title, description, userId },
	});

	res.json(response);
};

const putOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const updatedProject = req.body;

	const project = await prisma.board.findUnique({ where: { id: projectId } });

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	if (!checkOwnership(userId, project.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.project.update({
		where: { id: projectId },
		data: { ...updatedProject },
	});

	res.json(response);
};

const deleteOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	if (!checkOwnership(userId, project.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.project.delete({ where: { id: projectId } });

	return res.json(response);
};

export { getOne, getAll, putOne, postOne, deleteOne };
