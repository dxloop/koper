import zodios from "./generated/zodios.js"
import { openapi } from "./resources/openapi.js"

// Typed Models with ts-docs
export * from "./generated/swagger-ts/index.js"
// Typed HTTP Client with axios
export * from "./generated/swagger-client/index.js"
// TanStack Query using axios client functions
export * from "./generated/tanstack-query/index.js"
// Validation objects using zod
export * from "./generated/zod/index.js"
// API Interface with validation support
export * from "./generated/zodios.js"

export const zodiosApiInterface = zodios.api

// Export the axios client
export * from "./client.js"

// Export openapi spec in ts
export const openapiSpec = openapi
