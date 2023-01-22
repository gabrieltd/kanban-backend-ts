import { Request, Response } from "express";

import * as service from "../services/board.service";

export const getOne = async (req: Request, res: Response) => {
	const { boardId } = req.params;

	const response = await service.findByBoardId(boardId);

	res.json(response);
};

export const getAll = async (req: Request, res: Response) => {
	const { projectId } = req.params;

	const response = await service.findBoards(projectId);

	res.json(response);
};

export const save = async (req: Request, res: Response) => {
	const { title, priority } = req.body;
	const { projectId } = req.params;

	const response = await service.createBoard({ title, priority }, projectId);

	res.json(response);
};

export const update = async (req: Request, res: Response) => {
	const { boardId } = req.params;
	const board = req.body;

	const response = await service.updateBoard(board, boardId);

	res.json(response);
};

export const destroy = async (req: Request, res: Response) => {
	const { boardId } = req.params;

	const response = await service.deleteBoard(boardId);

	return res.json(response);
};

export const batch = async (req: Request, res: Response) => {
	const boards = req.body;

	const response = await service.updateBoardsPriority(boards);

	res.json(response);
};
