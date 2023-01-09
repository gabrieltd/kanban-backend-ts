import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/profile.controller";
// import * as schema from "../schemas/profile.schema";
import {
	getProfileSchema,
	updateProfileSchema,
} from "../schemas/profile.schema";

const router = Router();

router.get(
	"/:userId",
	[validateJWT, schemaValidator(getProfileSchema)],
	controller.getOne
);
router.put(
	"/:userId",
	[validateJWT, schemaValidator(updateProfileSchema)],
	controller.putOne
);

export default router;
