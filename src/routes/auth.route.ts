import { Router } from "express";

import * as controller from "../controllers/auth.controller";
import * as schema from "../schemas/auth.schema";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.post(
	"/register",
	[schemaValidator(schema.registerUserSchema)],
	controller.register
);

router.post(
	"/login",
	[schemaValidator(schema.loginUserSchema)],
	controller.login
);

router.get("/refresh", controller.refresh);

router.get("/logout", controller.logout);

export default router;
