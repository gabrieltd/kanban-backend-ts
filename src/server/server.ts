import express, { Application } from "express";

import authRoutes from "../routes/auth.route";
import profileRoutes from "../routes/profile.route";
import boardRoutes from "../routes/board.route";
import taskRoutes from "../routes/task.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "../middlewares/globalErrorHandler";
import "express-async-errors";
import logger from "../utils/logger";
import { checkDatabaseConnection } from "../utils/prisma";

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		auth: "/api/auth",
		boards: "/api/boards",
		tasks: "/api/tasks",
		profile: "/api/profile",
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || "3005";

		this.middlewares();
		this.routes();

		checkDatabaseConnection();
	}

	middlewares() {
		this.app.use(
			cors({
				origin: "http://localhost:4200",
				credentials: true,
				optionsSuccessStatus: 200,
			})
		);
		this.app.use(cookieParser());
		this.app.use(express.json());
	}

	routes() {
		this.app.use(this.apiPaths.boards, boardRoutes);
		this.app.use(this.apiPaths.tasks, taskRoutes);
		this.app.use(this.apiPaths.auth, authRoutes);
		this.app.use(this.apiPaths.profile, profileRoutes);
		this.app.use("*", errorHandler);
	}

	listen() {
		this.app.listen(this.port, () => {
			logger.info(`Servidor iniciado en puerto ${this.port}`);
		});
	}
}

export default Server;
