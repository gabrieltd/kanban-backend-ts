import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { checkOwnership } from "../helpers/checkOwnership";
import UnauthorizedError from "../errors/UnauthorizedError";
import { generateImage } from "../helpers/generateImage";
import DuplicationError from "../errors/DuplicationError";

export const findProfile = async (
	userIdRequest: string,
	userIdToken: string
) => {
	const user = await prisma.user.findUnique({ where: { id: userIdRequest } });

	if (!user) {
		throw new NotFoundError("User not found");
	}

	if (!checkOwnership(userIdToken, user.id)) {
		throw new UnauthorizedError(403, "Forbidden");
	}
};

export const findProfiles = async (query: string) => {
	const users = await prisma.user.findMany({
		where: { username: { contains: query } },
	});

	const profiles = users.map((u) => {
		return { id: u.id, username: u.username, bio: u.bio, image: u.image };
	});

	return profiles;
};

export const updateProfile = async (
	username: string,
	bio: string,
	userIdRequest: string,
	userIdToken: string
) => {
	const usernameExist = await prisma.user.findUnique({
		where: { username: username },
	});

	if (usernameExist && usernameExist.id !== userIdRequest) {
		throw new DuplicationError("Username already taken");
	}

	if (!checkOwnership(userIdToken, userIdRequest)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const image = generateImage(username);

	const updated = await prisma.user.update({
		where: { id: userIdRequest },
		data: { username, bio, image },
	});

	const response = {
		id: updated.id,
		email: updated.email,
		username: updated.username,
		image: updated.image,
		bio: updated.bio,
	};
	return response;
};
