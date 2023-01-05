import puppeteer, { Browser as WebBrowser, Page } from 'puppeteer';
import Log from "./Log";

const log = new Log("../logs/browser.log");

export default class Browser extends WebBrowser {
    private browser: WebBrowser | undefined;
    private readonly browserType: string;

    constructor(browserType: 'chromium' | 'firefox' | 'edge') {
        super();
        this.browserType = browserType;
    }

    public async launch(): Promise<WebBrowser> {
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                '--kiosk',
                '--disable-infobars',
                '--disable-session-crashed-bubble',
                '--disable-extensions',
                '--disable-component-update',
                '--disable-background-networking',
                ]
        });
        await log.write(`Launched browser: ${this.browserType}`);
        return this.browser;
    }

    public async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }

    private async newWebPage(): Promise<Page> {
        if (this.browser) {
            return await this.browser.newPage();
        }
        throw new Error('Browser not launched');
    }

    public async pages(): Promise<Page[]> {
        if (this.browser) {
            return await this.browser.pages();
        }
        throw new Error('Browser not launched');
    }

    public async openWebPage(url: string): Promise<Page> {
        const page = await this.newWebPage();
        await page.goto(url);
        await this.reloadWebPage(page);
        await log.write(`Opened page: ${url}`);
        return page;
    }

    private async reloadWebPage(page: Page): Promise<void> {
        setInterval(async () => {
            await page.reload();
            await log.write(`Reloaded page: ${page.url()}`);
        }, 1000 * 60 * 60);
    }
}