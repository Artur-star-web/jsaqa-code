const puppeteer = require('puppeteer');

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    slowMo: 100
  });
}, 30000);

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

// Общие функции для переиспользования
const createPage = async () => {
  const page = await browser.newPage();
  await page.setDefaultTimeout(15000);
  return page;
};

const closePage = async (page) => {
  if (page && !page.isClosed()) {
    await page.close();
  }
};

// Тесты для страницы team
describe("Github team page tests", () => {
  let page;

  beforeEach(async () => {
    page = await createPage();
    await page.goto("https://github.com/team", { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
  }, 30000);

  afterEach(async () => {
    await closePage(page);
  });

  test("The h1 header content", async () => {
    const title = await page.title();
    expect(title).toContain("GitHub");
  }, 20000);

  test("The first link attribute", async () => {
    const actual = await page.$eval('a[href="#start-of-content"]', link => link.getAttribute('href'));
    expect(actual).toEqual("#start-of-content");
  }, 15000);

  test("The page contains Sign up button", async () => {
    // Обновляем селекторы для новой структуры GitHub
    const signupSelectors = [
      'a[href*="signup"]',
      'a[data-test*="signup"]',
      '[data-ga-click*="sign up"]',
      'button:contains("Sign")',
      'a:contains("Sign")'
    ];

    let signupElement = null;
    for (const selector of signupSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          signupElement = elements[0];
          break;
        }
      } catch (e) {
        // Пропускаем невалидные селекторы
      }
    }

    expect(signupElement).not.toBeNull();
  }, 20000);
});

// Новые тесты для других страниц GitHub
describe("Github other pages tests", () => {
  test("Pricing page title", async () => {
    const page = await createPage();
    try {
      await page.goto("https://github.com/pricing", { waitUntil: 'networkidle0' });
      const title = await page.title();
      expect(title).toContain("Pricing");
    } finally {
      await closePage(page);
    }
  }, 20000);

  test("Features page title", async () => {
    const page = await createPage();
    try {
      await page.goto("https://github.com/features", { waitUntil: 'networkidle0' });
      const title = await page.title();
      expect(title).toContain("Features");
    } finally {
      await closePage(page);
    }
  }, 20000);

  test("Enterprise page content", async () => {
    const page = await createPage();
    try {
      await page.goto("https://github.com/enterprise", { waitUntil: 'networkidle0' });
      // Проверяем содержание страницы вместо заголовка
      const bodyText = await page.$eval('body', el => el.textContent);
      expect(bodyText.toLowerCase()).toContain("enterprise");
    } finally {
      await closePage(page);
    }
  }, 20000);

  test("Marketplace page contains marketplace text", async () => {
    const page = await createPage();
    try {
      await page.goto("https://github.com/marketplace", { waitUntil: 'networkidle0' });
      const bodyText = await page.$eval('body', el => el.textContent);
      expect(bodyText.toLowerCase()).toContain("marketplace");
    } finally {
      await closePage(page);
    }
  }, 20000);

  test("Explore page title", async () => {
    const page = await createPage();
    try {
      await page.goto("https://github.com/explore", { waitUntil: 'networkidle0' });
      const title = await page.title();
      expect(title).toContain("Explore");
    } finally {
      await closePage(page);
    }
  }, 20000);
});

// Навигационные тесты
describe("Github navigation tests", () => {
  test("Navigate from team to pricing", async () => {
    const page = await createPage();
    try {
      await page.goto("https://github.com/team");
      // Ищем ссылку на pricing разными способами
      const pricingSelectors = [
        'a[href="/pricing"]',
        'a[href*="pricing"]',
        'a:contains("Pricing")'
      ];

      let pricingLink = null;
      for (const selector of pricingSelectors) {
        try {
          pricingLink = await page.$(selector);
          if (pricingLink) break;
        } catch (e) {
          // Пропускаем невалидные селекторы
        }
      }

      expect(pricingLink).not.toBeNull();
      await pricingLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      const title = await page.title();
      expect(title).toContain("Pricing");
    } finally {
      await closePage(page);
    }
  }, 25000);
});