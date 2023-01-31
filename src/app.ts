import "express-async-errors";
import "dotenv/config";
import Server from "./server/server";
// import Sockets from './server/sockets';

// const server = new Server();
const server = Server.getInstance();

server.run();
