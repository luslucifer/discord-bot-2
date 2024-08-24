import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const home = 'https://creators.joinmavely.com/home';

export class P {
    private password: string | any;
    private email: string | any;

    constructor() {
        this.password = process.env.PASSWORD;
        this.email = process.env.EMAIL;
    }

    async p(link: string): Promise<string> {
        const cookiesFilePath = 'cookies.json';
        const browser: Browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox'],
        });
        const page: Page = await browser.newPage();

        try {
            const previousSession = fs.existsSync(cookiesFilePath);
            if (previousSession) {
                const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf-8'));
                await page.context().addCookies(cookies);
            } else {
                await this.login(page);
            }
            await page.goto(home, { waitUntil: 'networkidle' });

            const urlCompact = await page.$('input[placeholder="Enter URL to create a link"]');
            if (urlCompact) {
                await urlCompact.fill(link);
            } else {
                throw new Error('URL input field not found');
            }

            const submitBtn = await page.$('button[type="submit"]');
            if (submitBtn) {
                await submitBtn.click();
            } else {
                throw new Error('Submit button not found');
            }

            // Wait for the result and extract the final link
            await page.waitForFunction(() => /https:\/\/mavely.app.link\/e\/[^]+/.test(document.body.innerText), { timeout: 100000 });
            const p = await page.evaluate(() => {
                const pElements = document.querySelectorAll('p');
                return Array.from(pElements).map(e => e.innerText);
            });

            const finalLink = p.find(l => /https:\/\/mavely.app.link\/e\/[^]+/.test(l)) || '';
            console.log('Final link here:');
            console.log(finalLink);

            return finalLink;

        } catch (error) {
            console.error(error);
            return '';
        } finally {
            await browser.close();
        }
    }

    async login(page: Page) {
        try {
            const email = await page.$('#email');
            if (email) {
                await email.fill(this.email);
            } else {
                throw new Error('Email input not found');
            }

            const password = await page.$('#password');
            if (password) {
                await password.fill(this.password);
            } else {
                throw new Error('Password input not found');
            }

            const signInButton = await page.$('button[type="submit"]');
            if (signInButton) {
                await signInButton.click();
                await page.waitForNavigation({ waitUntil: 'networkidle' });
            } else {
                throw new Error('Sign in button not found');
            }

            // Save cookies after login
            const cookies = await page.context().cookies();
            fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

        } catch (error) {
            console.error(error);
        }
    }
}

const link = 'https://www.walmart.com/';
new P().p(link).then((result) => console.log(result));
