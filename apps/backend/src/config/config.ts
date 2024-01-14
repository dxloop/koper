import { config as loadConfig } from "dotenv"
import { SignOptions, VerifyOptions } from "jsonwebtoken"
import configSchema from "./configSchema.js"

const { parsed } = loadConfig({ path: ".env" })
const config = configSchema.parse(parsed)

/** Express Server Port */
export const PORT = config.PORT

/** Secret Key which is used to sign the JWT */
export const JWT_SECRET_KEY = config.JWT_SECRET_KEY

/** Pepper for hashing the given passwords */
export const PEPPER = config.PEPPER

/** The amount of salt rounds for the given password */
export const SALT_ROUNDS = config.SALT_ROUNDS

/** JWT signing options */
export const JWT_SIGN_OPTIONS: SignOptions = {
	/** Seconds until the JWT expires. */
	expiresIn: config.JWT_EXPIRES_IN
}

/** Options for verifying the jwt. */
export const JWT_VERIFY_OPTIONS: VerifyOptions = {
	/** JWT must be signed with the algorithm specified in JWT_SIGN_OPTIONS. */
	complete: true
}