const { test, expect } = require('@playwright/test');
const { email, password, invalidEmail, invalidPassword } = require('../user');

test.describe('Авторизация на Netology.ru', () => {
  test('Успешная авторизация со скриншотами', async ({ page }) => {
    // Шаг 1: Открываем страницу авторизации
    await page.goto('/?modal=sign_in');
    await page.screenshot({ path: 'screenshots/01-auth-page.png' });
    console.log('Скриншот: Страница авторизации');
    
    // Шаг 2: Кликаем "Войти по почте"
    await page.click('text=Войти по почте');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/02-email-clicked.png' });
    console.log('Скриншот: Кнопка "Войти по почте" нажата');
    
    // Шаг 3: Заполняем email
    await page.fill('input[name="email"]', email);
    await page.screenshot({ path: 'screenshots/03-email-filled.png' });
    console.log('Скриншот: Email заполнен');
    
    // Шаг 4: Заполняем пароль
    await page.fill('input[name="password"]', password);
    await page.screenshot({ path: 'screenshots/04-password-filled.png' });
    console.log('Скриншот: Пароль заполнен');
    
    // Шаг 5: Нажимаем кнопку входа
    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'screenshots/05-submit-clicked.png' });
    console.log('Скриншот: Кнопка "Войти" нажата');
    
    // Шаг 6: Ждем перехода на профиль
    await page.waitForURL(/profile/, { timeout: 30000 });
    await page.screenshot({ path: 'screenshots/06-profile-page.png', fullPage: true });
    console.log('Скриншот: Страница профиля');
    
    // Проверяем успешную авторизацию
    expect(page.url()).toContain('profile');
    expect(page.url()).not.toContain('modal=sign_in');
    console.log('✅ Авторизация прошла успешно');
  });

  test('Неуспешная авторизация со скриншотами', async ({ page }) => {
    // Шаг 1: Открываем страницу авторизации
    await page.goto('/?modal=sign_in');
    await page.screenshot({ path: 'screenshots/07-auth-page-fail.png' });
    console.log('Скриншот: Страница авторизации (неуспешный тест)');
    
    // Шаг 2: Кликаем "Войти по почте"
    await page.click('text=Войти по почте');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/08-email-clicked-fail.png' });
    console.log('Скриншот: Кнопка "Войти по почте" нажата');
    
    // Шаг 3: Заполняем неверный email
    await page.fill('input[name="email"]', invalidEmail);
    await page.screenshot({ path: 'screenshots/09-invalid-email-filled.png' });
    console.log('Скриншот: Неверный email заполнен');
    
    // Шаг 4: Заполняем неверный пароль
    await page.fill('input[name="password"]', invalidPassword);
    await page.screenshot({ path: 'screenshots/10-invalid-password-filled.png' });
    console.log('Скриншот: Неверный пароль заполнен');
    
    // Шаг 5: Нажимаем кнопку входа
    await page.click('button[type="submit"]');
    await page.screenshot({ path: 'screenshots/11-submit-clicked-fail.png' });
    console.log('Скриншот: Кнопка "Войти" нажата');
    
    // Шаг 6: Ждем и делаем финальный скриншот
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/12-final-result-fail.png', fullPage: true });
    console.log('Скриншот: Финальный результат (ошибка)');
    
    // Проверяем что остались на странице авторизации
    expect(page.url()).toContain('modal=sign_in');
    console.log('✅ Тест на ошибку прошел успешно');
  });
});