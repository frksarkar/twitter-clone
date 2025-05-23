import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Repeat, Heart, Bookmark, Share, MoreHorizontal, FileHeart as HeartFilled, Bookmark as BookmarkFilled, Repeat as RepeatFilled } from 'lucide-react';
import { TweetType } from '../../types/tweet';

interface TweetProps {
  tweet: TweetType;
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onBookmark: (id: string) => void;
}

const Tweet = ({ tweet, onLike, onRetweet, onBookmark }: TweetProps) => {
  const { 
    id, 
    user, 
    content, 
    media, 
    timestamp, 
    replies, 
    retweets, 
    likes, 
    isLiked, 
    isRetweeted, 
    isBookmarked 
  } = tweet;

  return (
    <article className="border-b border-secondary-100 dark:border-secondary-800 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-900/50 transition-colors cursor-pointer">
      {/* Tweet Header */}
      <div className="flex">
        <Link to={`/profile/${user.username}`} className="flex-shrink-0 mr-3">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-baseline">
            <Link to={`/profile/${user.username}`} className="font-bold hover:underline truncate">
              {user.name}
            </Link>
            <Link to={`/profile/${user.username}`} className="text-text-secondary-light dark:text-text-secondary-dark ml-1 truncate hover:underline">
              @{user.username}
            </Link>
            <span className="text-text-secondary-light dark:text-text-secondary-dark mx-1">·</span>
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:underline">
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </span>
            <button className="ml-auto text-text-secondary-light dark:text-text-secondary-dark p-1 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 hover:text-primary-500 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          {/* Tweet Content */}
          <Link to={`/tweet/${id}`}>
            <p className="mt-1 whitespace-pre-wrap">{content}</p>
            
            {/* Media */}
            {media && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-secondary-100 dark:border-secondary-800">
                <img 
                  src={media} 
                  alt="Tweet media" 
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
          </Link>
          
          {/* Tweet Actions */}
          <div className="flex justify-between mt-3 text-text-secondary-light dark:text-text-secondary-dark max-w-md">
            <button className="flex items-center group">
              <span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
                <MessageCircle size={18} />
              </span>
              <span className="ml-1 text-sm group-hover:text-primary-500">{replies}</span>
            </button>
            
            <button 
              onClick={() => onRetweet(id)}
              className={`flex items-center group ${isRetweeted ? 'text-success-500' : ''}`}
            >
              <span className="p-2 rounded-full group-hover:bg-success-500/10 group-hover:text-success-500 transition-colors">
                {isRetweeted ? <RepeatFilled size={18} /> : <Repeat size={18} />}
              </span>
              <span className={`ml-1 text-sm ${isRetweeted ? 'text-success-500' : 'group-hover:text-success-500'}`}>{retweets}</span>
            </button>
            
            <button 
              onClick={() => onLike(id)}
              className={`flex items-center group ${isLiked ? 'text-error-500' : ''}`}
            >
              <span className="p-2 rounded-full group-hover:bg-error-500/10 group-hover:text-error-500 transition-colors">
                {isLiked ? <HeartFilled size={18} /> : <Heart size={18} />}
              </span>
              <span className={`ml-1 text-sm ${isLiked ? 'text-error-500' : 'group-hover:text-error-500'}`}>{likes}</span>
            </button>
            
            <button 
              onClick={() => onBookmark(id)}
              className={`flex items-center group ${isBookmarked ? 'text-primary-500' : ''}`}
            >
              <span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
                {isBookmarked ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
              </span>
            </button>
            
            <button className="flex items-center group">
              <span className="p-2 rounded-full group-hover:bg-primary-50 dark:group-hover:bg-secondary-800 group-hover:text-primary-500 transition-colors">
                <Share size={18} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Tweet;