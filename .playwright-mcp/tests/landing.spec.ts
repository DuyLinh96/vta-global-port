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
    "Nền tảng tạo nên VTA Global Port",
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
    const imageName = await image.getAttribute("alt");
    await image.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await expect.poll(
      () => image.evaluate(
        (element) =>
          element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0,
      ),
      {
        message: `Image "${imageName}" should finish loading without being broken`,
        timeout: 15_000,
      },
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

test("matches the approved Vietnamese PDF content in every landing section", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Vững bước thành công", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Liên hệ với chúng tôi", exact: true })).toBeVisible();

  const removedHeroCopy = [
    "Kết nối cảng biển · Tối ưu chuỗi cung ứng",
    "VTA Global Port mang đến giải pháp vận chuyển và khai thác hiệu quả, tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận. Chúng tôi nâng cao năng lực vận hành, ứng dụng công nghệ, phát triển hạ tầng và trở thành đối tác tin cậy của khách hàng trong và ngoài nước.",
    "Dòng chảy hàng hóa",
    "Cảng → Điểm giao nhận",
    "Vận hành đồng bộ",
  ];
  for (const copy of removedHeroCopy) {
    await expect(page.getByText(copy, { exact: true })).toHaveCount(0);
  }

  const company = page.locator("#company");
  await expect(company.getByRole("heading", {
    name: "Nền tảng tạo nên VTA Global Port",
    level: 2,
  })).toBeVisible();
  await expect(company.getByText(
    "Được xây dựng từ tiêu chuẩn vận hành và đội ngũ giàu kinh nghiệm",
    { exact: true },
  )).toBeVisible();
  await expect(company.getByText(
    "Với hệ thống dịch vụ đồng bộ cùng đội ngũ chuyên nghiệp, VTA Global Port mang đến các giải pháp vận chuyển và khai thác hiệu quả, giúp tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận. Chúng tôi không ngừng nâng cao năng lực vận hành, ứng dụng công nghệ và phát triển hạ tầng nhằm đáp ứng yêu cầu ngày càng cao của chuỗi cung ứng hiện đại, trở thành đối tác tin cậy của khách hàng trong và ngoài nước.",
    { exact: true },
  )).toBeVisible();
  const companyValues = [
    "Chính trực",
    "An toàn",
    "Hiệu quả vận hành",
    "Đổi mới",
    "Phát triển bền vững",
  ];
  await expect(company.getByRole("listitem")).toHaveCount(companyValues.length);
  for (const value of companyValues) {
    await expect(company.getByRole("listitem").getByText(value, { exact: true })).toBeVisible();
  }

  const services = page.locator("#services");
  const serviceCards = services.getByRole("listitem");
  const expectedServices = [
    {
      title: "Vận tải đường biển",
      description:
        "VTA Global Port cung cấp dịch vụ vận tải đường biển với giải pháp linh hoạt, an toàn và hiệu quả, đáp ứng nhu cầu vận chuyển hàng hóa trong nước và quốc tế.",
    },
    {
      title: "Khai thác cảng",
      description:
        "VTA Global Port cung cấp dịch vụ khai thác cảng với quy trình vận hành chuyên nghiệp, đáp ứng nhu cầu tiếp nhận tàu, xếp dỡ hàng hóa và điều phối hoạt động cảng một cách an toàn, hiệu quả.",
    },
    {
      title: "Khai thác kho bãi",
      description:
        "VTA Global Port cung cấp dịch vụ quản lý kho bãi với hệ thống lưu trữ được vận hành khoa học, an toàn và hiệu quả.",
    },
  ];
  await expect(serviceCards).toHaveCount(expectedServices.length);
  for (const [index, service] of expectedServices.entries()) {
    await expect(serviceCards.nth(index).getByText(service.title, { exact: true })).toBeVisible();
    await expect(serviceCards.nth(index).getByText(service.description, { exact: true })).toBeVisible();
  }
  await expect(services.getByText("Dịch vụ logistics", { exact: true })).toHaveCount(0);

  const fleet = page.locator("#fleet");
  await expect(fleet.getByText(
    "Sở hữu đội tàu biển và tàu sông được đầu tư đồng bộ, VTA Global Port cung cấp năng lực vận tải linh hoạt, đáp ứng đa dạng nhu cầu vận chuyển hàng hóa. Hệ thống gồm 4 tàu biển trọng tải lớn cùng nhiều phương tiện vận tải đường thủy nội địa, giúp kết nối hiệu quả giữa cảng biển, cảng sông và các khu vực sản xuất, góp phần tối ưu chuỗi cung ứng và nâng cao hiệu quả logistics.",
    { exact: true },
  )).toBeVisible();
  await expect(fleet.getByRole("link", { name: "Liên hệ", exact: true })).toBeVisible();
  await expect(fleet.getByText("04", { exact: true })).toBeVisible();
  await expect(fleet.getByText("tàu biển trọng tải lớn", { exact: true })).toBeVisible();
  await expect(fleet.getByRole("heading", { name: "Tàu biển", level: 3 })).toBeVisible();
  await expect(fleet.getByRole("heading", { name: "Tàu sông", level: 3 })).toBeVisible();
  const removedFleetDescriptions = [
    "Năng lực vận chuyển tải trọng lớn, phục vụ luồng hàng trong nước và kết nối quốc tế.",
    "Phương tiện đường thủy nội địa linh hoạt, kết nối cảng biển với cảng sông và khu sản xuất.",
  ];
  for (const description of removedFleetDescriptions) {
    await expect(fleet.getByText(description, { exact: true })).toHaveCount(0);
  }

  const news = page.locator("#news");
  const newsArticles = news.getByRole("article");
  const newsGroups = ["Hoạt động", "Sự kiện", "Truyền thông", "Tuyển dụng"];
  await expect(newsArticles).toHaveCount(newsGroups.length);
  for (const [index, group] of newsGroups.entries()) {
    await expect(newsArticles.nth(index).getByRole("heading", { name: group, level: 3 })).toBeVisible();
    await expect(newsArticles.nth(index).getByText(
      "Nội dung đang được cập nhật",
      { exact: true },
    )).toBeVisible();
  }
  const removedNewsTitles = [
    "Góc nhìn từ hoạt động khai thác cảng và logistics",
    "Kết nối chuyên môn trong chuỗi cung ứng",
    "Tài liệu và câu chuyện về vận tải hiện đại",
  ];
  for (const title of removedNewsTitles) {
    await expect(news.getByText(title, { exact: true })).toHaveCount(0);
  }

  const smart = page.locator("#smart");
  await expect(smart.getByText(
    "Ứng dụng công nghệ và quy trình quản lý hiện đại để tối ưu hoạt động khai thác cảng, điều phối phương tiện và quản lý hàng hóa, giúp nâng cao hiệu quả vận hành và hỗ trợ khách hàng trong suốt quá trình logistics.",
    { exact: true },
  )).toBeVisible();
  const smartTools = ["My VTA Port", "Tra cứu lịch tàu", "Theo dõi hàng hóa", "Biểu cước vận tải"];
  await expect(smart.getByRole("button")).toHaveCount(smartTools.length);
  for (const tool of smartTools) {
    await expect(smart.getByRole("button", { name: tool, exact: true })).toBeVisible();
  }
  const removedSmartDescriptions = [
    "Không gian quản lý tập trung cho khách hàng và đối tác.",
    "Tiếp cận lịch trình dự kiến trong một luồng tra cứu rõ ràng.",
    "Theo dõi tiến trình lô hàng khi hệ thống dữ liệu được kết nối.",
    "Tham khảo biểu cước theo nhu cầu và tuyến vận chuyển.",
  ];
  for (const description of removedSmartDescriptions) {
    await expect(smart.getByText(description, { exact: true })).toHaveCount(0);
  }

  const contact = page.locator("#contact");
  await expect(contact.getByText(
    "Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ mọi yêu cầu về dịch vụ cảng, vận tải và logistics. Gửi thông tin của Quý khách ngay hôm nay để nhận tư vấn, báo giá hoặc giải pháp phù hợp cho hoạt động kinh doanh.",
    { exact: true },
  )).toBeVisible();
  await expect(contact.getByRole("heading", { name: "Thông tin liên hệ", level: 3 })).toBeVisible();
  const contactDetails = [
    "Tỉnh Hải Dương, Việt Nam",
    "+84 123 456 789",
    "Fax: +84 123 456 780",
    "info@vtagroup.vn",
  ];
  for (const detail of contactDetails) {
    await expect(contact.getByText(detail, { exact: true })).toBeVisible();
  }
  const contactFields = [
    { role: "textbox" as const, name: "Họ và tên" },
    { role: "textbox" as const, name: "Tên doanh nghiệp" },
    { role: "textbox" as const, name: "Chức vụ" },
    { role: "textbox" as const, name: "Email" },
    { role: "textbox" as const, name: "Số điện thoại" },
    { role: "textbox" as const, name: "Nội dung yêu cầu" },
    { role: "combobox" as const, name: "Lĩnh vực quan tâm" },
  ];
  for (const field of contactFields) {
    await expect(contact.getByRole(field.role, { name: field.name, exact: true })).toBeVisible();
  }
  const interestOptions = [
    "Chọn lĩnh vực",
    "Khai thác cảng",
    "Vận tải đường thủy",
    "Logistics",
    "Kho bãi",
    "Xếp dỡ hàng hóa",
    "Hợp tác kinh doanh",
    "Khác",
  ];
  await expect(contact.getByRole("option")).toHaveCount(interestOptions.length);
  for (const option of interestOptions) {
    await expect(contact.getByRole("option", { name: option, exact: true })).toHaveCount(1);
  }
  await expect(contact.getByText("Thông tin đang được xác nhận", { exact: true })).toHaveCount(0);

  await expect(page.getByRole("contentinfo").getByText(
    "Vững bước thành công",
    { exact: true },
  )).toBeVisible();
});

