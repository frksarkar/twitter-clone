import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowButton from '../profile/FollowButton';

const RightSidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock trending data
  const trendingTopics = [
    { id: 1, category: 'Technology', title: '#ReactJS', tweets: '125K' },
    { id: 2, category: 'Sports', title: 'Premier League', tweets: '85K' },
    { id: 3, category: 'Politics', title: '#Election2025', tweets: '65K' },
    { id: 4, category: 'Entertainment', title: 'New Movie Release', tweets: '43K' },
    { id: 5, category: 'Business', title: '#StockMarket', tweets: '35K' },
  ];

  // Mock suggestions
  const suggestedUsers = [
    { 
      id: 'user2', 
      name: 'Jane Smith', 
      username: 'janesmith', 
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: true,
      bio: 'UX Designer | Travel Enthusiast'
    },
    { 
      id: 'user3', 
      name: 'Alex Johnson', 
      username: 'alexj', 
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: false,
      bio: 'Tech enthusiast and book lover'
    },
    { 
      id: 'user4', 
      name: 'Sarah Wilson', 
      username: 'sarahw', 
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=60',
      verified: true,
      bio: 'Entrepreneur | Startup founder'
    },
  ];

  return (
    <div className="p-4 space-y-6 h-screen overflow-y-auto sticky top-0">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-text-secondary-light dark:text-text-secondary-dark" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-secondary-50 dark:bg-secondary-800 text-text-primary-light dark:text-text-primary-dark rounded-full py-2 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X size={18} className="text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        )}
      </div>

      {/* Trending */}
      <div className="bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
        <h2 className="font-bold text-xl p-4">Trends for you</h2>
        <div>
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="px-4 py-3 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors cursor-pointer">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{topic.category}</p>
              <p className="font-bold">{topic.title}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{topic.tweets} Tweets</p>
            </div>
          ))}
        </div>
        <Link to="/explore" className="block p-4 text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-b-2xl transition-colors">
          Show more
        </Link>
      </div>

      {/* Who to follow */}
      <div className="bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
        <h2 className="font-bold text-xl p-4">Who to follow</h2>
        <div>
          {suggestedUsers.map((user) => (
            <div key={user.id} className="px-4 py-3 flex items-start hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
              <Link to={`/profile/${user.username}`} className="flex-shrink-0 mr-3">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <Link to={`/profile/${user.username}`} className="font-bold hover:underline truncate">
                    {user.name}
                  </Link>
                  {user.verified && (
                    <svg className="w-4 h-4 ml-1 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <Link to={`/profile/${user.username}`} className="text-text-secondary-light dark:text-text-secondary-dark text-sm hover:underline block truncate">
                  @{user.username}
                </Link>
                {user.bio && (
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1 line-clamp-2">
                    {user.bio}
                  </p>
                )}
                <div className="mt-2">
                  <FollowButton 
                    targetUserId={user.id}
                    targetUsername={user.username}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link to="/connect" className="block p-4 text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-b-2xl transition-colors">
          Show more
        </Link>
      </div>

      {/* Footer */}
      <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark space-x-2">
        <Link to="/terms" className="hover:underline">Terms of Service</Link>
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link to="/cookies" className="hover:underline">Cookie Policy</Link>
        <Link to="/accessibility" className="hover:underline">Accessibility</Link>
        <Link to="/ads" className="hover:underline">Ads Info</Link>
        <p className="mt-2">© 2025 Chirper</p>
      </div>
    </div>
  );
};

export default RightSidebar;