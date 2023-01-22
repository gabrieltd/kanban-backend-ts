import prisma from "../utils/prisma";
import DuplicationError from "../errors/DuplicationError";
import { encrypt, verifyHash } from "../utils/bcrypt";
import { generateUsername } from "unique-username-generator";
import { generateImage } from "../helpers/generateImage";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
} from "../utils/jwt";
import ValidationError from "../errors/ValidationError";
import { response } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";

export const createUser = async (email: string, password: string) => {
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (user) {
		throw new DuplicationError("User already exist");
	}

	const passwordHash = await encrypt(password);
	const username = generateUsername("-", 3);
	const image = generateImage(username);

	const registeredUser = await prisma.user.create({
		data: { email, password: passwordHash, username, image },
	});

	const accessToken = generateAccessToken(registeredUser.id);
	const refreshToken = generateRefreshToken(registeredUser.id);

	return {
		response: {
			ok: true,
			token: accessToken,
			user: {
				id: registeredUser.id,
				email: registeredUser.email,
				username: registeredUser.username,
				image: registeredUser.image,
				bio: registeredUser.bio,
			},
		},
		refreshToken,
	};
};

export const loginUser = async (email: string, password: string) => {
	const user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		throw new ValidationError("Invalid credentials");
	}

	const passwordHash = user.password;

	const isCorrect = await verifyHash(password, passwordHash);

	if (!isCorrect) {
		throw new ValidationError("Invalid credentials");
	}

	const accessToken = generateAccessToken(user.id);
	const refreshToken = generateRefreshToken(user.id);

	return {
		response: {
			ok: true,
			token: accessToken,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				image: user.image,
				bio: user.bio,
			},
		},
		refreshToken,
	};
};

export const refreshUserSession = async (refreshToken: string) => {
	const {
		payload: { id },
	} = await verifyToken(refreshToken, "refresh");

	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (!user) {
		throw new UnauthorizedError(401, "Unauthorized");
	}

	const accessToken = generateAccessToken(id);

	const response = {
		ok: true,
		token: accessToken,
		user: {
			id: user.id,
			email: user.email,
			username: user.username,
			image: user.image,
			bio: user.bio,
		},
	};

	return response;
};
