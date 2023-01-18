import { Request, Response } from "express";
import prisma from "../utils/prisma";
import DuplicationError from "../errors/DuplicationError";

import { encrypt, verifyHash } from "../utils/bcrypt";
import { generateUsername } from "unique-username-generator";

import {
	generateRefreshToken,
	generateAccessToken,
	verifyToken,
} from "../utils/jwt";
import ValidationError from "../errors/ValidationError";
import UnauthorizedError from "../errors/UnauthorizedError";
import { generateImage } from "../helpers/generateImage";

const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;

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

	res.cookie("rtoken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.json({
		ok: true,
		token: accessToken,
		user: {
			id: registeredUser.id,
			email: registeredUser.email,
			username: registeredUser.username,
			image: registeredUser.image,
			bio: registeredUser.bio,
		},
	});
};

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

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

	res.cookie("rtoken", refreshToken, {
		httpOnly: true,

		secure: true,
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.json({
		ok: true,
		token: accessToken,
		user: {
			id: user.id,
			email: user.email,
			username: user.username,
			image: user.image,
			bio: user.bio,
		},
	});
};

const refresh = async (req: Request, res: Response) => {
	if (!req.cookies.rtoken) {
		throw new UnauthorizedError(401, "Unauthorized");
	}

	const refreshToken = req.cookies.rtoken;

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

	res.json({
		ok: true,
		token: accessToken,
		user: {
			id: user.id,
			email: user.email,
			username: user.username,
			image: user.image,
			bio: user.bio,
		},
	});
};

const logout = (req: Request, res: Response) => {
	if (!req.cookies.rtoken) {
		res.status(204).json({ ok: true });
	}

	res.clearCookie("rtoken", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});
	res.json({ ok: true, message: "Cookie cleared" });
};

export { login, register, refresh, logout };
