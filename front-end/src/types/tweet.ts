export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified?: boolean;
}

export interface TweetType {
  id: string;
  user: User;
  content: string;
  media?: string;
  timestamp: string;
  replies: number;
  retweets: number;
  likes: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isBookmarked: boolean;
}