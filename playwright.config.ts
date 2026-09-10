import { defineConfig, devices } from "@playwright/test";

export default defineConfig({ testDir: "./e2e", use: { baseURL: "http://localhost:3001", trace: "on-first-retry" }, webServer: { command: "npm run dev -- --port 3001", url: "http://localhost:3001", reuseExistingServer: false, timeout: 180000 }, projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }] });
