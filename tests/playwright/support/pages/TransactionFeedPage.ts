import { Page, Locator } from '@playwright/test';

export class TransactionFeedPage {
    readonly page: Page;
    readonly everyoneTab: Locator;
    readonly friendsTab: Locator;
    readonly mineTab: Locator;
    readonly transactionList: Locator;
    readonly transactionItems: Locator;
    readonly dateFilterButton: Locator;
    readonly dateRangeDrawer: Locator;
    readonly dateClearButton: Locator;
    readonly amountFilterButton: Locator;
    readonly amountRangeDrawer: Locator;
    readonly amountClearButton: Locator;
    readonly amountRangeSlider: Locator;
    readonly emptyListHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.everyoneTab = page.getByTestId('nav-public-tab');
        this.friendsTab = page.getByTestId('nav-contacts-tab');
        this.mineTab = page.getByTestId('nav-personal-tab');
        this.transactionList = page.getByTestId('transaction-list');
        this.transactionItems = page.locator('[data-test^="transaction-item"]');
        this.dateFilterButton = page.getByTestId('transaction-list-filter-date-range-button');
        this.dateRangeDrawer = page.getByTestId('transaction-list-filter-date-range');
        this.dateClearButton = page.getByTestId('transaction-list-filter-date-clear-button');
        this.amountFilterButton = page.getByTestId('transaction-list-filter-amount-range-button');
        this.amountRangeDrawer = page.getByTestId('transaction-list-filter-amount-range');
        this.amountClearButton = page.getByTestId('transaction-list-filter-amount-clear-button');
        this.amountRangeSlider = page.getByTestId('transaction-list-filter-amount-range-slider');
        this.emptyListHeader = page.getByTestId('empty-list-header');
    }

    async goto() {
        await this.page.goto('/');
    }

    async selectDateRange() {
        // react-calendar day tiles have no data-test attrs; use stable library class
        const dayTiles = this.dateRangeDrawer.locator('button.react-calendar__month-view__days__day');
        await dayTiles.first().click();
        await dayTiles.last().click();
    }

    async interceptEmptyContactsTransactions() {
        await this.page.route('**/transactions/contacts*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ results: [], pageData: { total: 0, pages: 0 } }),
            });
        });
    }
}
