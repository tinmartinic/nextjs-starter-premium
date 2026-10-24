const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Save crawling budget by not fetching SSG meta files
const NEXT_SSG_FILES = [
  '/*.json$',
  '/*_buildManifest.js$',
  '/*_middlewareManifest.js$',
  '/*_ssgManifest.js$',
  '/.next/*',
  '/node_modules/*',
];

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    filePath: './public/robots.txt', // Where to generate the robots.txt and sitemaps
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: NEXT_SSG_FILES,
      },
    ],
  },
};

module.exports = config;
