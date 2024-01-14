import fs from "fs"
import YAML from "yaml"

const swaggerDocument = YAML.parse(fs.readFileSync(`${process.cwd()}/src/resources/openapi.yaml`, "utf8"))

// Write file to resources folder
fs.writeFileSync(`${process.cwd()}/src/resources/openapi.ts`, "export const openapi = " + JSON.stringify(swaggerDocument, null, 2))