test("switches all primary content from Vietnamese to English and back", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: "English", exact: true }).click();

  await expect.poll(() => page.evaluate(() => document.documentElement.lang)).toBe("en");
  await expect(page.getByRole("heading", { name: "Steady steps to success", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact us" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Track a shipment" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Send an enquiry" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Full name", exact: true })).toBeVisible();

  const englishCompany = page.locator("#company");
  await expect(englishCompany.getByRole("heading", {
    name: "The foundation behind VTA Global Port",
    level: 2,
  })).toBeVisible();
  await expect(englishCompany.getByText(
    "Built on operational standards and an experienced team",
    { exact: true },
  )).toBeVisible();
  await expect(englishCompany.getByText(
    "With an integrated service system and a professional team, VTA Global Port provides efficient transport and operations solutions, helping optimise cargo flows from ports to delivery points. We continuously enhance our operational capacity, apply technology and develop infrastructure to meet the increasing demands of modern supply chains, becoming a trusted partner to customers in Vietnam and abroad.",
    { exact: true },
  )).toBeVisible();
  await expect(englishCompany.getByRole("listitem")).toHaveCount(5);
  await expect(englishCompany.getByText("Integrity", { exact: true })).toBeVisible();

  const englishServices = page.locator("#services");
  await expect(englishServices.getByRole("listitem")).toHaveCount(3);
  await expect(englishServices.getByText(
    "VTA Global Port provides sea freight services with flexible, safe and efficient solutions that meet domestic and international cargo transportation needs.",
    { exact: true },
  )).toBeVisible();
  await expect(englishServices.getByText("Logistics services", { exact: true })).toHaveCount(0);

  const englishFleet = page.locator("#fleet");
  await expect(englishFleet.getByText(
    "With a consistently invested fleet of sea-going and river vessels, VTA Global Port provides flexible transport capacity to meet diverse cargo transportation needs. The system includes four high-capacity sea-going vessels and numerous inland waterway craft, effectively connecting seaports, river ports and production areas, helping optimise supply chains and improve logistics efficiency.",
    { exact: true },
  )).toBeVisible();
  await expect(englishFleet.getByRole("link", { name: "Contact", exact: true })).toBeVisible();

  const englishNews = page.locator("#news");
  await expect(englishNews.getByRole("article")).toHaveCount(4);
  for (const group of ["Operations", "Events", "Media", "Careers"]) {
    await expect(englishNews.getByRole("heading", { name: group, level: 3 })).toBeVisible();
  }
  await expect(englishNews.getByText("Content is being updated", { exact: true })).toHaveCount(4);

  const englishSmart = page.locator("#smart");
  await expect(englishSmart.getByText(
    "We apply technology and modern management processes to optimise port operations, vehicle coordination and cargo management, improving operating efficiency and supporting customers throughout their logistics journey.",
    { exact: true },
  )).toBeVisible();
  for (const tool of ["My VTA Port", "Vessel schedule", "Cargo tracking", "Freight tariffs"]) {
    await expect(englishSmart.getByRole("button", { name: tool, exact: true })).toBeVisible();
  }

  const englishContact = page.locator("#contact");
  await expect(englishContact.getByText(
    "Our specialists are ready to support port, transport and logistics requirements. Send us your information today to request advice, a quotation or a solution tailored to your business operations.",
    { exact: true },
  )).toBeVisible();
  await expect(englishContact.getByRole("textbox", {
    name: "Business email",
    exact: true,
  })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByText(
    "Steady steps to success",
    { exact: true },
  )).toBeVisible();

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
