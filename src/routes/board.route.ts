import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/board.controller";
import * as schema from "../validators/board.schema";
import { authorizeProjectAccess } from "../middlewares/authorizeResourceAccess";

const router = Router();

const path = "/projects/:projectId/boards";

router.get(
	`${path}/`,
	[validateJWT, authorizeProjectAccess],
	controller.getAll
);

router.get(
	`${path}/:boardId`,
	[
		schemaValidator(schema.getBoardSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.getOne
);

router.post(
	`${path}/`,
	[
		schemaValidator(schema.createBoardSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.save
);

router.put(
	`${path}/batch`,
	[validateJWT, authorizeProjectAccess],
	controller.batch
);

router.put(
	`${path}/:boardId`,
	[
		schemaValidator(schema.updateBoardSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.update
);

router.delete(
	`${path}/:boardId`,
	[
		schemaValidator(schema.deleteBoardSchema),
		validateJWT,
		authorizeProjectAccess,
	],
	controller.destroy
);

export default router;
