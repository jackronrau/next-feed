import dotenv from 'dotenv';
import { TwitterSource, Tweet } from './sources/twitter.js';
import { RSSGenerator, RSSConfig } from './outputs/rss.js';
import { TWITTER_KEYWORDS, getAllCategories } from './keywords/index.js';

// Load environment variables
dotenv.config();

async function main() {
    console.log('🚀 Starting RSS Feed Generator...');

    // Check for required environment variables
    const apiKey = process.env.TWITTER_API_KEY;
    if (!apiKey) {
      console.error('❌ TWITTER_API_KEY is required in .env file');
      process.exit(1);
    }

    const outputDir = process.env.OUTPUT_DIR || './feeds';

    // Initialize services
    const twitterSource = new TwitterSource(apiKey);
    const rssGenerator = new RSSGenerator(outputDir);

    // RSS configuration
    const rssConfig: RSSConfig = {
        title: 'Business & Marketing Insights',
        description: 'Curated tweets about business, marketing, and entrepreneurship',
        feed_url: 'https://your-domain.com/feeds',
        site_url: 'https://your-domain.com',
        language: 'en'
    };

    console.log('📊 Categories to process:', getAllCategories().join(', '));

    const allTweetsByCategory = new Map<string, Tweet[]>();

    // Process each category
    for (const category of getAllCategories()) {
        console.log(`\n🔍 Processing category: ${category}`);

        const keywords = TWITTER_KEYWORDS[category as keyof typeof TWITTER_KEYWORDS];
        const categoryTweets: Tweet[] = [];

        // Search tweets for each keyword in the category
        for (const keyword of keywords) {
            console.log(`  Searching: ${keyword.substring(0, 50)}...`);

            try {
                const tweets = await twitterSource.searchTweets(keyword, 10);
                categoryTweets.push(...tweets);
                console.log(`    Found ${tweets.length} tweets`);

                // Rate limiting - wait between requests
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`    Error searching keyword: ${error}`);
            }
        }

        // Remove duplicates by tweet ID
        const uniqueTweets = Array.from(
            new Map(categoryTweets.map(tweet => [tweet.id, tweet])).values()
        );

        console.log(`  Total unique tweets for ${category}: ${uniqueTweets.length}`);
        allTweetsByCategory.set(category, uniqueTweets);
    }

    // Generate RSS feeds
    console.log('\n📝 Generating RSS feeds...');
    try {
        const generatedFiles = await rssGenerator.generateAllFeeds(allTweetsByCategory, rssConfig);

        console.log('\n✅ RSS Generation Complete!');
        console.log('Generated files:');
        generatedFiles.forEach(file => console.log(`  - ${file}`));

        // Summary
        let totalTweets = 0;
        for (const tweets of allTweetsByCategory.values()) {
            totalTweets += tweets.length;
        }

        console.log(`\n📈 Summary:`);
        console.log(`  Categories processed: ${allTweetsByCategory.size}`);
        console.log(`  Total tweets collected: ${totalTweets}`);
        console.log(`  RSS feeds generated: ${generatedFiles.length}`);

    } catch (error) {
        console.error('❌ Error generating RSS feeds:', error);
        process.exit(1);
    }
}

// Handle errors
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled rejection:', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
    process.exit(1);
});

// Run the main function
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});