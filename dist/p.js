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
exports.P = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const home = 'https://creators.joinmavely.com/home';
class P {
    constructor() {
        this.password = process.env.PASSWORD;
        this.email = process.env.EMAIL;
    }
    p(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookiesFilePath = 'cookies.json';
            const browser = yield puppeteer_1.default.launch({ headless: true, args: ["--no-sandbox"] });
            const page = yield browser.newPage();
            try {
                const previousSession = fs_1.default.existsSync(cookiesFilePath);
                if (previousSession) {
                    const cookies = JSON.parse(fs_1.default.readFileSync(cookiesFilePath, 'utf-8'));
                    yield page.setCookie(...cookies);
                }
                else {
                    // console.log('fuck')
                    yield this.login(previousSession, page);
                }
                yield page.goto(home, { waitUntil: 'networkidle0' });
                const urlCompact = yield page.$('input[placeholder="Enter URL to create a link"]');
                if (urlCompact) {
                    yield urlCompact.type(link);
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
                    // console.log(pElements.length)
                    return Array.from(pElements).map(e => e.innerText);
                });
                // console.log(' p tags length is ====')
                // console.log(p.length)
                // console.log(p)
                const finalLink = p.find(l => /https:\/\/mavely.app.link\/e\/[^]+/.test(l)) || '';
                console.log('final link  here ');
                console.log(finalLink);
                return finalLink;
            }
            catch (error) {
                console.error(error);
            }
            finally {
                browser.close();
            }
        });
    }
    login(previousSession, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!previousSession) {
                    const email = yield page.$('#email');
                    if (email) {
                        yield email.type(this.email);
                    }
                    else {
                        throw new Error('Email input not found');
                    }
                    const password = yield page.$('#password');
                    if (password) {
                        yield password.type(this.password);
                    }
                    else {
                        throw new Error('Password input not found');
                    }
                    const signInButton = yield page.$('button[type="submit"]');
                    if (signInButton) {
                        yield signInButton.click();
                        yield page.waitForNavigation({ waitUntil: 'networkidle2' }); // Wait for navigation to ensure login is complete
                    }
                    else {
                        throw new Error('Sign in button not found');
                    }
                    // Save cookies after login
                    const cookies = yield page.cookies();
                    fs_1.default.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
                }
            }
            catch (error) {
            }
        });
    }
}
exports.P = P;
const link = 'https://www.walmart.com/';
const p = new P().p(link);
