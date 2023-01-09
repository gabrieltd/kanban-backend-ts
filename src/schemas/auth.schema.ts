import { object, string, z } from "zod";

export const registerUserSchema = z.object({
	body: z.object({
		password: string().min(6),
		email: string().email(),
	}),
});

export const loginUserSchema = z.object({
	body: z.object({
		password: string(),
		email: string().email(),
	}),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>["body"];
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"];
