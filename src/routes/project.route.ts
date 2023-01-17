import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/project.controller";
import * as schema from "../validators/project.schema";

const router = Router();

router.get("/", [validateJWT], controller.getAll);

router.get(
	"/:projectId",
	[schemaValidator(schema.getProjectSchema), validateJWT],
	controller.getOne
);

router.post(
	"/",
	[schemaValidator(schema.createProjectSchema), validateJWT],
	controller.postOne
);

router.put(
	"/:projectId",
	[schemaValidator(schema.updateProjectSchema), validateJWT],
	controller.putOne
);

router.delete(
	"/:projectId",
	[schemaValidator(schema.deleteProjectSchema), validateJWT],
	controller.deleteOne
);

export default router;
