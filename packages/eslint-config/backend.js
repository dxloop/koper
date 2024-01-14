const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

module.exports = {
	extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
	plugins: [
        "jsdoc", 
        "@typescript-eslint", 
        "eslint-plugin-tsdoc"
    ],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	settings: {
		"import/resolver": {
			typescript: {
				project
			}
		}
	},
	ignorePatterns: ["node_modules/", "dist/", "**/*.{js,cjs}", ".eslintrc.cjs"],
	rules: {
		"import/no-default-export": "off",
		"eqeqeq": ["error", "always"],
		"quotes": ["error", "double"],

        // JSDocs Rules
		"jsdoc/require-jsdoc": [
			"error",
			{
				require: {
					FunctionDeclaration: true,
					ArrowFunctionExpression: true,
					MethodDefinition: true,
					ClassDeclaration: true
				}
			}
		],
		"jsdoc/require-description": "error",
		"tsdoc/syntax": "warn"
    }
}