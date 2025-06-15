import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { PlaybackPage } from '../pages/playbackPage';

test.describe('BBC iPlayer Homepage Tests', () => {
    let homePage: HomePage;
    let playbackPage: PlaybackPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
        await expect(page).toHaveURL(/.*iplayer/);
    });

    test('The homepage has a title of "BBC iPlayer – Home"', { tag: '@regression' }, async ({ page }) => {
        const title = await page.title();
        expect(title, `Expected homepage title to be "BBC iPlayer - Home", but got "${title}"`).toBe('BBC iPlayer - Home');
    });

    test('The page has one iPlayer navigation menu', { tag: '@regression' }, async () => {
        const navMenuCount = await homePage.navigationMenuCount();
        expect(navMenuCount, `Expected exactly 1 navigation menu, but found ${navMenuCount}`).toBe(1);
    });

    test('The page has at least 4 sections that each contain 1 carousel', { tag: '@regression' }, async () => {
        const sectionsCount = await homePage.sectionsWithCarouselCount();
        expect(sectionsCount, `Expected at least 4 sections with carousels, but found ${sectionsCount}`).toBeGreaterThanOrEqual(4);
    });

    test('The page shows at least 4 programme items in each carousel', { tag: '@regression' }, async () => {
        const hasEnoughItems = await homePage.programmeItemsInSections();
        expect(hasEnoughItems, `Expected each carousel to have at least 4 programme items, but found ${hasEnoughItems}`).toBe(true);
    });


    test('More items in the carousel are shown when clicking a carousel arrow', { tag: '@regression' }, async () => {
        const newItemsCount = await homePage.carouselShowsMoreItems();
        expect(newItemsCount, `Expected carousel to show more items when clicking the arrow, but found ${newItemsCount} new items`).toBe(true);
    });

    test('The relevant Playback page is displayed when an episode is clicked', { tag: '@regression' }, async ({ page }) => {
        playbackPage = new PlaybackPage(page);

        // Validate programme item navigation
        const itemTitle = await homePage.getFirstProgrammeItem();
        await homePage.firstProgrammeItem.first().click();
        await page.waitForLoadState('networkidle');
        const playbackTitle = await playbackPage.playTitle.textContent();
        expect(playbackTitle, `Expected playback title to match "${itemTitle}", but got "${playbackTitle}"`).toBe(itemTitle);
        await expect(page).toHaveURL(/.*\/iplayer\/episodes\/.*/);

        // Validate episode navigation
        const firstEpiTitle = await playbackPage.getFirstEpisode();
        await playbackPage.firstEpisodeTitle.first().click();
        await page.waitForLoadState('networkidle');
        const episodeTitle = await playbackPage.episode.textContent();
        expect(episodeTitle, `Expected episode title to contain "${firstEpiTitle}", but got "${episodeTitle}"`).toContain(firstEpiTitle);
        await expect(page).toHaveURL(/.*\/iplayer\/episode\/.*/);
    });

});
