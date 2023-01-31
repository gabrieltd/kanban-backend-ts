import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { Board } from "@prisma/client";
import { createBoardInput, updateBoardInput } from "../validators/board.schema";

export const findByBoardId = async (boardId: string): Promise<Board> => {
	const board = await prisma.board.findUnique({ where: { id: boardId } });

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	return board;
};

export const findBoards = async (projectId: string): Promise<Board[]> => {
	const project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const boards = await prisma.board.findMany({
		where: { projectId },
		include: { tasks: true },
	});

	return boards;
};

export const createBoard = async (
	board: createBoardInput,
	projectId: string
): Promise<Board> => {
	const project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const boardCreated = await prisma.board.create({
		data: { ...board, projectId },
		include: { tasks: true },
	});

	return boardCreated;
};

export const updateBoard = async (
	boardUpdate: updateBoardInput,
	boardId: string
): Promise<Board> => {
	const board = await prisma.project.findUnique({
		where: { id: boardId },
	});

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	const boardUpdated = await prisma.board.update({
		where: { id: boardId },
		data: { ...boardUpdate },
	});

	return boardUpdated;
};

export const deleteBoard = async (boardId: string): Promise<Board> => {
	const board = await prisma.board.findUnique({ where: { id: boardId } });

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	const boardDeleted = await prisma.board.delete({
		where: { id: boardId },
		include: { tasks: true },
	});

	return boardDeleted;
};

export const updateBoardsPriority = async (
	boards: Board[]
): Promise<Board[]> => {
	const boardsUpdated = await prisma.$transaction(
		boards.map((b) =>
			prisma.board.update({
				where: { id: b.id },
				data: { priority: b.priority },
				include: { tasks: true },
			})
		)
	);

	return boardsUpdated;
};
