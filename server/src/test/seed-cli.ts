import { connectDB } from '../config/db';
import { seed } from './seed';

(async () => {
    const db = await connectDB();
    await seed(db);
    console.log('Review data seeded successfully');
    process.exit(0);
})();