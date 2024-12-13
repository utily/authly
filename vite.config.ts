/// <reference types="vitest/config" />
import { defineConfig } from "vite"

export default defineConfig({
	test: {
		typecheck: {
			tsconfig: "./tsconfig.test.json",
		},
		coverage: {
			reporter: ["text", "json", "html"],
		},
		globals: true,
		include: ["**/*.spec.[tj]s"],
		testTimeout: 20000,
		isolate: false,
		exclude: ["node_modules", "dist"],
		server: {
			deps: {
				inline: ["cryptly", "isly", "isoly", "typedly"],
			},
		},
	},
})
