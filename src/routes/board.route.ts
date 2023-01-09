import { Router } from "express";

import schemaValidator from "../middlewares/schemaValidator";
import { validateJWT } from "../middlewares/validateJWT";

import * as controller from "../controllers/board.controller";
import * as schema from "../schemas/board.schema";

const router = Router();

router.get("/", [validateJWT], controller.getAll);

router.get(
	"/:boardId",
	[schemaValidator(schema.getBoardSchema), validateJWT],
	controller.getOne
);

router.post(
	"/",
	[schemaValidator(schema.createBoardSchema), validateJWT],
	controller.postOne
);

router.put("/batch", [validateJWT], controller.batchUpdate);

router.put(
	"/:boardId",
	[schemaValidator(schema.updateBoardSchema), validateJWT],
	controller.putOne
);

router.delete(
	"/:boardId",
	[schemaValidator(schema.deleteBoardSchema), validateJWT],
	controller.deleteOne
);

export default router;
