import jwt, { Jwt, JwtPayload } from "jsonwebtoken"
import { JWT_SECRET_KEY, JWT_SIGN_OPTIONS, JWT_VERIFY_OPTIONS } from "../config/config.js"

/** Signing types for the jwt token */
type SignTypes = string | object | Buffer

/**
 * Generate a JWT token.
 *
 * @param payload - The payload to be included in the JWT token.
 * @returns The JWT token as string
 */
export const generateToken = <PayloadType extends SignTypes>(payload: PayloadType) => {
	return new Promise<string>((resolve, reject) => {
		jwt.sign(payload, JWT_SECRET_KEY, JWT_SIGN_OPTIONS, (error, token) => {
			if (error) return reject(error)
			if (token === undefined) return reject(new Error("Token is undefined"))

			resolve(token)
		})
	})
}

type DecodeTypes = Jwt | JwtPayload | string

/**
 * Decode and verify a JWT token.
 *
 * @param token - The JWT token to decode and verify.
 * @returns Decoded payload of the JWT token if successful.
 */
export const decodeAndVerifyToken = <PayloadType extends DecodeTypes = Jwt>(token: string) => {
	return new Promise<PayloadType>((resolve, reject) => {
		jwt.verify(token, JWT_SECRET_KEY, JWT_VERIFY_OPTIONS, (error, decoded) => {
			if (error) return reject(error)
			if (decoded === undefined) return reject(new Error("Decoded token is undefined"))

			resolve(decoded as PayloadType)
		})
	})
}