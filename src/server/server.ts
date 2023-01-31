import express, { Application } from "express";
import * as http from "http";
import * as socketio from "socket.io";
import authRoutes from "../routes/auth.route";
import profileRoutes from "../routes/profile.route";
import boardRoutes from "../routes/board.route";
import taskRoutes from "../routes/task.route";
import projectRoutes from "../routes/project.route";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "../middlewares/globalErrorHandler";
import "express-async-errors";
import logger from "../utils/logger";
import { checkDatabaseConnection } from "../utils/prisma";
import { corsOptions } from "../helpers/corsOptions";
import Sockets from "./sockets";

class Server {
	private static instance: Server;

	private app: Application;
	private port: string;
	private apiPath = "/api";
	private io: socketio.Server;
	private server: http.Server;
	public socket: Sockets;
	constructor() {
		this.app = express();
		this.port = process.env.PORT || "3005";

		checkDatabaseConnection();

		this.server = http.createServer(this.app);

		this.io = new socketio.Server(this.server, { cors: corsOptions });
		this.socket = new Sockets(this.io);
	}

	static getInstance(): Server {
		if (!Server.instance) {
			Server.instance = new Server();
		}
		return Server.instance;
	}

	// socketsConfig() {}

	middlewares() {
		this.app.use(cors(corsOptions));
		this.app.use(cookieParser());
		this.app.use(express.json());
		this.app.use(morgan("common"));
	}

	routes() {
		this.app.use(this.apiPath, boardRoutes);
		this.app.use(this.apiPath, taskRoutes);
		this.app.use(this.apiPath, authRoutes);
		this.app.use(this.apiPath, projectRoutes);
		this.app.use(this.apiPath, profileRoutes);
		this.app.use("*", errorHandler);
	}

	run() {
		this.middlewares();
		this.routes();

		// this.socketsConfig();

		this.server.listen(this.port, () => {
			logger.info(`Server started on port ${this.port}`);
		});
	}
}

export default Server;
