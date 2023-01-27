import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/task.controller";
import * as schema from "../validators/task.schema";
import { authorizeProjectAccess } from "../middlewares/authorizeResourceAccess";

const router = Router();

const path = "/projects/:projectId/boards/:boardId/tasks";

router.get("/", [validateJWT, authorizeProjectAccess], controller.getAll);

router.get(
	`${path}/:taskId`,
	[
		schemaValidator(schema.getTaskSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.getOne
);

router.post(
	`${path}/`,
	[
		schemaValidator(schema.createTaskSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.save
);

router.put(
	`${path}/`,
	[validateJWT, authorizeProjectAccess],
	controller.updateMany
);

router.put(
	`${path}/:taskId`,
	[
		schemaValidator(schema.updateTaskSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.update
);

router.delete(
	`${path}/:taskId`,
	[
		schemaValidator(schema.deleteTaskSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.destroy
);

export default router;
