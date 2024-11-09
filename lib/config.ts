export const config = {
  googleCustomSearch: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    searchEngineId: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID || '',
  },
  youtube: {
    apiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
  },
  newsApi: {
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
  },
};