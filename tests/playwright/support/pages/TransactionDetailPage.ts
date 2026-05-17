import { Page, Locator } from '@playwright/test';

export class TransactionDetailPage {
    readonly page: Page;
    readonly detailHeader: Locator;
    readonly transactionDescription: Locator;
    readonly senderAvatar: Locator;
    readonly receiverAvatar: Locator;
    readonly likeCount: Locator;
    readonly commentsList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.detailHeader = page.getByTestId('transaction-detail-header');
        this.transactionDescription = page.getByTestId('transaction-description');
        this.senderAvatar = page.getByTestId('transaction-sender-avatar');
        this.receiverAvatar = page.getByTestId('transaction-receiver-avatar');
        this.likeCount = page.locator('[data-test^="transaction-like-count-"]').first();
        this.commentsList = page.getByTestId('comments-list');
    }

    likeButton(): Locator {
        return this.page.locator('[data-test^="transaction-like-button"]').first();
    }

    commentInput(): Locator {
        return this.page.locator('[data-test^="transaction-comment-input"]').first();
    }

    transactionAmount(): Locator {
        return this.page.locator('[data-test^="transaction-amount-"]').first();
    }
}
