import { expect, test } from "@playwright/test";

test("loads the editor and creates a rectangle", async ({ page }) => {
  await page.goto("/vectorforge-studio/");

  await expect(page.getByText("VectorForge Studio")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /star on github/i }),
  ).toHaveAttribute(
    "href",
    "https://github.com/baditaflorin/vectorforge-studio",
  );
  await expect(page.getByRole("link", { name: /paypal/i })).toHaveAttribute(
    "href",
    "https://www.paypal.com/paypalme/florinbadita",
  );
  await expect(page.getByText(/v0\.1\.0/)).toBeVisible();
  await expect(page.getByText(/commit/)).toBeVisible();

  await page.getByRole("button", { name: "Rectangle" }).click();
  const artboard = page.locator("svg.artboard");
  const box = await artboard.boundingBox();
  expect(box).not.toBeNull();

  if (!box) {
    return;
  }

  await page.mouse.move(box.x + 160, box.y + 160);
  await page.mouse.down();
  await page.mouse.move(box.x + 300, box.y + 260);
  await page.mouse.up();

  await expect(page.getByText(/4 elements/)).toBeVisible();
});
