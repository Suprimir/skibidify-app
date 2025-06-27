export type SearchResponse = {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: SearchItem[];
};

export type VideoResponse = {
  kind: string;
  etag: string;
  items: VideoItem[];
};

export type PlaylistResponse = {
  kind: 'youtube#playlistItemListResponse';
  etag: string;
  items: PlaylistItem[];
};

export type SearchItem = {
  id: { videoId?: string };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    thumbnails?: {
      [key: string]: { url: string };
    };
  };
};

export type PlaylistItem = {
  snippet: {
    resourceId: { videoId: string };
    title: string;
    channelTitle: string;
    description: string;
    thumbnails?: {
      [key: string]: { url: string };
    };
  };
};

export type VideoItem = {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    thumbnails?: {
      [key: string]: { url: string };
    };
  };
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};
