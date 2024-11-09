import { config } from './config';

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  thumbnail?: string;
}

export async function searchWeb(query: string, start = 1): Promise<{ items: SearchResult[], totalResults: number }> {
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${config.googleCustomSearch.apiKey}&cx=${config.googleCustomSearch.searchEngineId}&q=${encodeURIComponent(query)}&start=${start}`
  );
  const data = await response.json();
  
  return {
    items: data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src,
    })) || [],
    totalResults: parseInt(data.searchInformation?.totalResults || '0'),
  };
}

export async function searchImages(query: string, start = 1): Promise<{ items: SearchResult[], totalResults: number }> {
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${config.googleCustomSearch.apiKey}&cx=${config.googleCustomSearch.searchEngineId}&q=${encodeURIComponent(query)}&searchType=image&start=${start}`
  );
  const data = await response.json();
  
  return {
    items: data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      thumbnail: item.link,
    })) || [],
    totalResults: parseInt(data.searchInformation?.totalResults || '0'),
  };
}

export interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
  duration: string;
}

export async function searchVideos(query: string, pageToken?: string): Promise<{ items: VideoResult[], nextPageToken?: string }> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${config.youtube.apiKey}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=10${pageToken ? `&pageToken=${pageToken}` : ''}`
  );
  const data = await response.json();
  
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  const statsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${config.youtube.apiKey}&id=${videoIds}&part=statistics,contentDetails`
  );
  const statsData = await statsResponse.json();

  return {
    items: data.items.map((item: any, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      viewCount: statsData.items[index]?.statistics.viewCount || '0',
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      duration: statsData.items[index]?.contentDetails.duration || '',
    })),
    nextPageToken: data.nextPageToken,
  };
}

export interface NewsResult {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  urlToImage: string;
  description: string;
}



export interface NewsResult {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  urlToImage: string;
  description: string;
}

export async function searchNews(query: string, page = 1): Promise<{ articles: NewsResult[], totalResults: number }> {
  if (!config.newsApi.apiKey) {
    throw new Error("Missing News API Key. Please check your environment variables.");
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${config.newsApi.apiKey}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`News API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
    };
  } catch (error) {
    console.error("Error fetching news data:", error);
    return { articles: [], totalResults: 0 };
  }
}
