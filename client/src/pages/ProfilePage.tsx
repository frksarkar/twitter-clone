import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, LinkIcon, MapPin, MoreHorizontal } from 'lucide-react';
import { mockUsers, mockTweets } from '../data/mockData';
import Tweet from '../components/tweet/Tweet';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'tweets' | 'replies' | 'media' | 'likes'>('tweets');
  
  // Find user by username
  const user = mockUsers.find(user => user.username === username) || mockUsers[0];
  
  // Filter tweets by user
  const userTweets = mockTweets.filter(tweet => tweet.user.username === username);
  
  // Initial state for tweets
  const [tweets, setTweets] = useState(userTweets);
  
  const handleLike = (id: string) => {
    setTweets(
      tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isLiked: !tweet.isLiked, likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1 } : tweet
      )
    );
  };

  const handleRetweet = (id: string) => {
    setTweets(
      tweets.map((tweet) =>
        tweet.id === id
          ? { ...tweet, isRetweeted: !tweet.isRetweeted, retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1 }
          : tweet
      )
    );
  };

  const handleBookmark = (id: string) => {
    setTweets(
      tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isBookmarked: !tweet.isBookmarked } : tweet
      )
    );
  };

  return (
    <div className="min-h-screen animate-enter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-xl">{user.name}</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">{userTweets.length} Tweets</p>
        </div>
      </header>

      {/* Profile Info */}
      <div>
        {/* Cover Photo */}
        <div className="h-48 bg-secondary-200 dark:bg-secondary-800 relative">
          <img 
            src={user.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Profile Picture & Buttons */}
        <div className="px-4 pb-4 relative">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-32 h-32 rounded-full object-cover border-4 border-background-light dark:border-background-dark absolute -top-16" 
          />
          
          <div className="flex justify-end mt-4 mb-12">
            <button className="p-2 rounded-full border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors mr-2">
              <MoreHorizontal size={20} />
            </button>
            <button className="px-4 py-2 bg-text-primary-light dark:bg-text-primary-dark text-background-light dark:text-background-dark font-bold rounded-full hover:opacity-90 transition-opacity">
              Follow
            </button>
          </div>
          
          {/* User Info */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">@{user.username}</p>
            
            <p className="mt-3">{user.bio}</p>
            
            <div className="flex flex-wrap mt-3 text-text-secondary-light dark:text-text-secondary-dark">
              {user.location && (
                <div className="flex items-center mr-4 mb-2">
                  <MapPin size={18} className="mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center mr-4 mb-2">
                  <LinkIcon size={18} className="mr-1" />
                  <a href={`https://${user.website}`} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center mb-2">
                <Calendar size={18} className="mr-1" />
                <span>Joined {user.joined}</span>
              </div>
            </div>
            
            <div className="flex mt-3">
              <div className="mr-4">
                <span className="font-bold">{user.following}</span>{' '}
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Following</span>
              </div>
              <div>
                <span className="font-bold">{user.followers}</span>{' '}
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Followers</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-secondary-100 dark:border-secondary-800">
          <button
            onClick={() => setActiveTab('tweets')}
            className={`flex-1 py-4 text-center font-medium relative ${
              activeTab === 'tweets' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            Tweets
            {activeTab === 'tweets' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('replies')}
            className={`flex-1 py-4 text-center font-medium relative ${
              activeTab === 'replies' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            Replies
            {activeTab === 'replies' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-4 text-center font-medium relative ${
              activeTab === 'media' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            Media
            {activeTab === 'media' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-4 text-center font-medium relative ${
              activeTab === 'likes' ? 'font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            Likes
            {activeTab === 'likes' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
            )}
          </button>
        </div>
        
        {/* Tweets Section */}
        {activeTab === 'tweets' && (
          <div>
            {tweets.map((tweet) => (
              <Tweet
                key={tweet.id}
                tweet={tweet}
                onLike={handleLike}
                onRetweet={handleRetweet}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}
        
        {/* Other tabs would show different content */}
        {activeTab !== 'tweets' && (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[30vh]">
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === 'replies' && "No replies yet"}
              {activeTab === 'media' && "No media tweets yet"}
              {activeTab === 'likes' && "No likes yet"}
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              When they appear, they'll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;