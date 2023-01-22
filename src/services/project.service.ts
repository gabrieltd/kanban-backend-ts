import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";
import { Project, Membership } from "@prisma/client";
import DuplicationError from "../errors/DuplicationError";
import UnauthorizedError from "../errors/UnauthorizedError";

export const findByProjectId = async (projectId: string, userId: string) => {
	const project = await prisma.project.findUnique({
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

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	if (!project.members.some((m) => m.userId === userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	return project;
};

export const findProjects = async (userId: string) => {
	const projects = await prisma.project.findMany({
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

	return projects;
};

export const createProject = async (
	userId: string,
	project: Project,
	members: Membership[]
) => {
	const projectExist = await prisma.project.findUnique({
		where: { title: project.title },
	});

	if (projectExist) {
		throw new DuplicationError(`Project title already registered`);
	}

	const transaction = await prisma.$transaction(async (tx) => {
		const projectCreated = await tx.project.create({
			data: {
				title: project.title,
				description: project.description,
				userId,
			},
		});

		const membershipSubmit = members
			//Filter duplicates
			.filter(
				(obj: any, index: any, self: any) =>
					index === self.findIndex((t: any) => t.id === obj.id)
			)
			//Filter if admin is a member
			.filter((member: any) => {
				return member.id !== userId;
			})
			.map((member: any): Membership => {
				return {
					projectId: projectCreated.id,
					canWrite: true,
					pending: true,
					userId: member.id,
					admin: false,
				};
			});

		const adminMembership: Membership = {
			projectId: projectCreated.id,
			canWrite: true,
			pending: true,
			userId: userId,
			admin: true,
		};

		membershipSubmit.unshift(adminMembership);

		await tx.membership.createMany({
			data: membershipSubmit,
		});

		return projectCreated;
	});

	return transaction;
};

export const updateProject = async (
	projectId: string,
	userId: string,
	projectUpdate: Project,
	membersUpdate: { id: string; pending: boolean }[]
) => {
	const project = await prisma.project.findUnique({
		where: { id: projectId },
		include: { members: true },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	if (!project.members.some((m) => m.userId === userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const projectDuplicated: Project[] =
		await prisma.$queryRaw`SELECT * FROM "Project" WHERE "title" = ${projectUpdate.title} AND "userId" = ${userId}`;

	if (
		projectDuplicated.length !== 0 &&
		project.title !== projectUpdate.title
	) {
		throw new DuplicationError("Project title already registered");
	}

	const transaction = await prisma.$transaction(async (tx) => {
		const projectUpdated = await tx.project.update({
			where: { id: projectId },
			data: {
				title: projectUpdate.title,
				description: projectUpdate.description,
			},
		});

		const [admin] = project.members.filter((m) => m.admin === true);

		const membersSubmit = membersUpdate
			.filter((m) => m.id !== admin.userId)
			.map((m: any) => {
				return {
					userId: m.id,
					canWrite: true,
					projectId: projectUpdated.id,
					pending: m.pending,
					admin: false,
				};
			});

		await tx.membership.deleteMany({
			where: { projectId: projectUpdated.id },
		});

		await tx.membership.createMany({ data: [...membersSubmit, admin] });

		return projectUpdated;
	});

	return transaction;
};

export const deleteProject = async (projectId: string, userId: string) => {
	const project = await prisma.project.findUnique({
		where: { id: projectId },
		include: { members: true },
	});

	if (!project) {
		throw new NotFoundError("Project not found");
	}

	if (!project.members.some((m) => m.userId === userId)) {
		throw new UnauthorizedError(403, "Forbidden");
	}

	const response = await prisma.project.delete({ where: { id: projectId } });
	return response;
};
