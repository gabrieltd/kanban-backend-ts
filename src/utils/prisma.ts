import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import DatabaseError from "../errors/DatabaseError";

const prisma = new PrismaClient();

export const checkDatabaseConnection = async () => {
	try {
		const result = await prisma.$queryRaw`SELECT 1`;
		if (result) {
			logger.info("Database connected");
		}
	} catch (err) {
		logger.error(err);
		throw new DatabaseError("Database error");
	}
};

export default prisma;
