import { test, expect } from '../../fixtures';

test.describe('Transaction Detail', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: View transaction detail page by clicking a transaction in the feed | Suite: UI/Transaction Detail
    test('View transaction detail page by clicking a transaction in the feed', async ({ page, transactionFeedPage, transactionDetailPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionItems.first()).toBeVisible();

        await transactionFeedPage.transactionItems.first().click();
        await expect(page).toHaveURL(/\/transaction\/.+/);
        await expect(transactionDetailPage.detailHeader).toBeVisible();
    });

    // Qase: Like a transaction on the transaction detail page | Suite: UI/Transaction Detail
    test('Like a transaction on the transaction detail page', async ({ page, transactionFeedPage, transactionDetailPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionItems.first()).toBeVisible();

        await transactionFeedPage.transactionItems.first().click();
        await expect(page).toHaveURL(/\/transaction\/.+/);

        const initialCountText = await transactionDetailPage.likeCount.innerText();
        const initialCount = parseInt(initialCountText.trim(), 10);

        await transactionDetailPage.likeButton().click();
        await expect(transactionDetailPage.likeCount).toContainText(String(initialCount + 1));
    });

    // Qase: Write and submit a comment on the transaction detail page | Suite: UI/Transaction Detail
    test('Write and submit a comment on the transaction detail page', async ({ page, transactionFeedPage, transactionDetailPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionItems.first()).toBeVisible();

        await transactionFeedPage.transactionItems.first().click();
        await expect(page).toHaveURL(/\/transaction\/.+/);

        await transactionDetailPage.commentInput().fill('Great transaction!');
        await transactionDetailPage.commentInput().press('Enter');

        await expect(transactionDetailPage.commentsList.getByText('Great transaction!')).toBeVisible();
    });

    // Qase: Verify transaction detail page displays sender, receiver, and amount | Suite: UI/Transaction Detail
    test('Verify transaction detail page displays sender, receiver, and amount', async ({ page, transactionFeedPage, transactionDetailPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionItems.first()).toBeVisible();

        await transactionFeedPage.transactionItems.first().click();
        await expect(page).toHaveURL(/\/transaction\/.+/);

        await expect(transactionDetailPage.transactionDescription).toBeVisible();
        await expect(transactionDetailPage.transactionAmount()).toBeVisible();
        await expect(transactionDetailPage.senderAvatar).toBeVisible();
        await expect(transactionDetailPage.receiverAvatar).toBeVisible();
    });

});
