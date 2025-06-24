import { getKey } from 'config/storageConfig';
import { Alert } from 'react-native';
import { YouTubeSearchResponse } from 'types/YoutubeSearch';

export const useYoutube = () => {
  const searchSongs = async (searchTerm: string) => {
    let apiKey, apiUrl;

    try {
      apiKey = await getKey('YOUTUBE_API_KEY');
      apiUrl = await getKey('API_BASE_URL');
    } catch (error: unknown) {
      Alert.alert('Error', (error as Error).message);
    }

    if (!apiKey || !apiUrl) return;

    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      searchTerm
    )}&videoCategoryId=10&maxResults=10&order=relevance&key=${apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data: YouTubeSearchResponse = await response.json();

      return data.items;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      throw error;
    }
  };

  return {
    searchSongs,
  };
};
