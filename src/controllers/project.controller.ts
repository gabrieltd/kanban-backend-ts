import { Request, Response } from "express";
import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";

import DuplicationError from "../errors/DuplicationError";

const getOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const response = await prisma.project.findUnique({
		where: { id: projectId },
		include: {
			boards: { include: { tasks: true } },
			members: {
				include: {
					user: {
						select: {
							id: true,
							username: true,
							image: true,
							bio: true,
						},
					},
				},
			},
		},
	});

	if (!response) {
		throw new NotFoundError("Project not found");
	}

	// if (!checkOwnership(userId, response.userId)) {
	// 	throw new UnauthorizedError(403, "Forbidden");
	// }

	res.json(response);
};

const getAll = async (req: Request, res: Response) => {
	const userId = req.user.id;

	const projects = await prisma.project.findMany({
		where: { userId },
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							username: true,
							image: true,
							bio: true,
						},
					},
				},
			},
		},
	});

	const memberProjects = await prisma.project.findMany({
		where: { members: { some: { userId } } },
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							username: true,
							image: true,
							bio: true,
						},
					},
				},
			},
		},
	});

	res.json([...projects, ...memberProjects]);
};

const postOne = async (req: Request, res: Response) => {
	const { project, members } = req.body;
	const userId = req.user.id;

	const projectExist = await prisma.project.findUnique({
		where: { title: project.title },
	});

	if (projectExist) {
		throw new DuplicationError(`Project title already registered`);
	}

	const projectCreated = await prisma.project.create({
		data: {
			title: project.title,
			description: project.description,
			userId,
		},
	});

	const membershipSubmit = members
		.filter(
			(obj: any, index: any, self: any) =>
				index === self.findIndex((t: any) => t.id === obj.id)
		)
		.filter((member: any) => {
			return member.id !== userId;
		})
		.map((member: any) => {
			return {
				projectId: projectCreated.id,
				canWrite: true,
				pending: true,
				userId: member.id,
			};
		});

	const membershipCreated = await prisma.membership.createMany({
		data: membershipSubmit,
	});

	res.json(projectCreated);
};

const putOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const { project: projectUpdated, members } = req.body;

	const project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	const projectDuplicated: any =
		await prisma.$queryRaw`SELECT * FROM "Project" WHERE "title" = ${projectUpdated.title} AND "userId" = ${userId}`;

	if (
		projectDuplicated.length !== 0 &&
		project.title !== projectUpdated.title
	) {
		throw new DuplicationError("Project title already registered");
	}

	// if (!checkOwnership(userId, project.userId)) {
	// 	throw new UnauthorizedError(403, "Forbidden");
	// }

	const projectResponse = await prisma.project.update({
		where: { id: projectId },
		data: {
			title: projectUpdated.title,
			description: projectUpdated.description,
		},
	});

	const membersSubmit = members.map((m: any) => {
		return {
			userId: m.id,
			canWrite: true,
			projectId: projectResponse.id,
			pending: m.pending,
		};
	});

	const deleteMembers = prisma.membership.deleteMany({
		where: { projectId: projectResponse.id },
	});

	const createMembers = prisma.membership.createMany({ data: membersSubmit });

	const transaction = await prisma.$transaction([
		deleteMembers,
		createMembers,
	]);

	res.json(projectResponse);
};

const deleteOne = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const userId = req.user.id;

	const project = await prisma.project.findUnique({
		where: { id: projectId },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	// if (!checkOwnership(userId, project.userId)) {
	// 	throw new UnauthorizedError(403, "Forbidden");
	// }

	const response = await prisma.project.delete({ where: { id: projectId } });

	return res.json(response);
};

export { getOne, getAll, putOne, postOne, deleteOne };
