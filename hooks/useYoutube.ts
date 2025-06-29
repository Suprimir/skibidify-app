import { getKey } from '../../config/storageConfig';
import { Alert } from 'react-native';
import { SongBase } from '../../types/Song';
import {
  PlaylistItem,
  PlaylistResponse,
  SearchItem,
  SearchResponse,
  VideoItem,
  VideoResponse,
} from '../../types/YoutubeSearch';

export function convertToSongs(
  items: SearchItem[] | PlaylistItem[] | VideoItem[],
  source: 'search' | 'playlist' | 'video',
): SongBase[] {
  return items.map(item => {
    let id: string;
    let snippet;

    switch (source) {
      case 'search':
        const sItem = item as SearchItem;
        id = sItem.id.videoId || '';
        snippet = sItem.snippet;
        break;

      case 'playlist':
        const pItem = item as PlaylistItem;
        id = pItem.snippet.resourceId.videoId;
        snippet = pItem.snippet;
        break;

      case 'video':
        const vItem = item as VideoItem;
        id = vItem.id;
        snippet = vItem.snippet;
        break;
    }

    const thumbnail =
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      undefined;

    return {
      id,
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      description: snippet.description,
      thumbnail,
    };
  });
}

export const useYoutube = () => {
  const getSongsFromPlaylistURL = async (playlistId: string) => {
    let apiKey, apiUrl;

    try {
      apiKey = await getKey('YOUTUBE_API_KEY');
      apiUrl = await getKey('API_BASE_URL');
    } catch (error: unknown) {
      Alert.alert('Error', (error as Error).message);
    }

    if (!apiKey || !apiUrl) return;

    const endpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data: PlaylistResponse = await response.json();

      const items = convertToSongs(data.items, 'playlist');

      return items;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      throw error;
    }
  };

  const getSongFromURL = async (videoId: string) => {
    let apiKey, apiUrl;

    try {
      apiKey = await getKey('YOUTUBE_API_KEY');
      apiUrl = await getKey('API_BASE_URL');
    } catch (error: unknown) {
      Alert.alert('Error', (error as Error).message);
    }

    if (!apiKey || !apiUrl) return;

    const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data: VideoResponse = await response.json();

      const items = convertToSongs(data.items, 'video');

      const item = items[0];

      return item;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      throw error;
    }
  };

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
      searchTerm,
    )}&videoCategoryId=10&maxResults=10&order=relevance&key=${apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data: SearchResponse = await response.json();

      const items = convertToSongs(data.items, 'search');

      return items;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      throw error;
    }
  };

  return {
    getSongFromURL,
    getSongsFromPlaylistURL,
    searchSongs,
  };
};
