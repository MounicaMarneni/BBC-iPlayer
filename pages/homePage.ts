import { expect, Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly navigationMenu: Locator;
    readonly sectionsWithCarousel: Locator;
    readonly carouselForwardArrows: Locator;
    readonly firstProgrammeItem: Locator;
    readonly activeProgrammeItems: Locator;
    readonly sections: Locator;
    readonly itemsInSection: Locator;
    readonly sectionHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navigationMenu = page.locator('ul[data-bbc-container="primary-nav"]');
        this.sectionsWithCarousel = page.locator('section.section div.carrousel--with-arrows');
        this.carouselForwardArrows = page.locator('button[data-bbc-content-label="forward"]');
        this.firstProgrammeItem = page.locator('li div.content-item-root__meta');
        this.activeProgrammeItems = page.locator('ul li:not(.carrousel__item--inactive)');
        this.itemsInSection = page.locator('ul li.carrousel__item');
        this.sectionHeading = page.locator('//ancestor::section');
    }

    async goto() {
        await this.page.goto('https://www.bbc.co.uk/iplayer');
        await this.page.waitForLoadState('networkidle');
    }

    async navigationMenuCount(): Promise<number> {
        expect(this.navigationMenu).toBeVisible();
        return this.navigationMenu.count();
    }

    async sectionsWithCarouselCount(): Promise<number> {
        return this.sectionsWithCarousel.count();
    }

    async programmeItemsInSections(): Promise<boolean> {
        const sections = await this.sectionsWithCarousel.all();
        let flag = true;
        for (const section of sections) {
            const progItems = await section.locator(this.itemsInSection).count();
            const sectionName = await section.locator(this.sectionHeading).getAttribute('aria-label');
            if (progItems < 4) {
                console.error(`Expected at least 4 programme items in section: ${sectionName}, but found ${progItems}`);
                flag = false;
            }
        }
        return flag;
    }

    async carouselShowsMoreItems(): Promise<boolean> {
        const sections = await this.sectionsWithCarousel.all();
        let items = true;
        for (const section of sections) {
            await section.locator(this.carouselForwardArrows).first().click();
            const activeProgs = await section.locator(this.activeProgrammeItems).count();
            const sectionName = await section.locator(this.sectionHeading).getAttribute('aria-label');
            if (activeProgs < 1) {
                console.error(`Expected at least 1 active programme item after clicking the carousel arrow, but found ${activeProgs} in section: ${sectionName}`);
                items = false;
            }
        }
        return items;
    }

    async getFirstProgrammeItem(): Promise<string | null> {
        await this.firstProgrammeItem.first().waitFor({ state: 'visible' });
        return this.firstProgrammeItem.first().textContent();
    }
}