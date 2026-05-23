import { connectDB } from '../config/db';
import { seedReviewData } from './seed';

(async () => {
    const db = await connectDB();
    await seedReviewData(db);
    console.log('Review data seeded successfully');
    process.exit(0);
})();