import { useState } from 'react';
import Tweet from './Tweet';
import { mockTweets } from '../../data/mockData';

const TweetList = () => {
  const [tweets, setTweets] = useState(mockTweets);

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
  );
};

export default TweetList;