import { expect, test, type Page } from "@playwright/test";

async function openFreshEditor(page: Page) {
  await page.goto("/vectorforge-studio/");
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase("vectorforge-studio");
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  });
  await page.goto("/vectorforge-studio/");
}

test("loads the editor and creates a rectangle", async ({ page }) => {
  await openFreshEditor(page);

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
  await expect(page.getByText(/v0\.3\.0/)).toBeVisible();
  await expect(page.getByText(/commit/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Export PNG" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Import files" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy SVG" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Share URL" })).toBeVisible();

  await page.getByRole("button", { name: "Edit nodes and handles" }).click();
  await page.getByRole("button", { name: /add node/i }).click();
  await expect(page.getByText(/4 anchors/i)).toBeVisible();

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

test("imports real SVG data and restores saved work", async ({ page }) => {
  await openFreshEditor(page);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160">
    <title>User icon</title>
    <rect id="box" x="20" y="20" width="80" height="60" fill="#ff0000" />
    <path id="stroke" d="M 120 30 C 180 20 180 120 120 110" fill="none" stroke="#000000" />
  </svg>`;

  await page.locator('input[type="file"]').setInputFiles({
    name: "user-icon.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from(svg),
  });
  await expect(page.getByText(/Imported SVG/)).toBeVisible();
  await expect(page.getByText(/2 elements/)).toBeVisible();

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText(/Saved locally/)).toBeVisible();
  await page.reload();
  await expect(
    page.getByText(/Restored your last local session/),
  ).toBeVisible();
  await expect(page.getByText(/2 elements/)).toBeVisible();
});
