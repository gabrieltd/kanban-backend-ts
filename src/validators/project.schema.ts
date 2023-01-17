import { object, string, z } from "zod";

export const createProjectSchema = object({
	body: object({
		title: string().min(3).max(25),
		description: string().min(1).max(80),
	}),
});

export const updateProjectSchema = object({
	body: object({
		title: string().min(3).max(25).optional(),
		description: string().min(1).max(80).optional(),
	}),
	params: object({
		projectId: string().min(1),
	}),
});

export const getProjectSchema = object({
	params: object({
		projectId: string().min(1),
	}),
});

export const deleteProjectSchema = object({
	params: object({
		projectId: string().min(1),
	}),
});
