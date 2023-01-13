import { Request, Response } from "express";
import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { checkOwnership } from "../helpers/checkOwnership";
import UnauthorizedError from "../errors/UnauthorizedError";
import { Task, Board } from "@prisma/client";

const getOne = async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const userId = req.user.id;

	const response = await prisma.task.findUnique({ where: { id: taskId } });
	if (!response) {
		throw new NotFoundError("Task not found");
	}

	if (!checkOwnership(userId, response.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	res.json(response);
};

const getAll = async (req: Request, res: Response) => {
	const userId = req.user.id;

	const response = await prisma.task.findMany({ where: { userId } });

	res.json(response);
};

const postOne = async (req: Request, res: Response) => {
	const { description, color, priority, boardId } = req.body;
	const userId = req.user.id;

	const board = await prisma.board.findUnique({ where: { id: boardId } });

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	if (!checkOwnership(userId, board.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.task.create({
		data: { description, color, priority, boardId, userId },
	});

	res.json(response);
};

const putOne = async (req: Request, res: Response) => {
	const { taskId } = req.params;

	const userId = req.user.id;

	const updatedTask = req.body;

	const task = await prisma.task.findUnique({ where: { id: taskId } });

	if (!task) {
		throw new NotFoundError("Task not found");
	}

	if (!checkOwnership(userId, task.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.task.update({
		where: { id: taskId },
		data: { ...updatedTask },
	});

	res.json(response);
};

const deleteOne = async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const userId = req.user.id;

	const task = await prisma.task.findUnique({ where: { id: taskId } });

	if (!task) {
		throw new NotFoundError("Task not found");
	}

	if (!checkOwnership(userId, task.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.task.delete({ where: { id: taskId } });

	return res.json(response);
};

const batchUpdate = async (req: Request, res: Response) => {
	const board = req.body;

	if (!checkOwnership(req.user.id, board.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const tasks: Task[] = board.tasks;

	tasks.forEach(async (t, index) => {
		if (!checkOwnership(req.user.id, t.userId)) {
			throw new UnauthorizedError(403, "Forbidden");
		}

		await prisma.task.update({
			where: { id: t.id },
			data: { priority: t.priority },
		});
	});

	res.json(true);
};

export { getOne, getAll, putOne, postOne, deleteOne, batchUpdate };
