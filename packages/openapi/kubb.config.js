import { defineConfig } from "@kubb/core"
import createSwagger from "@kubb/swagger"
import createSwaggerClient from "@kubb/swagger-client"
import createSwaggerTanstackQuery from "@kubb/swagger-tanstack-query"
import createSwaggerTs from "@kubb/swagger-ts"
import createSwaggerZod from "@kubb/swagger-zod"
import createSwaggerZodios from "@kubb/swagger-zodios"

export default defineConfig({
	root: ".",
	hooks: {
		done: [
			"node ./fixImport.js", // Fix relative import paths,
			"node ./createJsonSpec.js" // Create json spec file
		]
	},
	input: {
		path: "./src/resources/openapi.yaml"
	},
	output: {
		path: "./src/generated",
		clean: true,
		write: true
	},
	plugins: [
        // Contains swagger documentation
		createSwagger({
			output: { path: "swagger" },
			validate: true
		}),
        // Typed http client
		createSwaggerClient({
			output: { path: "swagger-client" },
            // Use client to inject bearer token
			client: { importPath: "../../client.js" },
			dataReturnType: "data"
		}),
        // Typed resource models with ts-docs
		createSwaggerTs({
			output: { path: "swagger-ts" }
		}),
        // Validation with zod
		createSwaggerZod({
			output: { path: "zod" }
		}),
        // Validate responses on express server
		createSwaggerZodios({
			output: { path: "zodios" }
		}),
        // Typed react-query hooks
		createSwaggerTanstackQuery({
			output: { path: "tanstack-query" },
            // Use client to inject bearer token
			client: { importPath: "../../client.js" },
			dataReturnType: "data"
		})
	]
})