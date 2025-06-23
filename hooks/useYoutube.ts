import { YOUTUBE_API_KEY } from '@env';

export const useYoutube = () => {
  const searchSongs = async (searchTerm: string) => {
    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not found');
    }

    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      searchTerm
    )}&videoCategoryId=10&maxResults=10&order=relevance&key=${YOUTUBE_API_KEY}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      throw error;
    }
  };

  return {
    searchSongs,
  };
};
