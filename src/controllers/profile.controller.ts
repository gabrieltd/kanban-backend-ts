import { Request, Response } from "express";

import * as service from "../services/profile.service";

export const getOne = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const userIdToken = req.user.id;

	const response = await service.findProfile(userId, userIdToken);
	res.json(response);
};

export const getAll = async (req: Request, res: Response) => {
	const { q = "" } = req.query;

	const response = await service.findProfiles(q as string);

	res.json(response);
};

export const update = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { username, bio } = req.body;

	const response = await service.updateProfile(
		username,
		bio,
		userId,
		req.user.id
	);

	res.json(response);
};
