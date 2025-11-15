/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'pbs.twimg.com',
      'yt3.ggpht.com',
      'i.ytimg.com',
      'scontent.cdninstagram.com',
      'graph.facebook.com',
      'cdn.discordapp.com',
      'steamcdn-a.akamaihd.net',
      'substackcdn.com'
    ],
  },
}

module.exports = nextConfig


