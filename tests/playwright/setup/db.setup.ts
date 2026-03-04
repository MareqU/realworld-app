import { test as setup } from '../fixtures';

setup('seed database', async ({ seedDatabase }) => {
    // This uses your existing fixture!
    await seedDatabase(); 
});