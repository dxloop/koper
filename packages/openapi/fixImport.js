import fs from "fs"
import path from "path"

let counter = 0

const srcDir = "./src/generated"

try {
	fs.rmSync(path.join(srcDir, "index.ts"))
} catch (e) {
    console.log("No index.ts file found")
}

/**
 * Replace relative import paths with absolute import paths
 * @param {String} filePath The path to the file 
 */
function processFile(filePath) {
	const content = fs.readFileSync(filePath, "utf8")

	const updatedContent = content.replace(
		/from\s+["'](\..?\/[^"']+)["'];/g, // Match import statements
		(match, importPath) => {
			const jsImportPath = !importPath.includes(".js") ? importPath + ".js" : importPath
            // Replace relative import path with absolute import path
			return `from "${jsImportPath}";`
		}
	)

    // Write file if content has changed
	if (content !== updatedContent) {
		counter++
		fs.writeFileSync(filePath, updatedContent)
	}
}

/**
 * Iterate over all files in a directory and subdirectories
 * @param {String} directoryPath The path to the directory
 */
function processDirectory(directoryPath) {
	const files = fs.readdirSync(directoryPath)
	for (const file of files) {
		const filePath = path.join(directoryPath, file)
		const stats = fs.statSync(filePath)

		// Check if it is a file or directory
		if (stats.isFile()) {
			if (filePath.endsWith(".ts")) {
				processFile(filePath)
			}
		} else if (stats.isDirectory()) {
			processDirectory(filePath)
		}
	}
}

processDirectory(srcDir)