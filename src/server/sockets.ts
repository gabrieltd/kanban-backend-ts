import { Server, Socket } from "socket.io";

class Sockets {
	private io: Server;

	constructor(io: Server) {
		this.io = io;
		this.socketEvents();
	}

	private socketEvents() {
		this.io.on("connection", (socket: Socket) => {
			console.log("Sockets init");
		});
	}
}
export default Sockets;
