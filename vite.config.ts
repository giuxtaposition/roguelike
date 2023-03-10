import { defineConfig } from "vitest/config"
import { svelte } from "@sveltejs/vite-plugin-svelte"

export default defineConfig({
    plugins: [svelte()],
    test: {
        include: ["src/**/*.{test,spec}.{js,ts}"],
        globals: true,
        environment: "jsdom",
        setupFiles: ["src/__tests__/testSetup.ts"],
    },
    base: "/roguelike/",
})
