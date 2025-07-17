import { useState } from 'react';
import TweetList from '../components/tweet/TweetList';
import TweetComposer from '../components/tweet/TweetComposer';
const HomePage = () => {
	const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');

	return (
		<div className="min-h-screen animate-enter">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-800">
				<h1 className="font-bold text-xl p-4">Home</h1>

				{/* Tabs */}
				<div className="flex">
					<button
						onClick={() => setActiveTab('for-you')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'for-you'
								? 'font-bold'
								: 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						For you
						{activeTab === 'for-you' && (
							<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
						)}
					</button>
					<button
						onClick={() => setActiveTab('following')}
						className={`flex-1 py-4 text-center font-medium relative ${
							activeTab === 'following'
								? 'font-bold'
								: 'text-text-secondary-light dark:text-text-secondary-dark'
						}`}
					>
						Following
						{activeTab === 'following' && (
							<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-500 rounded-full" />
						)}
					</button>
				</div>
			</header>

			{/* Tweet Composer */}
			<TweetComposer />

			{/* Tweet Feed */}
			<TweetList key={activeTab} activeTab={activeTab} />
		</div>
	);
};

export default HomePage;
