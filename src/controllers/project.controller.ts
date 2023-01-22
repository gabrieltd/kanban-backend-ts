import { Request, Response } from "express";

import {
	createProject,
	deleteProject,
	findByProjectId,
	findProjects,
	updateProject,
} from "../services/project.service";

export const getOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const response = await findByProjectId(projectId, userId);

	res.json(response);
};

export const getAll = async (req: Request, res: Response) => {
	const userId = req.user.id;

	const response = await findProjects(userId);

	res.json(response);
};

export const save = async (req: Request, res: Response) => {
	const { project, members } = req.body;
	const userId = req.user.id;

	const response = await createProject(userId, project, members);

	res.json(response);
};

export const update = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;
	const { project, members } = req.body;

	const response = await updateProject(projectId, userId, project, members);
	res.json(response);
};

export const destroy = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const response = await deleteProject(projectId, userId);

	res.json(response);
};
