import { expect, test } from "@playwright/test";

const STORAGE_KEY = "tradurre.example.locale";

test.describe("Tradurre example", () => {
  test("renders the English menu by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 3 })).toHaveText(
      "Tradurre · Coffee Menu",
    );
    await expect(page.getByTestId("coffee-espresso-price")).toHaveText("£2.50");
    await expect(page.getByTestId("coffee-mocha-price")).toHaveText("£4.50");
  });

  test("switches all copy and currency when the locale changes", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("language-select").click();
    await page.getByText("日本語").click();
    await expect(page.getByRole("heading", { level: 3 })).toHaveText(
      "Tradurre · コーヒーメニュー",
    );
    await expect(page.getByTestId("coffee-espresso-price")).toHaveText("￥3");
  });

  test("flips the document direction for RTL locales", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("language-select").click();
    await page.getByText("العربية").click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });

  test.describe("sessionStorage persistence", () => {
    test("persists the selected locale across reloads", async ({ page }) => {
      await page.goto("/");
      await page.getByTestId("language-select").click();
      await page.getByText("Français").click();
      await expect(page.getByRole("heading", { level: 3 })).toHaveText(
        "Tradurre · Carte des Cafés",
      );

      await page.reload();
      await expect(page.getByRole("heading", { level: 3 })).toHaveText(
        "Tradurre · Carte des Cafés",
      );
      const stored = await page.evaluate(
        (key) => sessionStorage.getItem(key),
        STORAGE_KEY,
      );
      expect(stored).toBe("fr");
    });

    test("honors a pre-seeded sessionStorage locale on first load", async ({
      page,
      context,
    }) => {
      await context.addInitScript(
        ([key]) => sessionStorage.setItem(key as string, "de"),
        [STORAGE_KEY],
      );
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 3 })).toHaveText(
        "Tradurre · Kaffeekarte",
      );
    });

    test("ignores garbage in sessionStorage and still mounts", async ({
      page,
      context,
    }) => {
      await context.addInitScript(
        ([key]) =>
          sessionStorage.setItem(
            key as string,
            "totally-not-a-real-locale-xyz",
          ),
        [STORAGE_KEY],
      );
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 3 })).toContainText(
        "Tradurre",
      );
      await page.getByTestId("language-select").click();
      await page.getByText("Italiano").click();
      const stored = await page.evaluate(
        (key) => sessionStorage.getItem(key),
        STORAGE_KEY,
      );
      expect(stored).toBe("it");
    });

    test("clearing storage falls back to navigator detection on reload", async ({
      page,
    }) => {
      await page.goto("/");
      await page.getByTestId("language-select").click();
      await page.getByText("Español").click();
      await expect(page.getByRole("heading", { level: 3 })).toHaveText(
        "Tradurre · Carta de Cafés",
      );

      await page.evaluate((key) => sessionStorage.removeItem(key), STORAGE_KEY);
      await page.reload();
      await expect(page.getByRole("heading", { level: 3 })).toHaveText(
        "Tradurre · Coffee Menu",
      );
    });
  });
});
