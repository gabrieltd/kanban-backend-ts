import { Request, Response } from "express";

import UnauthorizedError from "../errors/UnauthorizedError";

import * as service from "../services/auth.service";

const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const { response, refreshToken } = await service.createUser(
		email,
		password
	);

	res.cookie("rtoken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	res.json(response);
};

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const { response, refreshToken } = await service.loginUser(email, password);

	res.cookie("rtoken", refreshToken, {
		httpOnly: true,

		secure: true,
		sameSite: "none",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.json(response);
};

const refresh = async (req: Request, res: Response) => {
	if (!req.cookies.rtoken) {
		throw new UnauthorizedError(401, "Unauthorized");
	}
	const refreshToken = req.cookies.rtoken;

	const response = await service.refreshUserSession(refreshToken);

	res.json(response);
};

//No service
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
