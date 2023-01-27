import { Request, Response } from "express";
import * as service from "../services/task.service";

export const getOne = async (req: Request, res: Response) => {
	const { taskId } = req.params;

	const response = await service.findByTaskId(taskId);

	res.json(response);
};

export const getAll = async (req: Request, res: Response) => {
	const { boardId } = req.params;
	const response = await service.findBoardTasks(boardId);

	res.json(response);
};

export const save = async (req: Request, res: Response) => {
	const task = req.body;

	const response = await service.createTask(task);

	res.json(response);
};

export const update = async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const taskUpdate = req.body;

	const response = await service.updateTask(taskId, taskUpdate);

	res.json(response);
};

export const destroy = async (req: Request, res: Response) => {
	const { taskId } = req.params;

	const response = await service.deleteTask(taskId);

	res.json(response);
};

export const updateMany = async (req: Request, res: Response) => {
	const { tasks } = req.body;

	const response = await service.updateTasks(tasks);

	res.json(response);
};
