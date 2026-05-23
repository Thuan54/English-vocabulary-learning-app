import { Db, ObjectId } from 'mongodb';

export async function seedReviewData(db: Db): Promise<void> {
    const now = new Date();
    
    await db.collection('words').deleteMany({});
    await db.collection('reviews').deleteMany({});

    const words = [
        { _id: new ObjectId(), word: 'ephemeral', meaning: 'lasting a very short time' },
        { _id: new ObjectId(), word: 'ubiquitous', meaning: 'present everywhere' },
        { _id: new ObjectId(), word: 'serendipity', meaning: 'a happy accident' },
        { _id: new ObjectId(), word: 'resilient', meaning: 'able to recover quickly' },
        { _id: new ObjectId(), word: 'pragmatic', meaning: 'dealing with things sensibly' },
    ];

    await db.collection('words').insertMany(words);

    const reviews = [
        // Due now (overdue by 1 hour) - newly learned
        { wordId: words[0]._id, nextReview: new Date(now.getTime() - 3600000), srs: { interval: 1, repetition: 0, ease: 2.5 }, createdAt: now },
        // Due now (overdue by 1 day) - failed review, reset state
        { wordId: words[1]._id, nextReview: new Date(now.getTime() - 86400000), srs: { interval: 1, repetition: 0, ease: 1.3 }, createdAt: now },
        // Due tomorrow (passed once)
        { wordId: words[2]._id, nextReview: new Date(now.getTime() + 86400000), srs: { interval: 1, repetition: 1, ease: 2.5 }, createdAt: now },
        // Due next week (passed multiple times)
        { wordId: words[3]._id, nextReview: new Date(now.getTime() + 604800000), srs: { interval: 7, repetition: 3, ease: 2.8 }, createdAt: now },
        // Due next month (mastered)
        { wordId: words[4]._id, nextReview: new Date(now.getTime() + 2592000000), srs: { interval: 30, repetition: 8, ease: 3.2 }, createdAt: now },
    ];

    await db.collection('reviews').insertMany(reviews);
}