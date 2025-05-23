import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, MessageCircle, Repeat, Heart, Bookmark, Share, FileHeart as HeartFilled, Bookmark as BookmarkFilled, Repeat as RepeatFilled } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { mockTweets } from '../data/mockData';
import TweetComposer from '../components/tweet/TweetComposer';

const TweetPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the tweet by id
  const tweet = mockTweets.find(tweet => tweet.id === id) || mockTweets[0];
  
  // State for interactions
  const [isLiked, setIsLiked] = useState(tweet.isLiked);
  const [isRetweeted, setIsRetweeted] = useState(tweet.isRetweeted);
  const [isBookmarked, setIsBookmarked] = useState(tweet.isBookmarked);
  const [likes, setLikes] = useState(tweet.likes);
  const [retweets, setRetweets] = useState(tweet.retweets);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };
  
  const handleRetweet = () => {
    setIsRetweeted(!isRetweeted);
    setRetweets(isRetweeted ? retweets - 1 : retweets + 1);
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen animate-enter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800 p-4 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-xl">Tweet</h1>
      </header>

      {/* Tweet Detail */}
      <article className="border-b border-secondary-100 dark:border-secondary-800 p-4">
        <div className="flex">
          <Link to={`/profile/${tweet.user.username}`} className="flex-shrink-0 mr-3">
            <img 
              src={tweet.user.avatar} 
              alt={tweet.user.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/profile/${tweet.user.username}`} className="font-bold hover:underline">
                  {tweet.user.name}
                </Link>
                <Link to={`/profile/${tweet.user.username}`} className="text-text-secondary-light dark:text-text-secondary-dark block hover:underline">
                  @{tweet.user.username}
                </Link>
              </div>
              <button className="text-text-secondary-light dark:text-text-secondary-dark p-1 rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-primary-500 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <p className="mt-3 text-xl whitespace-pre-wrap">{tweet.content}</p>
            
            {tweet.media && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
                <img 
                  src={tweet.media} 
                  alt="Tweet media" 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-4">
              {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true })}
            </p>
            
            {/* Stats */}
            <div className="flex border-t border-b border-secondary-100 dark:border-secondary-800 mt-4 py-3">
              <div className="mr-5">
                <span className="font-bold">{retweets}</span>{' '}
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Retweets</span>
              </div>
              <div>
                <span className="font-bold">{likes}</span>{' '}
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Likes</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between py-3 text-text-secondary-light dark:text-text-secondary-dark">
              <button className="flex items-center group">
                <span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
                  <MessageCircle size={20} />
                </span>
              </button>
              
              <button 
                onClick={handleRetweet}
                className={`flex items-center group ${isRetweeted ? 'text-success-500' : ''}`}
              >
                <span className="p-2 rounded-full group-hover:bg-success-500/10 group-hover:text-success-500 transition-colors">
                  {isRetweeted ? <RepeatFilled size={20} /> : <Repeat size={20} />}
                </span>
              </button>
              
              <button 
                onClick={handleLike}
                className={`flex items-center group ${isLiked ? 'text-error-500' : ''}`}
              >
                <span className="p-2 rounded-full group-hover:bg-error-500/10 group-hover:text-error-500 transition-colors">
                  {isLiked ? <HeartFilled size={20} /> : <Heart size={20} />}
                </span>
              </button>
              
              <button 
                onClick={handleBookmark}
                className={`flex items-center group ${isBookmarked ? 'text-primary-500' : ''}`}
              >
                <span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
                  {isBookmarked ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                </span>
              </button>
              
              <button className="flex items-center group">
                <span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
                  <Share size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Reply Composer */}
      <TweetComposer />

      {/* Replies would be listed here */}
      <div className="p-8 text-center">
        <p className="text-text-secondary-light dark:text-text-secondary-dark">No replies yet. Be the first to reply!</p>
      </div>
    </div>
  );
};

export default TweetPage;