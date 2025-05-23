import { useState, useRef } from 'react';
import { Image, MapPin, Smile, Calendar, X, BarChart } from 'lucide-react';

const MAX_TWEET_LENGTH = 280;

const TweetComposer = () => {
  const [tweetContent, setTweetContent] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const remainingChars = MAX_TWEET_LENGTH - tweetContent.length;
  const isOverLimit = remainingChars < 0;
  
  const handleTweetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetContent(e.target.value);
  };
  
  const handleMediaClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeMedia = () => {
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleTweetSubmit = () => {
    if (tweetContent && !isOverLimit) {
      console.log('Tweet posted:', tweetContent);
      console.log('Media:', mediaPreview);
      
      // Reset form
      setTweetContent('');
      setMediaPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="border-b border-secondary-100 dark:border-secondary-800 p-4">
      <div className="flex">
        <img 
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60" 
          alt="Profile" 
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div className="flex-1">
          <textarea
            placeholder="What's happening?"
            value={tweetContent}
            onChange={handleTweetChange}
            className="w-full bg-transparent border-none outline-none resize-none text-lg"
            rows={2}
          />
          
          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative mt-2 rounded-2xl overflow-hidden">
              <img src={mediaPreview} alt="Media preview" className="w-full h-auto max-h-80 object-cover rounded-2xl" />
              <button 
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white"
              >
                <X size={18} />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-secondary-100 dark:border-secondary-800">
            <div className="flex space-x-2 text-primary-500">
              <button onClick={handleMediaClick} className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
                <Image size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
                <BarChart size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
                <Smile size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
                <Calendar size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-secondary-800 transition-colors">
                <MapPin size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {tweetContent.length > 0 && (
                <div className={`text-sm ${isOverLimit ? 'text-error-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
                  {remainingChars}
                </div>
              )}
              <button
                onClick={handleTweetSubmit}
                disabled={!tweetContent || isOverLimit}
                className={`px-5 py-2 bg-primary-500 text-white font-bold rounded-full transition-colors ${
                  (!tweetContent || isOverLimit) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
                }`}
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;