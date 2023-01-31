import { Server, Socket } from "socket.io";
import { checkProjectMembership } from "../services/auth.service";
import log from "../utils/logger";

class Sockets {
	private io: Server;

	constructor(io: Server) {
		this.io = io;
		this.socketEvents();
	}

	private socketEvents() {
		this.io.on("connection", (socket: Socket) => {
			socket.on("join-project", async ({ from, to }) => {
				try {
					await checkProjectMembership(from, to);
					socket.join(to);
				} catch (e: any) {
					log.warn(
						`${socket.id} user couldn't join to ${to} project`
					);
				}
			});

			socket.on("leave-project", ({ to }) => {
				socket.leave(to);
				log.warn(`${socket.id} user leave ${to} project`);
			});

			socket.on("board-update", ({ projectId, ...content }) => {
				socket.broadcast.to(projectId).emit("board-update", content);
			});
		});
	}

	public boardUpdate(projectId: string, content: any) {
		this.io.to(projectId).emit("board-update", content);
	}
}
export default Sockets;
