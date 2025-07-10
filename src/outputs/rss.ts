import RSS from 'rss';
import fs from 'fs-extra';
import path from 'path';
import { Tweet } from '../sources/twitter.js';

export interface RSSConfig {
    title: string;
    description: string;
    feed_url: string;
    site_url: string;
    language: string;
}

export class RSSGenerator {
    private outputDir: string;

    constructor(outputDir: string = './feeds') {
        this.outputDir = outputDir;
    }

    async generateFeed(category: string, tweets: Tweet[], config: RSSConfig): Promise<string> {
        const feed = new RSS({
            title: `${config.title} - ${category}`,
            description: `${config.description} - ${category} category`,
            feed_url: `${config.feed_url}/${category}.xml`,
            site_url: config.site_url,
            language: config.language,
            pubDate: new Date().toISOString(),
            ttl: 60
        });

        // Sort tweets by creation date (newest first)
        const sortedTweets = tweets.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        for (const tweet of sortedTweets) {
            const tweetUrl = `https://twitter.com/${tweet.author?.username || 'unknown'}/status/${tweet.id}`;

            feed.item({
                title: this.truncateText(tweet.text, 100),
                description: this.formatTweetDescription(tweet),
                url: tweetUrl,
                guid: tweet.id,
                date: new Date(tweet.created_at),
                author: tweet.author?.name || 'Unknown'
            });
        }

        const xml = feed.xml({ indent: true });
        const filename = `${category.toLowerCase().replace(/\s+/g, '-')}.xml`;
        const filepath = path.join(this.outputDir, filename);

        // Ensure output directory exists
        await fs.ensureDir(this.outputDir);

        // Write RSS file
        await fs.writeFile(filepath, xml, 'utf8');

        console.log(`Generated RSS feed: ${filepath}`);
        return filepath;
    }

    async generateAllFeeds(tweetsByCategory: Map<string, Tweet[]>, config: RSSConfig): Promise<string[]> {
        const generatedFiles: string[] = [];

        for (const [category, tweets] of tweetsByCategory) {
            if (tweets.length > 0) {
                const filepath = await this.generateFeed(category, tweets, config);
                generatedFiles.push(filepath);
            }
        }

        return generatedFiles;
    }

    private truncateText(text: string, maxLength: number): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    private formatTweetDescription(tweet: Tweet): string {
        const metrics = tweet.public_metrics;
        const author = tweet.author ? `@${tweet.author.username}` : 'Unknown';

        return `
      <p><strong>${author}</strong></p>
      <p>${tweet.text}</p>
      <p><small>
        👍 ${metrics.like_count} | 
        🔄 ${metrics.retweet_count} | 
        💬 ${metrics.reply_count} | 
        📝 ${metrics.quote_count}
      </small></p>
    `.trim();
    }
}