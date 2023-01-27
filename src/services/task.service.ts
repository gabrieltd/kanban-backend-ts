import prisma from "../utils/prisma";
import NotFoundError from "../errors/NotFoundError";

import { Task } from "@prisma/client";
import { CreateTaskInput, UpdateTaskInput } from "../validators/task.schema";

export const findByTaskId = async (taskId: string): Promise<Task> => {
	const task = await prisma.task.findUnique({ where: { id: taskId } });

	if (!task) {
		throw new NotFoundError("Task not found");
	}

	return task;
};

export const findBoardTasks = async (boardId: string): Promise<Task[]> => {
	const board = await prisma.board.findUnique({
		where: { id: boardId },
	});

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	const tasks = await prisma.task.findMany({ where: { boardId } });
	return tasks;
};

export const createTask = async (task: CreateTaskInput): Promise<Task> => {
	const board = await prisma.board.findUnique({
		where: { id: task.boardId },
	});

	if (!board) {
		throw new NotFoundError("Board not found");
	}

	const taskCreated = await prisma.task.create({
		data: { ...task },
	});

	return taskCreated;
};

export const updateTask = async (
	taskId: string,
	taskUpdate: UpdateTaskInput
): Promise<Task> => {
	const task = await prisma.task.findUnique({ where: { id: taskId } });

	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const taskUpdated = await prisma.task.update({
		where: { id: taskId },
		data: { ...taskUpdate },
	});

	return taskUpdated;
};

export const deleteTask = async (taskId: string): Promise<Task> => {
	const task = await prisma.task.findUnique({ where: { id: taskId } });

	if (!task) {
		throw new NotFoundError("Task not found");
	}

	const taskDeleted = await prisma.task.delete({ where: { id: taskId } });

	return taskDeleted;
};

export const updateTasks = async (tasks: Task[]): Promise<Task[]> => {
	const tasksUpdated = await prisma.$transaction(
		tasks.map((t) =>
			prisma.task.update({
				where: { id: t.id },
				data: { ...t },
			})
		)
	);

	return tasksUpdated;
};
