import { expect, test, type Page } from "@playwright/test";

interface RuntimeErrors {
  console: string[];
  page: string[];
}

const runtimeErrors = new WeakMap<Page, RuntimeErrors>();

async function expectSectionNearTop(page: Page, id: string) {
  await expect.poll(() =>
    page.evaluate((sectionId) => {
      const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const sectionTop = document.getElementById(sectionId)?.getBoundingClientRect().top;
      return sectionTop !== undefined && sectionTop >= headerBottom && sectionTop < window.innerHeight / 3;
    }, id),
  ).toBe(true);
}

test.beforeEach(async ({ page }) => {
  const errors: RuntimeErrors = { console: [], page: [] };
  runtimeErrors.set(page, errors);

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.console.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.page.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Vững bước thành công", level: 1 })).toBeVisible();
});

test.afterEach(async ({ page }) => {
  const errors = runtimeErrors.get(page);
  expect(errors?.console ?? [], "The page emitted console errors").toEqual([]);
  expect(errors?.page ?? [], "The page emitted uncaught runtime errors").toEqual([]);
});

test("renders the complete landing page without broken images or overflow", async ({ page }, testInfo) => {
  await expect(page.getByRole("link", { name: "Liên hệ với chúng tôi" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Theo dõi lô hàng" })).toBeVisible();

  const sections = ["company", "services", "fleet", "news", "smart", "contact"];
  for (const section of sections) {
    await expect(page.locator(`#${section}`), `Section #${section} should exist`).toBeVisible();
  }

  const headings = [
    "Một đầu mối. Một dòng vận hành xuyên suốt.",
    "Dịch vụ của chúng tôi",
    "Đội tàu của chúng tôi",
    "Tin tức về chúng tôi",
    "Hệ thống quản lý thông minh của chúng tôi",
    "Liên hệ với chúng tôi",
  ];
  for (const heading of headings) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  const images = page.getByRole("img");
  await expect(images).toHaveCount(5);
  for (const image of await images.all()) {
    await image.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await expect.poll(() =>
      image.evaluate(
        (element) =>
          element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0,
      ),
    ).toBe(true);
  }

  await expect.poll(() =>
    page.evaluate(() => ({
      body: document.body.scrollWidth <= document.body.clientWidth,
      document: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    })),
  ).toEqual({ body: true, document: true });

  await page.getByRole("link", { name: "VTA Global Port - Trang chủ" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-landing-full-page.png`),
    fullPage: true,
  });
});

test("switches all primary content from Vietnamese to English and back", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: "English", exact: true }).click();

  await expect.poll(() => page.evaluate(() => document.documentElement.lang)).toBe("en");
  await expect(page.getByRole("heading", { name: "Steady steps to success", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact us" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Track a shipment" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Send an enquiry" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Full name", exact: true })).toBeVisible();

  const isMobile = testInfo.project.name === "mobile-390";
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  const englishNavigation = page.getByRole("navigation", {
    name: isMobile ? "Mobile navigation" : "Primary navigation",
  });
  await expect(englishNavigation.getByRole("link", {
    name: isMobile ? /^Company/ : "Company",
    exact: !isMobile,
  })).toBeVisible();
  await expect(englishNavigation.getByRole("link", { name: "Contact", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Tiếng Việt", exact: true }).click();

  await expect.poll(() => page.evaluate(() => document.documentElement.lang)).toBe("vi");
  await expect(page.getByRole("heading", { name: "Vững bước thành công", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gửi yêu cầu" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Họ và tên", exact: true })).toBeVisible();
  const vietnameseNavigation = page.getByRole("navigation", {
    name: isMobile ? "Điều hướng trên thiết bị di động" : "Điều hướng chính",
  });
  await expect(vietnameseNavigation.getByRole("link", {
    name: isMobile ? /^Về công ty/ : "Về công ty",
    exact: !isMobile,
  })).toBeVisible();
  await expect(vietnameseNavigation.getByRole("link", { name: "Liên hệ", exact: true })).toBeVisible();
});

test("desktop navigation anchors work and internal links do not lead to missing pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Desktop-only navigation coverage");

  const navigation = page.getByRole("navigation", { name: "Điều hướng chính" });
  const anchors = [
    { label: "Về công ty", id: "company" },
    { label: "Dịch vụ", id: "services" },
    { label: "Đội tàu", id: "fleet" },
    { label: "Tin tức", id: "news" },
    { label: "Quản lý thông minh", id: "smart" },
    { label: "Liên hệ", id: "contact" },
  ];

  for (const anchor of anchors) {
    await navigation.getByRole("link", { name: anchor.label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${anchor.id}$`));
    await expectSectionNearTop(page, anchor.id);
  }

  const hrefs = await page.getByRole("link").evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).href),
  );
  const internalUrls = [...new Set(hrefs)]
    .map((href) => new URL(href))
    .filter((url) => url.origin === "http://127.0.0.1:3000");

  for (const url of internalUrls) {
    if (url.hash) {
      await expect(page.locator(url.hash), `Target ${url.hash} should exist`).toHaveCount(1);
      continue;
    }

    const response = await page.request.get(url.href);
    expect(response.status(), `${url.href} should not return 404`).not.toBe(404);
  }
});

