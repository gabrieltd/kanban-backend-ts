import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/task.controller";
import * as schema from "../schemas/task.schema";

const router = Router();

router.get("/", [validateJWT], controller.getAll);

router.get(
	"/:taskId",
	[schemaValidator(schema.getTaskSchema), validateJWT],
	controller.getOne
);

router.post(
	"/",
	[schemaValidator(schema.createTaskSchema), validateJWT],
	controller.postOne
);

router.put("/batch", [validateJWT], controller.batchUpdate);

router.put(
	"/:taskId",
	[schemaValidator(schema.updateTaskSchema), validateJWT],
	controller.putOne
);

router.delete(
	"/:taskId",
	[schemaValidator(schema.deleteTaskSchema), validateJWT],
	controller.deleteOne
);

export default router;
