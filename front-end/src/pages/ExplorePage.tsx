import { Search as SearchIcon } from 'lucide-react';
import { mockTrends, mockTweets } from '../data/mockData';

const ExplorePage = () => {
  // Filter tweets with media for the "Photos" section
  const mediaContent = mockTweets.filter(tweet => tweet.media);
  
  return (
    <div className="min-h-screen animate-enter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-text-secondary-light dark:text-text-secondary-dark" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="bg-secondary-50 dark:bg-secondary-800 text-text-primary-light dark:text-text-primary-dark rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </header>
      
      {/* Trending */}
      <section>
        <h2 className="font-bold text-xl p-4">Trends for you</h2>
        <div className="space-y-1">
          {mockTrends.map((trend) => (
            <div key={trend.id} className="px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Trending</p>
              <p className="font-bold">{trend.name}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{trend.tweets} Tweets</p>
            </div>
          ))}
        </div>
      </section>
      
      <div className="h-3 bg-secondary-50 dark:bg-secondary-900 my-3" />
      
      {/* Photos/Media Section */}
      <section>
        <h2 className="font-bold text-xl p-4">Photos</h2>
        <div className="grid grid-cols-2 gap-0.5 p-1">
          {mediaContent.map((tweet) => (
            <div key={tweet.id} className="aspect-square overflow-hidden">
              <img 
                src={tweet.media} 
                alt="Media content" 
                className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>
      
      <div className="h-3 bg-secondary-50 dark:bg-secondary-900 my-3" />
      
      {/* News Section - Simulated */}
      <section>
        <h2 className="font-bold text-xl p-4">What's happening</h2>
        <div className="space-y-1">
          <div className="px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Technology · Trending</p>
            <p className="font-bold">Web Development in 2025</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">52.7K Tweets</p>
          </div>
          <div className="px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Sports · Live</p>
            <p className="font-bold">Champions League Finals</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">122K Tweets</p>
          </div>
          <div className="px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Entertainment · Trending</p>
            <p className="font-bold">New streaming service launches today</p>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">18.5K Tweets</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;