test("mobile menu exposes state, navigates to contact, and closes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "Mobile-only menu coverage");

  const openMenu = page.getByRole("button", { name: "Mở menu" });
  await expect(openMenu).toHaveAttribute("aria-expanded", "false");
  await openMenu.click();

  const closeMenu = page.getByRole("button", { name: "Đóng menu" });
  await expect(closeMenu).toHaveAttribute("aria-expanded", "true");
  const mobileNavigation = page.getByRole("navigation", {
    name: "Điều hướng trên thiết bị di động",
  });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Liên hệ", exact: true }).click();

  await expect(page).toHaveURL(/#contact$/);
  await expect(mobileNavigation).toBeHidden();
  await expect(page.getByRole("button", { name: "Mở menu" })).toHaveAttribute("aria-expanded", "false");
  await expectSectionNearTop(page, "contact");
});

test("tracking and quick-access tools provide transparent demo feedback", async ({ page }) => {
  const trackingInput = page.getByPlaceholder("Nhập mã tham chiếu");
  await page.getByRole("button", { name: "Theo dõi", exact: true }).click();
  await expect(page.getByText("Vui lòng nhập mã lô hàng hoặc vận đơn.", { exact: true })).toBeVisible();

  await trackingInput.fill("VTA-DEMO-001");
  await page.getByRole("button", { name: "Theo dõi", exact: true }).click();
  const demoFeedback = "Tính năng theo dõi đang được kết nối. Không có dữ liệu vận chuyển thực được hiển thị.";
  await expect(page.getByText(demoFeedback, { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /^Yêu cầu báo giá/ }).click();
  await expect(page.getByText("Đã chuyển đến biểu mẫu yêu cầu tư vấn và báo giá.", { exact: true })).toBeVisible();
  await expectSectionNearTop(page, "contact");

  await page.getByRole("button", { name: /^Lịch tàu/ }).click();
  await expect(page.getByText(`Lịch tàu: ${demoFeedback}`, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Tra cứu cảng/ }).click();
  await expect(page.getByText(`Tra cứu cảng: ${demoFeedback}`, { exact: true })).toBeVisible();
});

test("smart management tools identify their connecting state", async ({ page }) => {
  await page.getByRole("button", { name: /^My VTA Port/ }).click();
  await expect(page.getByText("My VTA Port đang được kết nối.", { exact: true })).toBeVisible();
});

test("contact form validates required fields, reports demo submission, and resets", async ({ page }) => {
  const fullName = page.getByRole("textbox", { name: "Họ và tên", exact: true });
  const email = page.getByRole("textbox", { name: "Email", exact: true });
  const phone = page.getByRole("textbox", { name: "Số điện thoại", exact: true });

  await page.getByRole("button", { name: "Gửi thông tin" }).click();
  await expect(fullName).toBeFocused();
  expect(await fullName.evaluate((element) => (element as HTMLInputElement).validationMessage)).not.toBe("");

  await fullName.fill("Nguyen Van An");
  await page.getByRole("textbox", { name: "Tên doanh nghiệp", exact: true }).fill("VTA Test Customer");
  await page.getByRole("textbox", { name: "Chức vụ", exact: true }).fill("QA Manager");
  await email.fill("qa@example.com");
  await phone.fill("0912345678");
  await page.getByRole("combobox", { name: "Lĩnh vực quan tâm", exact: true }).selectOption({ label: "Logistics" });
  await page.getByRole("textbox", { name: "Nội dung yêu cầu", exact: true }).fill("Yeu cau tu van van tai demo.");
  await page.getByRole("button", { name: "Gửi thông tin" }).click();

  await expect(page.getByText(
    "Đã ghi nhận biểu mẫu demo. Kênh tiếp nhận đang được kết nối nên thông tin chưa được gửi đến máy chủ.",
    { exact: true },
  )).toBeVisible();
  await expect(fullName).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "Tên doanh nghiệp", exact: true })).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "Chức vụ", exact: true })).toHaveValue("");
  await expect(email).toHaveValue("");
  await expect(phone).toHaveValue("");
  await expect(page.getByRole("combobox", { name: "Lĩnh vực quan tâm", exact: true })).toHaveValue("");
  await expect(page.getByRole("textbox", { name: "Nội dung yêu cầu", exact: true })).toHaveValue("");
});
