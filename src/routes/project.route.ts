import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/project.controller";
import * as schema from "../validators/project.schema";
import { authorizeProjectAccess } from "../middlewares/authorizeResourceAccess";

const router = Router();

const path = "/projects";

router.get(`${path}/`, [validateJWT], controller.getAll);

router.get(
	`${path}/:projectId`,
	[
		schemaValidator(schema.getProjectSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.getOne
);

router.post(
	`${path}/`,
	[schemaValidator(schema.createProjectSchema), validateJWT],
	controller.save
);

router.put(
	`${path}/:projectId`,
	[
		schemaValidator(schema.updateProjectSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.update
);

router.delete(
	`${path}/:projectId`,
	[
		schemaValidator(schema.deleteProjectSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.destroy
);

export default router;
