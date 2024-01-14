import { zodiosContext } from "@zodios/express"
import { z } from "zod"

const userSchema = z.object({
	id: z.union([
		z.bigint().min(0n),
		z
			.number()
			.min(0)
			.transform((id) => BigInt(id)),
		z
			.string()
			.transform((id) => BigInt(id))
			.refine((id) => id >= 0n, { message: "Invalid userId" })
	])
})

/**
 * The context of the user for every request.
 */
export const contextSchema = z.object({
	user: userSchema.nullable().default(null)
})

/**
 * The context of the user for adding it to the zodios interface.
 */
export default zodiosContext(contextSchema)