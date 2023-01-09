import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import logger from "../utils/logger";

const schemaValidator =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		schema.parse({
			body: req.body,
			params: req.params,
			query: req.query,
		});
		next();
	};

export default schemaValidator;
