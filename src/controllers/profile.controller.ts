import { Request, Response } from "express";
import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { checkOwnership } from "../lib/checkOwnership";
import UnauthorizedError from "../errors/UnauthorizedError";
import { generateImage } from "../lib/generateImage";
import DuplicationError from "../errors/DuplicationError";

const getOne = async (req: Request, res: Response) => {
	const { userId } = req.params;

	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		throw new NotFoundError("User not found");
	}

	if (!checkOwnership(req.user.id, user.id)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	res.json(user);
};

const putOne = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { username, bio } = req.body;

	const usernameExist = await prisma.user.findUnique({
		where: { username: username },
	});

	if (usernameExist && usernameExist.id !== userId) {
		throw new DuplicationError("Username already taken");
	}

	if (!checkOwnership(req.user.id, userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const image = generateImage(username);

	const updated = await prisma.user.update({
		where: { id: userId },
		data: { username, bio, image },
	});

	res.json({
		id: updated.id,
		email: updated.email,
		username: updated.username,
		image: updated.image,
		bio: updated.bio,
	});
};

export { getOne, putOne };
