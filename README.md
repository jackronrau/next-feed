# Next Feed - RSS Generator for Twitter

A simple RSS feed generator that collects tweets based on business and marketing keywords and generates RSS feeds for each category.

## Features

- 🐦 Fetches tweets from Twitter API based on predefined keywords
- 📊 Organizes content into 7 business categories
- 📰 Generates RSS feeds for each category
- ⚡ Simple CLI interface
- 🔄 Built-in rate limiting

## Categories

- **SaaS** - Software as a Service insights
- **Affiliate Marketing** - Affiliate marketing strategies and results
- **SEO** - Search engine optimization tips and case studies
- **Paid Advertising** - Facebook, Google, and other paid advertising
- **E-commerce** - Dropshipping, Amazon FBA, and online stores
- **Creator Economy** - Content creation and monetization
- **AI & Technology** - AI tools and tech business insights

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Twitter API Key:
   ```
   TWITTER_API_KEY=your_twitter_api_key_here
   OUTPUT_DIR=./feeds
   ```

3. **Get Twitter API Access:**
   - Get API access from [TwitterAPI.io](https://twitterapi.io/)
   - Sign up and get your API key
   - This service provides easier access to Twitter data without complex OAuth

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Output

The tool generates RSS XML files in the `feeds/` directory:
- `saas.xml`
- `affiliate-marketing.xml`
- `seo.xml`
- `paid-advertising.xml`
- `e-commerce.xml`
- `creator-economy.xml`
- `ai-technology.xml`

Each RSS feed contains:
- Tweet content
- Author information
- Engagement metrics (likes, retweets, replies)
- Direct links to original tweets

## Configuration

Keywords are defined in `src/keywords/index.ts`. Each category contains multiple search queries with:
- Minimum engagement thresholds (`min_faves`)
- Language filtering (`lang:en`)
- Retweet exclusion (`-is:retweet`)
- Boolean operators for complex searches

## Rate Limiting

The tool includes built-in rate limiting:
- 2-second delay between keyword searches
- 1-second delay between API requests
- Maximum 10 tweets per keyword search

## License

MIT