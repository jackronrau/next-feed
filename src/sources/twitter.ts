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

export interface TwitterAPIResponse {
    data?: {
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
    }[];
    includes?: {
        users?: {
            id: string;
            name: string;
            username: string;
        }[];
    };
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

            if (data.data) {
                for (const tweetData of data.data) {
                    // Find author info from includes if available
                    const author = data.includes?.users?.find(
                        user => user.id === tweetData.author_id
                    );

                    tweets.push({
                        id: tweetData.id,
                        text: tweetData.text,
                        author_id: tweetData.author_id,
                        created_at: tweetData.created_at,
                        public_metrics: tweetData.public_metrics,
                        author: author ? {
                            id: author.id,
                            name: author.name,
                            username: author.username
                        } : tweetData.author
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