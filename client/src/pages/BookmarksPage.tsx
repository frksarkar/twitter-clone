import { useState } from 'react';
import Tweet from '../components/tweet/Tweet';
import { mockTweets } from '../data/mockData';
import { MoreHorizontal, Share } from 'lucide-react';

const BookmarksPage = () => {
  // Filter bookmarked tweets
  const [bookmarkedTweets, setBookmarkedTweets] = useState(
    mockTweets.filter(tweet => tweet.isBookmarked)
  );

  const handleLike = (id: string) => {
    setBookmarkedTweets(
      bookmarkedTweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isLiked: !tweet.isLiked, likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1 } : tweet
      )
    );
  };

  const handleRetweet = (id: string) => {
    setBookmarkedTweets(
      bookmarkedTweets.map((tweet) =>
        tweet.id === id
          ? { ...tweet, isRetweeted: !tweet.isRetweeted, retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1 }
          : tweet
      )
    );
  };

  const handleBookmark = (id: string) => {
    setBookmarkedTweets(
      bookmarkedTweets.map((tweet) =>
        tweet.id === id ? { ...tweet, isBookmarked: !tweet.isBookmarked } : tweet
      ).filter(tweet => tweet.isBookmarked) // Remove tweets that are no longer bookmarked
    );
  };

  return (
    <div className="min-h-screen animate-enter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-xl">Bookmarks</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">@johndoe</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
            <Share size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Bookmarked Tweets */}
      {bookmarkedTweets.length > 0 ? (
        <div>
          {bookmarkedTweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              onLike={handleLike}
              onRetweet={handleRetweet}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">You haven't added any Tweets to your Bookmarks yet</h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            When you do, they'll show up here.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;