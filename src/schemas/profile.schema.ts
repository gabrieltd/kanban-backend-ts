import { number, object, string, z } from "zod";

export const updateProfileSchema = object({
	body: object({
		username: string()
			.regex(/^[ña-zA-Z0-9*_.-]*$/)
			.min(3)
			.max(24)
			.optional(),
		bio: string().min(0).optional().nullable(),
	}),
	params: object({
		userId: string().min(1),
	}),
});

export const getProfileSchema = object({
	params: object({
		userId: string().min(1),
	}),
});
