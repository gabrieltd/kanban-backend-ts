import { number, object, string } from "zod";

export const createTaskSchema = object({
	body: object({
		description: string().min(1),
		color: string().min(1),
		priority: number().min(0),
		boardId: string().min(1),
	}),
});

export const updateTaskSchema = object({
	body: object({
		description: string().min(1).optional(),
		color: string().min(1).optional(),
		priority: number().min(0).optional(),
		boardId: string().min(1).optional(),
	}),
	params: object({
		taskId: string().min(1),
	}),
});

export const getTaskSchema = object({
	params: object({
		taskId: string().min(1),
	}),
});

export const deleteTaskSchema = object({
	params: object({
		taskId: string().min(1),
	}),
});
