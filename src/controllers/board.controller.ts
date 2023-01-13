import { Request, Response } from "express";
import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { checkOwnership } from "../helpers/checkOwnership";
import UnauthorizedError from "../errors/UnauthorizedError";
import { Board } from "@prisma/client";

const getOne = async (req: Request, res: Response) => {
	const { boardId } = req.params;
	const userId = req.user.id;

	const response = await prisma.board.findUnique({ where: { id: boardId } });

	if (!response) {
		throw new NotFoundError("Board not found");
	}

	if (!checkOwnership(userId, response.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	res.send(response);
};

const getAll = async (req: Request, res: Response) => {
	const userId = req.user.id;

	const response = await prisma.board.findMany({
		where: { userId },
		include: { tasks: true },
	});

	res.send(response);
};

const postOne = async (req: Request, res: Response) => {
	const { title, priority } = req.body;
	const userId = req.user.id;

	const response = await prisma.board.create({
		data: { title, priority, userId },
	});

	res.send(response);
};

const putOne = async (req: Request, res: Response) => {
	const { boardId } = req.params;
	const userId = req.user.id;

	const updatedBoard = req.body;

	const board = await prisma.board.findUnique({ where: { id: boardId } });

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	if (!checkOwnership(userId, board.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.board.update({
		where: { id: boardId },
		data: { ...updatedBoard },
	});

	res.send(response);
};

const deleteOne = async (req: Request, res: Response) => {
	const { boardId } = req.params;
	const userId = req.user.id;

	const board = await prisma.board.findUnique({ where: { id: boardId } });

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	if (!checkOwnership(userId, board.userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.board.delete({ where: { id: boardId } });

	return res.send(response);
};

const batchUpdate = async (req: Request, res: Response) => {
	const boards: Board[] = req.body;

	boards.forEach(async (b, index) => {
		if (!checkOwnership(req.user.id, b.userId)) {
			throw new UnauthorizedError(403, "Forbidden");
		}

		await prisma.board.update({
			where: { id: b.id },
			data: { priority: b.priority },
		});
	});

	res.json(true);
};

export { getOne, getAll, putOne, postOne, deleteOne, batchUpdate };
