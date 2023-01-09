import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError";
import logger from "../utils/logger";
import { ZodError } from "zod";

const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.error(err.message);
	const status: boolean = false;

	if (err instanceof CustomError) {
		return res.status(err.errorCode).send({
			status,
			errors: err.serializeErrors(),
		});
	}

	if (err instanceof ZodError) {
		const errCode = 400;

		const errFormat = err.issues.map((errObj) => {
			return {
				code: errCode,
				type: errObj.code.toUpperCase(),
				path: errObj.path,
				message: errObj.message,
			};
		});

		return res.status(errCode).send({ status, errors: errFormat });
	}

	res.status(500).send({
		status,
		errors: [
			{
				code: 500,
				type: "INTERNAL_SERVER_ERROR",
				message: "Internal server error",
			},
		],
	});
};

export default errorHandler;
