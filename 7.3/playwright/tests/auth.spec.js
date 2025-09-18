const { test, expect } = require('@playwright/test');
const { email, password, invalidEmail, invalidPassword } = require('../user');

test.describe('Авторизация на Netology.ru', () => {
  test('Успешная авторизация с проверками', async ({ page }) => {
    await page.goto('/?modal=sign_in');
    
    // Кликаем и ждем появления формы
    await page.click('text=Войти по почте');
    await page.waitForSelector('input[type="email"][name="email"]');
    
    // Заполняем форму
    await page.fill('input[type="email"][name="email"]', email);
    await page.fill('input[type="password"][name="password"]', password);
    await page.click('button[type="submit"]');
    
    // Проверяем успешную авторизацию
    await expect(page).toHaveURL(/profile/);
    await expect(page.locator('body')).toContainText('Моё обучение');
  });

  test('Неуспешная авторизация с неверными данными', async ({ page }) => {
    await page.goto('/?modal=sign_in');
    
    await page.click('text=Войти по почте');
    await page.waitForSelector('input[type="email"][name="email"]');
    
    await page.fill('input[type="email"][name="email"]', invalidEmail);
    await page.fill('input[type="password"][name="password"]', invalidPassword);
    await page.click('button[type="submit"]');
    
    // Ждем и проверяем ошибку
    await page.waitForSelector('[data-testid="login-error-hint"]');
    const errorText = await page.textContent('[data-testid="login-error-hint"]');
    expect(errorText).toContain('неправильно логин или пароль');
  });
});