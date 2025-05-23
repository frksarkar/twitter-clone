import { TweetType } from '../types/tweet';

export const mockTweets: TweetType[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: true
    },
    content: 'Just got my hands on the new MacBook Pro with the M3 chip. The performance is absolutely mind-blowing! 🚀 #Apple #TechNews',
    media: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '2025-04-20T15:34:00Z',
    replies: 42,
    retweets: 153,
    likes: 798,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Jane Smith',
      username: 'janesmith',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: true
    },
    content: 'The sunrise this morning was absolutely breathtaking. Sometimes you just need to stop and appreciate the simple things in life. 🌅 #GoodMorning #Sunrise',
    media: 'https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '2025-04-20T11:23:00Z',
    replies: 12,
    retweets: 58,
    likes: 423,
    isLiked: true,
    isRetweeted: false,
    isBookmarked: false
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Alex Johnson',
      username: 'alexj',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60'
    },
    content: 'Just finished reading "Atomic Habits" by James Clear. Highly recommend it to anyone looking to make small changes that lead to remarkable results. What books have changed your perspective lately?',
    timestamp: '2025-04-19T22:45:00Z',
    replies: 34,
    retweets: 89,
    likes: 345,
    isLiked: false,
    isRetweeted: true,
    isBookmarked: true
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Sarah Wilson',
      username: 'sarahw',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: true
    },
    content: 'Just launched our new startup! After months of hard work, we\'re finally live. Check out our website and let me know what you think! 🚀\n\nwww.example.com #startup #tech #entrepreneurship',
    timestamp: '2025-04-19T18:12:00Z',
    replies: 76,
    retweets: 245,
    likes: 1024,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Tech News',
      username: 'technews',
      avatar: 'https://images.pexels.com/photos/207580/pexels-photo-207580.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: true
    },
    content: 'BREAKING: Apple announces new AR glasses with revolutionary display technology. Pre-orders start next month. #AppleGlasses #AR #TechNews',
    media: 'https://images.pexels.com/photos/3746055/pexels-photo-3746055.jpeg?auto=compress&cs=tinysrgb&w=800',
    timestamp: '2025-04-19T16:00:00Z',
    replies: 342,
    retweets: 1853,
    likes: 5782,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false
  }
];

export const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60',
    verified: true,
    bio: 'Software Engineer | Coffee Enthusiast | Dog Lover',
    following: 512,
    followers: 1024,
    joined: 'January 2020',
    location: 'San Francisco, CA',
    website: 'johndoe.com',
    coverPhoto: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    username: 'janesmith',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
    verified: true,
    bio: 'UX Designer | Travel Enthusiast | Foodie',
    following: 832,
    followers: 2548,
    joined: 'March 2019',
    location: 'New York, NY',
    website: 'janesmith.design',
    coverPhoto: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const mockTrends = [
  { id: 1, name: '#AppleEvent', tweets: '112K' },
  { id: 2, name: 'Taylor Swift', tweets: '98K' },
  { id: 3, name: '#WorldCup2026', tweets: '85K' },
  { id: 4, name: 'Bitcoin', tweets: '72K' },
  { id: 5, name: '#ClimateAction', tweets: '65K' }
];