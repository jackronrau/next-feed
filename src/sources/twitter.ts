export interface Tweet {
    id: string;
    text: string;
    author_id: string;
    created_at: string;
    public_metrics: {
        retweet_count: number;
        like_count: number;
        reply_count: number;
        quote_count: number;
    };
    author?: {
        id: string;
        name: string;
        username: string;
    };
}

export interface TwitterAPITweet {
    type: string;
    id: string;
    url: string;
    twitterUrl: string;
    text: string;
    source: string;
    retweetCount: number;
    replyCount: number;
    likeCount: number;
    quoteCount: number;
    viewCount: number;
    createdAt: string;
    lang: string;
    bookmarkCount: number;
    isReply: boolean;
    inReplyToId?: string;
    conversationId: string;
    inReplyToUserId?: string;
    inReplyToUsername?: string;
    author: {
        id: string;
        name: string;
        username: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface TwitterAPIResponse {
    tweets: TwitterAPITweet[];
}

export class TwitterSource {
    private apiKey: string;
    private baseUrl = 'https://api.twitterapi.io/twitter/tweet';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async searchTweets(query: string, maxResults: number = 10): Promise<Tweet[]> {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'X-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            };

            // Encode the query for URL
            const encodedQuery = encodeURIComponent(query);
            const url = `${this.baseUrl}/advanced_search?query=${encodedQuery}&max_results=${maxResults}`;

            console.log(`Fetching: ${url.substring(0, 100)}...`);

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: TwitterAPIResponse = await response.json();

            const tweets: Tweet[] = [];

            if (data.tweets && Array.isArray(data.tweets)) {
                for (const tweetData of data.tweets) {
                    // Convert the API format to our internal format
                    tweets.push({
                        id: tweetData.id,
                        text: tweetData.text,
                        author_id: tweetData.author.id,
                        created_at: tweetData.createdAt,
                        public_metrics: {
                            retweet_count: tweetData.retweetCount || 0,
                            like_count: tweetData.likeCount || 0,
                            reply_count: tweetData.replyCount || 0,
                            quote_count: tweetData.quoteCount || 0
                        },
                        author: {
                            id: tweetData.author.id,
                            name: tweetData.author.name,
                            username: tweetData.author.username
                        }
                    });
                }
            }

            console.log(`Found ${tweets.length} tweets for query`);
            return tweets;

        } catch (error) {
            console.error('Error searching tweets:', error);
            return [];
        }
    }

    async searchByKeywords(keywords: string[]): Promise<Map<string, Tweet[]>> {
        const results = new Map<string, Tweet[]>();

        for (const keyword of keywords) {
            console.log(`Searching for: ${keyword.substring(0, 60)}...`);
            const tweets = await this.searchTweets(keyword, 20);
            results.set(keyword, tweets);

            // Rate limiting - wait 2 seconds between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return results;
    }
}