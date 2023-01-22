import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/profile.controller";
// import * as schema from "../schemas/profile.schema";
import {
	getProfileSchema,
	updateProfileSchema,
} from "../validators/profile.schema";

const router = Router();

const path = "/profile";

router.get(`${path}/`, [validateJWT], controller.getAll);

router.get(
	`${path}/:userId`,
	[validateJWT, schemaValidator(getProfileSchema)],
	controller.getOne
);

router.put(
	`${path}/:userId`,
	[validateJWT, schemaValidator(updateProfileSchema)],
	controller.update
);

export default router;
