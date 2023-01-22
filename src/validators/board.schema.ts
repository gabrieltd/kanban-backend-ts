import { number, object, string, z } from "zod";

export const createBoardSchema = object({
	body: object({
		title: string().min(1).max(20),
		priority: number().min(0),
	}),
});

export const updateBoardSchema = object({
	body: object({
		title: string().min(1).max(20).optional(),
		priority: number().min(0).optional(),
	}),
	params: object({
		projectId: string().min(1),
		boardId: string().min(1),
	}),
});

export const getBoardSchema = object({
	params: object({
		boardId: string().min(1),
	}),
});

export const deleteBoardSchema = object({
	params: object({
		boardId: string().min(1),
	}),
});

export type createBoardInput = z.infer<typeof createBoardSchema>["body"];
export type updateBoardInput = z.infer<typeof updateBoardSchema>["body"];
