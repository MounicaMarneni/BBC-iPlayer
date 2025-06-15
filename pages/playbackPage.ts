import { Page, Locator } from '@playwright/test';

export class PlaybackPage {
    readonly page: Page;
    readonly playTitle: Locator;
    readonly firstEpisodeTitle: Locator;
    readonly episode: Locator;

    constructor(page: Page) {
        this.page = page;
        this.playTitle = page.locator('h1.hero-header__title');
        this.firstEpisodeTitle = page.locator('div.content-item-root__meta--with-label');
        this.episode = page.locator('h1.tvip-hide');
    }

    async getFirstEpisode(): Promise<string | null> {
        await this.firstEpisodeTitle.first().waitFor({ state: 'visible' });
        return await this.firstEpisodeTitle.first().textContent();
    }
}