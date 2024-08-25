"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Browse = void 0;
const playwright_1 = require("playwright");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const home = 'https://creators.joinmavely.com/home';
const loginUrl = 'https://creators.joinmavely.com/auth/login';
class Browse {
    constructor() {
        this.password = process.env.PASSWORD;
        this.email = process.env.EMAIL;
    }
    main(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookiesFilePath = 'cookies.json';
            const browser = yield playwright_1.chromium.launch({
                headless: false,
            });
            const page = yield browser.newPage();
            try {
                const previousSession = fs_1.default.existsSync(cookiesFilePath);
                if (previousSession) {
                    const cookies = JSON.parse(fs_1.default.readFileSync(cookiesFilePath, 'utf-8'));
                    yield page.context().addCookies(cookies);
                }
                // Listen for page navigation
                page.on('framenavigated', (frame) => __awaiter(this, void 0, void 0, function* () {
                    if (frame.url() === loginUrl) {
                        console.log('Redirected to login page, attempting to log in...');
                        yield this.login(page);
                        yield page.goto(home, { waitUntil: 'networkidle' });
                    }
                }));
                yield page.goto(home, { waitUntil: 'networkidle' });
                const urlCompact = yield page.$('input[placeholder="Enter URL to create a link"]');
                if (urlCompact) {
                    yield urlCompact.fill(link);
                }
                else {
                    throw new Error('URL input field not found');
                }
                const submitBtn = yield page.$('button[type="submit"]');
                if (submitBtn) {
                    yield submitBtn.click();
                }
                else {
                    throw new Error('Submit button not found');
                }
                // Wait for the result and extract the final link
                yield page.waitForFunction(() => /https:\/\/mavely.app.link\/e\/[^]+/.test(document.body.innerText), { timeout: 100000 });
                const p = yield page.evaluate(() => {
                    const pElements = document.querySelectorAll('p');
                    return Array.from(pElements).map(e => e.innerText);
                });
                const finalLink = p.find(l => /https:\/\/mavely.app.link\/e\/[^]+/.test(l)) || '';
                console.log('Final link here:');
                console.log(finalLink);
                return finalLink;
            }
            catch (error) {
                console.log('error in headless browser ');
                console.error(error);
                const r = yield this.main(link);
                return r;
            }
            finally {
                yield browser.close();
            }
        });
    }
    login(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = yield page.$('#email');
                if (email) {
                    yield email.fill(this.email);
                }
                else {
                    throw new Error('Email input not found');
                }
                const password = yield page.$('#password');
                if (password) {
                    yield password.fill(this.password);
                }
                else {
                    throw new Error('Password input not found');
                }
                const signInButton = yield page.$('button[type="submit"]');
                if (signInButton) {
                    yield signInButton.click();
                    yield page.waitForNavigation({ waitUntil: 'networkidle' });
                }
                else {
                    throw new Error('Sign in button not found');
                }
                // Save cookies after login
                const cookies = yield page.context().cookies();
                fs_1.default.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.Browse = Browse;
const link = 'https://www.walmart.com/';
new Browse().main(link).then((result) => console.log(result));
