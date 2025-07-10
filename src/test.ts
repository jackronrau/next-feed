import dotenv from 'dotenv';
import { TwitterSource } from './sources/twitter.js';

// Load environment variables
dotenv.config();

async function testTwitterAPI() {
    console.log('🧪 Testing Twitter API...');

    const apiKey = process.env.TWITTER_API_KEY;
    if (!apiKey) {
        console.error('❌ TWITTER_API_KEY is required in .env file');
        return;
    }

    const twitterSource = new TwitterSource(apiKey);

    // Test with a simple query
    const testQuery = 'SaaS case study';

    console.log(`Testing query: ${testQuery}`);

    try {
        const tweets = await twitterSource.searchTweets(testQuery, 5);

        console.log(`✅ Found ${tweets.length} tweets`);

        if (tweets.length > 0) {
            console.log('\n📝 Sample tweet:');
            const tweet = tweets[0];
            console.log(`- ID: ${tweet.id}`);
            console.log(`- Author: ${tweet.author?.name || 'Unknown'} (@${tweet.author?.username || 'unknown'})`);
            console.log(`- Text: ${tweet.text.substring(0, 100)}...`);
            console.log(`- Likes: ${tweet.public_metrics.like_count}`);
            console.log(`- Retweets: ${tweet.public_metrics.retweet_count}`);
            console.log(`- Created: ${tweet.created_at}`);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testTwitterAPI().catch(console.error);