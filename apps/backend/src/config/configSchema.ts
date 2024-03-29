import { z } from "zod"

const stringToNumberSchema = z
	.string()
	.transform((val) => parseFloat(val))
	.refine((num) => !isNaN(num))

const configSchema = z.object({
	PORT: stringToNumberSchema,
	JWT_SECRET_KEY: z.string(),
	PEPPER: z.string(),
	SALT_ROUNDS: stringToNumberSchema,
	JWT_EXPIRES_IN: z.string(),
})

export default configSchema