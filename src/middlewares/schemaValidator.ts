import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

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
