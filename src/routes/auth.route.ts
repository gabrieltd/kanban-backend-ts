import { Router } from "express";

import * as controller from "../controllers/auth.controller";
import * as schema from "../validators/auth.schema";

import schemaValidator from "../middlewares/schemaValidator";

const router = Router();

const path = "/auth";

router.post(
	`${path}/register`,
	[schemaValidator(schema.registerUserSchema)],
	controller.register
);

router.post(
	`${path}/login`,
	[schemaValidator(schema.loginUserSchema)],
	controller.login
);

router.get(`${path}/refresh`, controller.refresh);

router.get(`${path}/logout`, controller.logout);

export default router;
