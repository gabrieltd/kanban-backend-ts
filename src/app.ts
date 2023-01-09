import "express-async-errors";
import "dotenv/config";
import Server from "./server/server";

const server = new Server();

server.listen();
