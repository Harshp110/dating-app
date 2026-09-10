import { test, expect } from "@playwright/test";

test("welcome screen routes to authentication", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /meet people through moments/i })).toBeVisible();
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
});

test("protected discovery redirects without a session", async ({ page }) => {
  await page.goto("/discover");
  await expect(page).toHaveURL(/\/login$/);
});
