import { array, boolean, object, string } from "zod";

export const createProjectSchema = object({
	body: object({
		project: object({
			title: string(),
			description: string(),
		}),

		members: array(
			object({
				id: string(),
				admin: boolean().optional(),
				pending: boolean(),
			})
		),
	}),
});

export const updateProjectSchema = object({
	body: object({
		project: object({
			title: string(),
			description: string(),
		}),

		members: array(
			object({
				id: string(),
				admin: boolean().optional(),
				pending: boolean(),
			})
		),
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
